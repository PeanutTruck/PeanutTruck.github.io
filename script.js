/* ═══════════════════════════════════════════════════════════════════════════
   Chinese Character Study — Script
   ═══════════════════════════════════════════════════════════════════════════ */

var characters = [];           // full dataset
var filteredCharacters = [];   // subset after search filter
var searchQuery = '';
const rowsPerPage = 10;
let currentPage = 1;
var lastPage = 0;
var showEng = true;
var darkMode = false;
var studyMode = false;
var dataSourceLabel = '';

const REMOTE_DATA_URL = 'https://peanuttruck.github.io/data.json';
const LS_DARK = 'ccs-dark-mode';

// ── Utility ────────────────────────────────────────────────────────────────

function escapeHtml(s) {
    if (!s) return '';
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// ── Download data ──────────────────────────────────────────────────────────

function downloadData() {
    if (!characters || characters.length === 0) return;
    var blob = new Blob([JSON.stringify(characters, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ── Toggle button helpers ──────────────────────────────────────────────────

function setToggleActive(id, active) {
    var btn = document.getElementById(id);
    btn.setAttribute('data-active', active ? 'true' : 'false');
}

function toggleBtnState(id) {
    var btn = document.getElementById(id);
    var cur = btn.getAttribute('data-active') === 'true';
    return !cur;
}

// ── Apply search filter ────────────────────────────────────────────────────

function applySearch() {
    var q = searchQuery.trim().toLowerCase();
    if (!q) {
        filteredCharacters = characters;
        document.getElementById('search-info').textContent = '';
    } else {
        filteredCharacters = characters.filter(function(item) {
            return (item.char && item.char.includes(q)) ||
                   (item.pinyin && item.pinyin.toLowerCase().includes(q)) ||
                   (item.english && item.english.toLowerCase().includes(q)) ||
                   (item.example && item.example.toLowerCase().includes(q)) ||
                   (item.extraexample && item.extraexample.toLowerCase().includes(q));
        });
        var info = document.getElementById('search-info');
        info.textContent = filteredCharacters.length + ' match' +
            (filteredCharacters.length !== 1 ? 'es' : '');
    }
    lastPage = Math.max(1, Math.ceil(filteredCharacters.length / rowsPerPage));
    currentPage = 1;
    renderTable(currentPage);
}

// ── TTS (Text-to-Speech) ───────────────────────────────────────────────────

// ── TTS: shared helper ────────────────────────────────────────────────────

function speakUtterance(text) {
    if (!window.speechSynthesis) {
        console.error('speechSynthesis not available');
        return;
    }
    speechSynthesis.cancel();
    var utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'zh-CN';
    utter.rate = 0.9;
    utter.onerror = function(ev) {
        console.error('TTS error:', ev.error);
    };
    // Preload voices (fixes silent-first-speak in some browsers)
    var voices = speechSynthesis.getVoices();
    if (voices.length) {
        var zhVoice = voices.find(function(v) { return v.lang.startsWith('zh'); });
        if (zhVoice) utter.voice = zhVoice;
    }
    speechSynthesis.speak(utter);
}

// ── TTS: speak a single table row ──────────────────────────────────────────

function speakRow(char, example, extraexample) {
    var parts = [char];
    if (example) {
        parts.push(example.replace(/\([^)]*\)/g, '').trim());
    }
    if (extraexample) {
        parts.push(extraexample.replace(/\([^)]*\)/g, '').trim());
    }
    speakUtterance(parts.join('\u3002'));
}

// ── TTS: Read all characters in the grid ───────────────────────────────────

function speakGrid() {
    try {
        var gridCells = document.querySelectorAll('#cbare .char-cell');
        if (gridCells.length === 0) {
            console.warn('speakGrid: no char-cell elements found');
            return;
        }

        var parts = [];

        gridCells.forEach(function(cell) {
            var ch = cell.textContent.trim();
            if (!ch) return;

            var entries = characters.filter(function(e) { return e.char === ch; });
            if (entries.length === 0) return;

            parts.push(ch);
            entries.forEach(function(entry) {
                if (entry.example) {
                    parts.push(entry.example.replace(/\([^)]*\)/g, '').trim());
                }
                if (entry.extraexample) {
                    parts.push(entry.extraexample.replace(/\([^)]*\)/g, '').trim());
                }
            });
        });

        if (parts.length === 0) {
            console.warn('speakGrid: no content to speak');
            return;
        }

        var text = parts.join('\u3002');
        console.log('speakGrid text length:', text.length, 'chars in grid:', gridCells.length);
        speakUtterance(text);
    } catch (e) {
        console.error('speakGrid exception:', e);
    }
}

// ── Render table ───────────────────────────────────────────────────────────

function renderTable(page) {
    var start = (page - 1) * rowsPerPage;
    var end = Math.min(start + rowsPerPage, filteredCharacters.length);
    var pagechars = filteredCharacters.slice(start, end);

    // ── Table head ──────────────────────────────────────────────────────
    var thead = document.querySelector('#characters-table thead');
    thead.innerHTML = '<tr><th>#</th><th>字</th><th>Pinyin</th><th>Example</th><th class="col-eng">English</th><th class="col-audio"></th></tr>';

    // ── Table body ──────────────────────────────────────────────────────
    var tbody = document.querySelector('#characters-table tbody');
    var rows = pagechars.map(function(item) {
        var engCell = '<td class="col-eng">' + escapeHtml(item.english || '') + '</td>';
        var exampleHtml = escapeHtml(item.example || '');
        if (item.extraexample) {
            exampleHtml += '<span class="extra-example">' +
                escapeHtml(item.extraexample) + '</span>';
        }
        var rowTitle = item.english ? ' title="' + escapeHtml(item.english) + '"' : '';
        var charEsc = escapeHtml(item.char).replace(/'/g, "\\'");
        var exEsc = escapeHtml(item.example || '').replace(/'/g, "\\'");
        var exxEsc = escapeHtml(item.extraexample || '').replace(/'/g, "\\'");
        return '<tr' + rowTitle + '>' +
            '<td>' + escapeHtml(item.rank) + '</td>' +
            '<td>' + charEsc + '</td>' +
            '<td>' + escapeHtml(item.pinyin) + '</td>' +
            '<td>' + exampleHtml + '</td>' +
            engCell +
            '<td class="col-audio"><button class="speak-btn"' +
            ' title="Read aloud"' +
            ' onclick="speakRow(\'' + charEsc + '\', \'' + exEsc + '\', \'' + exxEsc + '\')">🔊</button></td>' +
            '</tr>';
    }).join('');
    tbody.innerHTML = rows;

    // ── Pagination state ────────────────────────────────────────────────
    document.querySelector('.prev').disabled = (page === 1);
    document.querySelector('.next').disabled = (page === lastPage);

    // ── Page info ───────────────────────────────────────────────────────
    var total = filteredCharacters.length;
    var showing = pagechars.length > 0
        ? ((page - 1) * rowsPerPage + 1) + '–' + end
        : '0–0';
    document.getElementById('infospan').textContent =
        'Showing ' + showing + ' of ' + total +
        (searchQuery ? ' (filtered from ' + characters.length + ')' : '');

    // ── Character grid ──────────────────────────────────────────────────
    var charGrid = document.getElementById('cbare');
    var seen = new Set();
    pagechars.forEach(function(item) { seen.add(item.char); });
    charGrid.innerHTML = Array.from(seen)
        .map(function(c) { return '<div class="char-cell">' + escapeHtml(c) + '</div>'; })
        .join('');

    // ── Subtitle — rank range ───────────────────────────────────────────
    if (pagechars.length > 0) {
        var minRank = pagechars[0].rank;
        var maxRank = pagechars[pagechars.length - 1].rank;
        document.getElementById('header-sub').textContent =
            'Frequency ranks ' + minRank + '–' + maxRank +
            ' · ' + total + ' entries';
    }

    // ── URL state ───────────────────────────────────────────────────────
    var params = new URLSearchParams(window.location.search);
    params.set('page', page);
    if (showEng) params.set('eng', '1'); else params.delete('eng');
    window.history.replaceState({}, '', window.location.pathname + '?' + params.toString());
}

// ── Pagination ─────────────────────────────────────────────────────────────

function changePage(offset) {
    currentPage += offset;
    renderTable(currentPage);
}

function jumpToPage(jumpPage) {
    if (jumpPage === 1) {
        currentPage = 1;
    } else if (jumpPage === -1) {
        currentPage = lastPage;
    } else {
        var val = parseInt(document.getElementById('jump-page').value, 10);
        if (val >= 1 && val <= lastPage) {
            currentPage = val;
        } else {
            alert('Please enter a page number between 1 and ' + lastPage + '.');
            return;
        }
    }
    renderTable(currentPage);
}

// ── Data init ──────────────────────────────────────────────────────────────

function initFromData(data, sourceLabel) {
    characters = data;
    dataSourceLabel = sourceLabel;
    filteredCharacters = data;
    lastPage = Math.max(1, Math.ceil(data.length / rowsPerPage));

    var params = new URLSearchParams(window.location.search);
    var page = parseInt(params.get('page'));
    if (page) currentPage = Math.min(Math.max(page, 1), lastPage);

    // English on by default; only disable if eng=0 in URL
    showEng = params.get('eng') !== '0';
    setToggleActive('toggle-eng', showEng);
    if (!showEng) {
        document.body.classList.add('hide-eng');
    }

    document.getElementById('datasource').textContent =
        'Loaded: ' + sourceLabel + ' (' + data.length + ' entries)';
    document.getElementById('btn-download').style.display = '';

    if (studyMode) {
        document.body.classList.add('study-mode');
    }

    applySearch();  // renders table with any existing search query
}

function fetchRemote() {
    document.getElementById('datasource').textContent = 'Fetching remote data…';

    var controller = new AbortController();
    var timeout = setTimeout(function() { controller.abort(); }, 15000);

    fetch(REMOTE_DATA_URL, { method: 'GET', signal: controller.signal })
        .then(function(r) {
            clearTimeout(timeout);
            if (!r.ok) throw new Error(r.status + ' ' + r.statusText);
            return r.json();
        })
        .then(function(data) { initFromData(data, REMOTE_DATA_URL); })
        .catch(function(err) {
            clearTimeout(timeout);
            console.error('Fetch error:', err);
            var msg = err.name === 'AbortError'
                ? 'Fetch timed out after 15s'
                : 'Fetch failed: ' + err.message;
            document.getElementById('datasource').textContent = msg;
        });
}

// ── Toggle: dark mode ──────────────────────────────────────────────────────

function applyDarkMode(on) {
    darkMode = on;
    document.documentElement.setAttribute('data-theme', on ? 'dark' : 'light');
    document.getElementById('toggle-dark').textContent = on ? '☀' : '🌙';
    setToggleActive('toggle-dark', on);
    try { localStorage.setItem(LS_DARK, on ? '1' : '0'); } catch(e) {}
}

document.getElementById('toggle-dark').addEventListener('click', function() {
    applyDarkMode(!darkMode);
});

// ── Toggle: show English ───────────────────────────────────────────────────

document.getElementById('toggle-eng').addEventListener('click', function() {
    showEng = !showEng;
    setToggleActive('toggle-eng', showEng);
    if (showEng) {
        document.body.classList.remove('hide-eng');
    } else {
        document.body.classList.add('hide-eng');
    }
    renderTable(currentPage);
});

// ── Toggle: study mode ─────────────────────────────────────────────────────

document.getElementById('toggle-study').addEventListener('click', function() {
    studyMode = !studyMode;
    setToggleActive('toggle-study', studyMode);
    if (studyMode) {
        document.body.classList.add('study-mode');
    } else {
        document.body.classList.remove('study-mode');
    }
});

// ── Search input ───────────────────────────────────────────────────────────

var searchTimer = null;
document.getElementById('search-input').addEventListener('input', function() {
    searchQuery = this.value;
    clearTimeout(searchTimer);
    searchTimer = setTimeout(function() {
        applySearch();
    }, 200);
});

// Clear search on Escape
document.getElementById('search-input').addEventListener('keydown', function(ev) {
    if (ev.key === 'Escape') {
        this.value = '';
        searchQuery = '';
        applySearch();
    }
});

// ── Keyboard navigation ────────────────────────────────────────────────────

document.addEventListener('keydown', function(ev) {
    // Don't capture if focus is in an input (except Escape handled above)
    var tag = document.activeElement ? document.activeElement.tagName : '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

    if (ev.key === 'ArrowLeft') {
        ev.preventDefault();
        if (currentPage > 1) changePage(-1);
    } else if (ev.key === 'ArrowRight') {
        ev.preventDefault();
        if (currentPage < lastPage) changePage(1);
    }
});

// ── File input ─────────────────────────────────────────────────────────────

document.getElementById('local-data').addEventListener('change', function(ev) {
    var file = ev.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(e) {
        try {
            initFromData(JSON.parse(e.target.result), file.name);
        } catch (err) {
            alert('Failed to parse JSON: ' + err.message);
            document.getElementById('datasource').textContent =
                'Parse error: ' + err.message;
        }
    };
    reader.readAsText(file);
});

// ── Startup ────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function() {
    // Restore dark mode preference
    var savedDark = '0';
    try { savedDark = localStorage.getItem(LS_DARK) || '0'; } catch(e) {}
    applyDarkMode(savedDark === '1');

    // Check source param
    var params = new URLSearchParams(window.location.search);
    var sourceParam = params.get('source');
    if (sourceParam) {
        document.getElementById('datasource').textContent = 'Fetching ' + sourceParam + '…';
        var ctrl = new AbortController();
        var to = setTimeout(function() { ctrl.abort(); }, 15000);
        fetch(sourceParam, { method: 'GET', signal: ctrl.signal })
            .then(function(r) {
                clearTimeout(to);
                if (!r.ok) throw new Error(r.status + ' ' + r.statusText);
                return r.json();
            })
            .then(function(data) { initFromData(data, sourceParam); })
            .catch(function(err) {
                clearTimeout(to);
                console.error('Source fetch error:', err);
                document.getElementById('datasource').textContent =
                    err.name === 'AbortError'
                        ? 'Fetch timed out after 15s'
                        : 'Fetch failed: ' + err.message;
            });
    } else {
        fetchRemote();
    }
});
