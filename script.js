/* ═══════════════════════════════════════════════════════════════════════════
   Chinese Character Study — Script
   ═══════════════════════════════════════════════════════════════════════════ */

var characters = [];           // full dataset
var filteredCharacters = [];   // subset after search filter
var searchQuery = '';
const gridCharsPerPage = 8;
let currentPage = 1;
var lastPage = 0;
var showEng = true;
var darkMode = false;
var studyMode = false;
var dataSourceLabel = '';

const REMOTE_DATA_URL = 'https://peanuttruck.github.io/data.json';
const LS_DARK = 'ccs-dark-mode';

// ── Inline SVG icons ───────────────────────────────────────────────────────

var SVG_PLAY  = '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
var SVG_PAUSE = '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';

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

// ── Unique characters helper ───────────────────────────────────────────────

function getUniqueChars(data) {
    var seen = new Set();
    var result = [];
    data.forEach(function(item) {
        if (!seen.has(item.char)) {
            seen.add(item.char);
            result.push(item.char);
        }
    });
    return result;
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
    var uniqueCount = getUniqueChars(filteredCharacters).length;
    lastPage = Math.max(1, Math.ceil(uniqueCount / gridCharsPerPage));
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

	const re = /[(（][^)）]+[)）]/gu;
	example = example.replace( re, '')
	extraexample = extraexample.replace( re, '')

    if (example) {
        parts.push( example );
    }
    if (extraexample) {
        parts.push( extraexample );
    }
    speakUtterance(parts.join('\u3002'));
}

// ── TTS: play utterance queue sequentially ─────────────────────────────────

var gridQueueActive = false;
var gridQueuePaused = false;
var gridQueueGeneration = 0;

function playQueue(queue, i, generation) {
    // Abort if a newer queue has been started
    if (generation !== gridQueueGeneration) return;

    if (i >= queue.length) {
        gridQueueActive = false;
        gridQueuePaused = false;
        var pauseBtn = document.getElementById('btn-pause-grid');
        pauseBtn.classList.remove('active');
        pauseBtn.innerHTML = SVG_PAUSE;
        pauseBtn.title = 'Pause';
        return;
    }
    // If paused, wait and poll
    if (gridQueuePaused) {
        setTimeout(function() { playQueue(queue, i, generation); }, 200);
        return;
    }
    var item = queue[i];
    var utter = new SpeechSynthesisUtterance(item.text);
    utter.lang = item.lang || 'zh-CN';
    utter.rate = item.rate || 0.9;
    utter.onend = function() {
        setTimeout(function() { playQueue(queue, i + 1, generation); }, item.delayAfter || 0);
    };
    utter.onerror = function(ev) {
        console.error('TTS error:', ev.error);
        setTimeout(function() { playQueue(queue, i + 1, generation); }, item.delayAfter || 0);
    };
    speechSynthesis.speak(utter);
}

function toggleGridPause() {
    if (!gridQueueActive) return;
    gridQueuePaused = !gridQueuePaused;
    var btn = document.getElementById('btn-pause-grid');
    var pbtn = document.getElementById('btn-speak-grid');
	
    if (gridQueuePaused) {
        speechSynthesis.pause();
        btn.classList.add('active');
        btn.title = 'Resume';
        pbtn.classList.remove('active');
    } else {
        speechSynthesis.resume();
        btn.classList.remove('active');
        btn.title = 'Pause';
        pbtn.classList.add('active');
    }
}

function stopGrid() {
    speechSynthesis.cancel();
    gridQueueActive = false;
    gridQueuePaused = false;
    gridQueueGeneration++;
    var pauseBtn = document.getElementById('btn-pause-grid');
    pauseBtn.classList.remove('active');
    pauseBtn.innerHTML = SVG_PAUSE;
    pauseBtn.title = 'Pause';

    var pbtn = document.getElementById('btn-speak-grid');
    pbtn.classList.remove('active');
}

// ── TTS: Read all characters in the grid ───────────────────────────────────

function speakGrid() {
    try {
        var gridCells = document.querySelectorAll('#cbare .char-cell');
        if (gridCells.length === 0) {
            console.warn('speakGrid: no char-cell elements found');
            return;
        }

        var queue = [];

        gridCells.forEach(function(cell, idx) {
            var ch = cell.textContent.trim();
            if (!ch) return;

            var entries = characters.filter(function(e) { return e.char === ch; });
            if (entries.length === 0) return;

            // "第X单词："
            queue.push({ text: '\u7b2c' + (idx + 1) + '\u5355\u8bcd', delayAfter: 300 });
            // character
            queue.push({ text: ch, delayAfter: 300 });
            // "用法"
            queue.push({ text: '\u7528\u6cd5', delayAfter: 300 });

            // examples
            var examples = [];
            entries.forEach(function(entry) {
                if (entry.example) {
                    examples.push(entry.example.replace(/\([^)]*\)/g, '').trim());
                }
                if (entry.extraexample) {
                    examples.push(entry.extraexample.replace(/\([^)]*\)/g, '').trim());
                }
            });
            if (examples.length > 0) {
                queue.push({ text: examples.join('\u3002'), delayAfter: 1000 });
            }
        });

        if (queue.length === 0) {
            console.warn('speakGrid: no content to speak');
            return;
        }

        console.log('speakGrid: queue length', queue.length, 'chars in grid:', gridCells.length);
        speechSynthesis.cancel();
        gridQueueActive = true;
        gridQueuePaused = false;
        gridQueueGeneration++;
        var pauseBtn = document.getElementById('btn-pause-grid');
        pauseBtn.classList.remove('active');
        pauseBtn.innerHTML = SVG_PAUSE;
        pauseBtn.title = 'Pause';

        var btn = document.getElementById('btn-speak-grid');
        btn.classList.add('active');
        btn.title = 'Play';


        playQueue(queue, 0, gridQueueGeneration);
    } catch (e) {
        console.error('speakGrid exception:', e);
    }
}

// ── Render table ───────────────────────────────────────────────────────────

function renderTable(page) {
    // Paginate by unique characters (8 per page)
    var uniqueChars = getUniqueChars(filteredCharacters);
    var totalUnique = uniqueChars.length;
    lastPage = Math.max(1, Math.ceil(totalUnique / gridCharsPerPage));
    if (page > lastPage) page = lastPage;
    if (page < 1) page = 1;
    currentPage = page;

    var start = (page - 1) * gridCharsPerPage;
    var end = Math.min(start + gridCharsPerPage, totalUnique);
    var gridChars = uniqueChars.slice(start, end);
    var gridCharSet = new Set(gridChars);

    // All entries (from full dataset) for the characters on this page.
    var tableEntries = characters.filter(function(item) {
        return gridCharSet.has(item.char);
    });

    // Build HTML strings before DOM touch
    var theadHTML = '<tr><th>#</th><th>字</th><th>Pinyin</th><th>Example</th><th class="col-eng">English</th><th class="col-audio"></th></tr>';

    var rowsHTML = tableEntries.map(function(item) {
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

    var gridHTML = gridChars
        .map(function(c) { return '<div class="char-cell">' + escapeHtml(c) + '</div>'; })
        .join('');

    var infoText = tableEntries.length > 0
        ? ((page - 1) * gridCharsPerPage + 1) + '–' + end
        : '0–0';
    infoText = 'Page ' + page + ' of ' + lastPage + ' · Showing ' + infoText + ' of ' + totalUnique + ' characters' +
        (searchQuery ? ' (filtered from ' + getUniqueChars(characters).length + ')' : '');

    var subText = '';
    if (tableEntries.length > 0) {
        var ranks = tableEntries.map(function(e) { return parseInt(e.rank, 10); });
        var minRank = Math.min.apply(null, ranks);
        var maxRank = Math.max.apply(null, ranks);
        subText = 'Frequency ranks ' + minRank + '–' + maxRank +
            ' · ' + tableEntries.length + ' readings for ' + gridChars.length + ' characters';
    }

    // ── Crossfade: fade out → update DOM → fade in ─────────────────────
    var charGrid = document.getElementById('cbare');
    var tbody = document.querySelector('#characters-table tbody');
    charGrid.style.opacity = '0';
    tbody.style.opacity = '0';

    setTimeout(function() {
        document.querySelector('#characters-table thead').innerHTML = theadHTML;
        tbody.innerHTML = rowsHTML;
        charGrid.innerHTML = gridHTML;
        document.getElementById('infospan').textContent = infoText;
        if (subText) document.getElementById('infospan2').textContent = subText;

        document.querySelector('.prev').disabled = (page === 1);
        document.querySelector('.next').disabled = (page === lastPage);

        charGrid.style.opacity = '1';
        tbody.style.opacity = '1';

        // URL state
        var params = new URLSearchParams(window.location.search);
        params.set('page', page);
        if (showEng) params.set('eng', '1'); else params.delete('eng');
        window.history.replaceState({}, '', window.location.pathname + '?' + params.toString());
    }, 120);
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
    var uniqueCount = getUniqueChars(data).length;
    lastPage = Math.max(1, Math.ceil(uniqueCount / gridCharsPerPage));

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
