import re
import json

# Pinyin tone mark conversion

# Mapping of vowels to their accented versions for each tone
# Format: {vowel: [tone1, tone2, tone3, tone4, tone5]}
pinyin_tones = {
    'a': ['ā', 'á', 'ǎ', 'à', 'a'],
    'e': ['ē', 'é', 'ě', 'è', 'e'],
    'i': ['ī', 'í', 'ǐ', 'ì', 'i'],
    'o': ['ō', 'ó', 'ǒ', 'ò', 'o'],
    'u': ['ū', 'ú', 'ǔ', 'ù', 'u'],
    'ü': ['ǖ', 'ǘ', 'ǚ', 'ǜ', 'ü'],
    'A': ['Ā', 'Á', 'Ǎ', 'À', 'A'],
    'E': ['Ē', 'É', 'Ě', 'È', 'E'],
    'I': ['Ī', 'Í', 'Ǐ', 'Ì', 'I'],
    'O': ['Ō', 'Ó', 'Ǒ', 'Ò', 'O'],
    'U': ['Ū', 'Ú', 'Ǔ', 'Ù', 'U'],
    'Ü': ['Ǖ', 'Ǘ', 'Ǚ', 'Ǜ', 'Ü']
}

def convert_pinyin(pinyin):
    """
    Convert pinyin with tone number to pinyin with tone marks.
    Example: "tuan2" -> "tuán"
    """
    if not pinyin:
        return pinyin
    
    # Check if there's a tone number (1-5)
    if pinyin[-1].isdigit():
        tone = int(pinyin[-1])
        syllable = pinyin[:-1]
    else:
        # No tone number, return as-is
        return pinyin
    
    # Tone should be between 1-5
    if tone < 1 or tone > 5:
        return pinyin
    
    # The neutral tone (5) doesn't need accent marks
    if tone == 5:
        return syllable
    
    # Determine which vowel gets the tone mark
    # Order of precedence: a, e, o, i, u, ü
    for vowel in ['a', 'e', 'o', 'i', 'u', 'ü']:
        if vowel in syllable:
            # Replace the vowel with its accented version
            index = syllable.index(vowel)
            new_vowel = pinyin_tones[vowel][tone-1]
            syllable = syllable[:index] + new_vowel + syllable[index+1:]
            return syllable
    
    # For syllables with only "n" or "ng" (like "n3", "ng2")
    # Just return the syllable without modification
    return pinyin

def convert_text(text):
    """
    Convert all pinyin syllables in a text from number notation to accent marks.
    Handles multiple syllables separated by spaces or apostrophes.
    """
    # Split into individual syllables (handling apostrophes for words like "Xi'an")
    syllables = []
    current = ''
    for char in text:
        if char == "'":
            if current:
                syllables.append(current)
                current = ''
            syllables.append("'")
        elif char == ' ':
            if current:
                syllables.append(current)
                current = ''
            syllables.append(' ')
        else:
            current += char
    if current:
        syllables.append(current)
    
    # Process each syllable
    converted = []
    for s in syllables:
        if s in ["'", " "]:
            converted.append(s)
        else:
            converted.append(convert_pinyin(s))
    
    return ''.join(converted)


def parse_wordlist(file_content):
    entries = []
    # Extract the data lines (starting with number, tab, character)
    data_lines = re.findall(r'^\d+\t[^\t]+\t\d+\t\d+.*$', file_content, re.MULTILINE)
    
    for line in data_lines:
        parts = line.split('\t')
        if len(parts) < 5:
            continue
            
        rank = parts[0]
        char = parts[1]
        pinyin_part = parts[4]
        
        # Extract all pinyin variations (handle cases like de/di2/di4)
        pinyin_variations = []
        pinyin_options = pinyin_part.split('/')
        
        for option in pinyin_options:
            # Remove any trailing content after pinyin (like English translations)
            option = re.sub(r'\(.*', '', option).strip()
            option = re.sub(r'\s.*', '', option).strip()
            
            # Skip empty options
            if not option:
                continue
                
            # Convert to lowercase and remove tone numbers
            base_pinyin = re.sub(r'\d', '', option).lower()
            
            # If there's a tone number, create versions with and without tone
            if re.search(r'\d', option):
                tone = re.search(r'(\d)', option).group(1)
                pinyin_variations.append({
                    "with_tone": base_pinyin + tone,
                    "accent_tone": convert_pinyin(base_pinyin + tone)
                })
            else:
                # For options without tone numbers (like "de")
                pinyin_variations.append({
                    "with_tone": base_pinyin,
                    "accent_tone": base_pinyin
                })
        
        # Create entries for each pinyin variation
        for variation in pinyin_variations:
            entries.append({
                "rank": rank,
                "char": char,
                "pinyin": variation["accent_tone"]
            })
    
    return entries

# Read the file content (in a real scenario, you'd use open() to read from a file)
file_content = """[PASTE THE ENTIRE FILE CONTENT HERE]"""

f = open("wordlist.txt")
file_content = f.read()

# Parse the content
parsed_data = parse_wordlist(file_content)

# Convert to JSON
json_output = json.dumps(parsed_data, ensure_ascii=False, indent=2)

# Print or save to file
print(json_output)

# To save to a file:
with open('chinese_characters.json', 'w', encoding='utf-8') as f:
    f.write(json_output)


