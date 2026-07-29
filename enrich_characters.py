#!/usr/bin/env python3
"""
Enrich Chinese character entries with English definitions via the DeepSeek API.

Input:  chinese_characters.json  — [{ "rank": "1", "char": "的", "pinyin": "de" }, ...]
Output: data.json format        — [{ "rank":"1", "char":"的", "pinyin":"de",
                                     "example":"...", "english":"..." }, ...]

Usage:
    python enrich_characters.py --start 0 --end 100
    python enrich_characters.py --start 100 --count 50
    python enrich_characters.py --start 0 --end 500 --output out.json --delay 1.5

Resumption: if the output file already exists, entries whose (rank, char, pinyin)
already appear in it are skipped, so you can re-run safely after a crash.
"""

import argparse
import json
import os
import sys
import time
import requests

# ── DeepSeek API configuration ──────────────────────────────────────────────
#DEEPSEEK_API_KEY = ""          # resolved at runtime from --api-key, api_key file, or env
DEEPSEEK_BASE_URL = "https://api.deepseek.com/v1"
DEEPSEEK_MODEL    = "deepseek-chat"

# ── Processing defaults ─────────────────────────────────────────────────────
SCRIPT_DIR  = os.path.dirname(os.path.abspath(__file__))
API_KEY_FILE = os.path.join(SCRIPT_DIR, "api_key")
DEFAULT_INPUT  = "data/chinese_characters.json"
DEFAULT_OUTPUT = "data_enriched.json"
DEFAULT_DELAY  = 1.0          # seconds between API calls (respect rate limits)
MAX_RETRIES    = 3
RETRY_DELAY    = 5.0          # seconds to wait after a rate-limit / server error


# ── Prompt template ─────────────────────────────────────────────────────────

SYSTEM_PROMPT = """You are a Chinese language expert. Given a Chinese character
and its pinyin reading, provide a concise English definition and an example
Chinese word or short phrase that uses this character with this exact reading.

Return ONLY a JSON object with these fields, no other text:
- "english": a short definition in English under 15 words
- "example": the example word/phrase in Chinese characters.  The Chinese example should be annotated with pinyin after it. Example: 的确 （dí què).
- "extraexample": an alternate example in chinese characters similar to but different from example and slightly longer, under 10 characters.  The extra example should also be annotated with pinyin after it.

Keep definitions precise and dictionary-style. For characters with multiple
readings, the definition must match THIS SPECIFIC reading, not the most common one."""

def build_user_prompt(char: str, pinyin: str) -> str:
    return f'Character: {char}\nPinyin: {pinyin}'


# ── API call ────────────────────────────────────────────────────────────────

def call_deepseek(char: str, pinyin: str,  DEEPSEEK_API_KEY: str) -> dict | None:
    """Call DeepSeek API and return parsed result dict, or None on failure."""
    headers = {
        "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": DEEPSEEK_MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": build_user_prompt(char, pinyin)},
        ],
        "temperature": 0.3,
        "max_tokens": 200,
        "response_format": {"type": "json_object"},
    }

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            resp = requests.post(
                f"{DEEPSEEK_BASE_URL}/chat/completions",
                headers=headers,
                json=payload,
                timeout=30,
            )

            if resp.status_code == 200:
                body = resp.json()
                content = body["choices"][0]["message"]["content"]
                parsed = json.loads(content)
                return parsed

            if resp.status_code == 429:
                print(f"  Rate limited (429). Waiting {RETRY_DELAY}s...", file=sys.stderr)
                time.sleep(RETRY_DELAY)
                continue

            print(f"  HTTP {resp.status_code}: {resp.text[:200]}", file=sys.stderr)
            if attempt < MAX_RETRIES:
                time.sleep(RETRY_DELAY * attempt)
                continue
            return None

        except (requests.RequestException, json.JSONDecodeError, KeyError) as e:
            print(f"  Error (attempt {attempt}/{MAX_RETRIES}): {e}", file=sys.stderr)
            if attempt < MAX_RETRIES:
                time.sleep(RETRY_DELAY * attempt)
            else:
                return None

    return None


# ── Helpers ─────────────────────────────────────────────────────────────────

def build_result(entry: dict, english: str, example: str, example_pinyin: str, extraexample: str) -> dict:
    """Build a single output record in data.json format."""
    result = {
        "rank": entry["rank"],
        "char": entry["char"],
        "pinyin": entry["pinyin"],
        "example": example,
        "extraexample": extraexample,
        "english": english,
    }
    # Only include example_pinyin if non-empty (matches original format)
    if example_pinyin:
        result["example_pinyin"] = example_pinyin
    return result


def entry_key(entry: dict) -> tuple:
    return (entry["rank"], entry["char"], entry["pinyin"])


def load_input(path: str) -> list[dict]:
    """Load the input JSON array."""
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    if not isinstance(data, list):
        raise ValueError(f"Expected a JSON array, got {type(data).__name__}")
    return data


def load_existing_keys(path: str) -> set[tuple]:
    """Load existing output file and return the set of (rank, char, pinyin)
    keys already present, so we can skip them on resumption."""
    if not os.path.exists(path):
        return set()
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        if not isinstance(data, list):
            return set()
        return {entry_key(e) for e in data}
    except (json.JSONDecodeError, OSError):
        return set()


# ── Main ────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Enrich Chinese character entries with DeepSeek API"
    )
    parser.add_argument(
        "--input", default=DEFAULT_INPUT,
        help=f"Input JSON file (default: {DEFAULT_INPUT})"
    )
    parser.add_argument(
        "--output", default=DEFAULT_OUTPUT,
        help=f"Output JSON file (default: {DEFAULT_OUTPUT})"
    )
    parser.add_argument(
        "--start", type=int, default=0,
        help="Start index (0-based) in the input array (default: 0)"
    )
    mgroup = parser.add_mutually_exclusive_group()
    mgroup.add_argument(
        "--end", type=int,
        help="End index (exclusive) in the input array"
    )
    mgroup.add_argument(
        "--count", type=int,
        help="Number of entries to process (alternative to --end)"
    )
    parser.add_argument(
        "--delay", type=float, default=DEFAULT_DELAY,
        help=f"Delay in seconds between API calls (default: {DEFAULT_DELAY})"
    )
    parser.add_argument(
        "--dry-run", action="store_true",
        help="Print which entries would be processed without calling the API"
    )
    parser.add_argument(
        "--api-key", help="API key"
    )
    
    args = parser.parse_args()

    # ── Resolve API key ─────────────────────────────────────────────────
    api_key = args.api_key
    if not api_key:
        if os.path.isfile(API_KEY_FILE):
            with open(API_KEY_FILE, "r") as f:
                api_key = f.read().strip()
            print(f"Read API key from {API_KEY_FILE}", file=sys.stderr)
    if not api_key:
        api_key = os.environ.get("DEEPSEEK_API_KEY", "")
    if not api_key:
        print("ERROR: No API key provided. Use --api-key, create an api_key file,"
              " or set DEEPSEEK_API_KEY env var.", file=sys.stderr)
        sys.exit(1)
    if not api_key.startswith("sk-"):
        print(f"WARNING: API key does not start with 'sk-' (prefix: {api_key[:6]}...)."
              " DeepSeek keys are expected to start with 'sk-'.", file=sys.stderr)
    DEEPSEEK_API_KEY = api_key  # noqa — module-level, used by call_deepseek()

    print(f"DEEPSEEK_API_KEY {DEEPSEEK_API_KEY}", file=sys.stderr)



    # ── Load & slice input ──────────────────────────────────────────────
    all_entries = load_input(args.input)
    total = len(all_entries)
    print(f"Loaded {total} entries from {args.input}", file=sys.stderr)

    start = max(0, args.start)
    if args.count is not None:
        end = min(total, start + args.count)
    elif args.end is not None:
        end = min(total, max(start, args.end))
    else:
        end = total

    batch = all_entries[start:end]
    print(f"Range: [{start}:{end}]  →  {len(batch)} entries to process", file=sys.stderr)

    if not batch:
        print("Nothing to do.", file=sys.stderr)
        return

    # ── Check which keys already exist (resumption) ─────────────────────
    existing = load_existing_keys(args.output)
    todo = [e for e in batch if entry_key(e) not in existing]
    skipped = len(batch) - len(todo)
    if skipped:
        print(f"Skipping {skipped} entries already in {args.output}", file=sys.stderr)
    if not todo:
        print("All entries already processed.", file=sys.stderr)
        return
    print(f"Will process {len(todo)} new entries", file=sys.stderr)

    if args.dry_run:
        for e in todo[:10]:
            print(f"  {entry_key(e)}")
        if len(todo) > 10:
            print(f"  ... and {len(todo) - 10} more")
        return

    # ── Carry over existing results ─────────────────────────────────────
    existing_results = []
    if os.path.exists(args.output):
        try:
            with open(args.output, "r", encoding="utf-8") as f:
                existing_results = json.load(f)
        except (json.JSONDecodeError, OSError):
            pass

    results = list(existing_results)
    success_count = 0
    fail_count = 0

    print(f"Starting API calls (delay={args.delay}s)...", file=sys.stderr)

    for i, entry in enumerate(todo):
        rank, char, pinyin = entry["rank"], entry["char"], entry["pinyin"]
        idx = i + 1

        print(f"[{idx}/{len(todo)}] rank={rank} char={char} pinyin={pinyin}",
              end="", file=sys.stderr, flush=True)

        api_result = call_deepseek(char, pinyin, DEEPSEEK_API_KEY)
        
        if api_result is None:
            print(f"FAILED entry {i}, content {entry}", file=sys.stderr)
            fail_count += 1
            # don't record garbage if call fails
        else:
            english = api_result.get("english", "").strip()
            example = api_result.get("example", "").strip()
            extraexample = api_result.get("extraexample", "").strip()
            example_pinyin = api_result.get("example_pinyin", "").strip()
            results.append(build_result(entry, english, example, example_pinyin, extraexample))
            print(f"  OK  results={results[-1]}", file=sys.stderr)
            success_count += 1

        # Write progress after every call so partial work is never lost
        with open(args.output, "w", encoding="utf-8") as f:
            json.dump(results, f, ensure_ascii=False, indent=2)

        # Delay between calls to respect rate limits
        if i < len(todo) - 1:
            time.sleep(args.delay)

    # ── Summary ─────────────────────────────────────────────────────────
    print(f"\nDone.  Success: {success_count}  Failed: {fail_count}  "
          f"Total in output: {len(results)}", file=sys.stderr)
    print(f"Output written to {args.output}", file=sys.stderr)


if __name__ == "__main__":
    main()
