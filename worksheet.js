/* ═══════════════════════════════════════════════════════════════════════════
   Worksheet — Script
   ═══════════════════════════════════════════════════════════════════════════ */

var worksheet = [{"characters":""}];
var characters = [];            // full dataset from data.json
var editMode = false;
var currentPage = 1;
var lastPage = 1;
var wsTitle = '';
const gridCharsPerPage = 8;
const COOKIE_NAME = 'ccs-worksheet';
const REMOTE_DATA_URL = 'https://peanuttruck.github.io/data.json';

// ── Local storage helpers ──────────────────────────────────────────────────

function storeState(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch(e) {}
}

function loadState(key) {
    try {
        var raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
    } catch(e) { return null; }
}

// ── Data loading ───────────────────────────────────────────────────────────

function fetchRemote() {
    document.getElementById('datasource').textContent = 'Fetching character data…';

    var controller = new AbortController();
    var timeout = setTimeout(function() { controller.abort(); }, 15000);

    fetch(REMOTE_DATA_URL, { method: 'GET', signal: controller.signal })
        .then(function(r) {
            clearTimeout(timeout);
            if (!r.ok) throw new Error(r.status + ' ' + r.statusText);
            return r.json();
        })
        .then(function(data) {
            characters = data;
            document.getElementById('datasource').textContent =
                'Loaded: ' + REMOTE_DATA_URL + ' (' + data.length + ' entries)';
            renderGrid(currentPage);
        })
        .catch(function(err) {
            clearTimeout(timeout);
            console.error('Fetch error:', err);
            var msg = err.name === 'AbortError'
                ? 'Fetch timed out after 15s'
                : 'Fetch failed: ' + err.message;
            document.getElementById('datasource').textContent = msg;
        });
}

// ── Load / Save worksheet ──────────────────────────────────────────────────

function loadWorksheet() {
    var state = loadState(COOKIE_NAME);
    if (state) {
        if (state.pages && Array.isArray(state.pages) && state.pages.length > 0) {
            worksheet = state.pages;
        }
        if (typeof state.title === 'string') {
            wsTitle = state.title;
            document.getElementById('ws-title').value = wsTitle;
        }
    }
    lastPage = Math.max(1, worksheet.length);
    renderGrid(currentPage);
}

function saveWorksheet() {
	
    // Collect from DOM if in edit mode
    if (editMode) {
        collectPageEdits();
    }
    persistWorksheet();
    renderTable();
    var status = document.getElementById('save-status');
    status.textContent = '✓ Saved';
    setTimeout(function() { status.textContent = ''; }, 2000);
}

function persistWorksheet() {
    var state = {
        title: wsTitle,
        pages: worksheet
    };
    storeState(COOKIE_NAME, state);
}

function collectPageEdits() {
    // Read all input values from the current page's grid and update worksheet
    var inputs = document.querySelectorAll('#cbare .char-input');
    var chars = '';
    inputs.forEach(function(inp) {
        chars += inp.value;
    });
    // Only create page if there are characters or it's not the only page
    if (currentPage <= worksheet.length) {
        worksheet[currentPage - 1].characters = chars;
    } else {
        worksheet.push({"characters": chars});
    }
    persistWorksheet();
}

// ── Title ──────────────────────────────────────────────────────────────────

var titleTimer = null;
document.getElementById('ws-title').addEventListener('input', function() {
    wsTitle = this.value;
    clearTimeout(titleTimer);
    titleTimer = setTimeout(function() {
        persistWorksheet();
    }, 600);
});

// ── Dark mode toggle ───────────────────────────────────────────────────────

function applyDarkMode(on) {
    document.documentElement.setAttribute('data-theme', on ? 'dark' : 'light');
    var btn = document.getElementById('toggle-dark');
    btn.textContent = on ? '☀' : '🌙';
    btn.setAttribute('data-active', on ? 'true' : 'false');
    try { localStorage.setItem('ccs-dark-mode', on ? '1' : '0'); } catch(e) {}
}

document.getElementById('toggle-dark').addEventListener('click', function() {
    var cur = document.documentElement.getAttribute('data-theme');
    applyDarkMode(cur !== 'dark');
});

// ── Edit / View toggle ─────────────────────────────────────────────────────

document.getElementById('toggle-edit').addEventListener('click', function() {
    if (editMode) {
        // Switching from edit to view: save current edits first
        collectPageEdits();
    }
    editMode = !editMode;
    this.setAttribute('data-active', editMode ? 'true' : 'false');
    this.textContent = editMode ? '👁 View' : '✏️ Edit';
    applyEditViewMode();
    renderGrid(currentPage);
});

function applyEditViewMode() {
    var saveRow = document.getElementById('save-row');
    var pageMgmt = document.getElementById('page-mgmt');
    var gridLabel = document.getElementById('grid-label');
    var speakRow = document.querySelector('.grid-actions');
    var paginationRow = document.getElementById('pagination-row');

    if (editMode) {
        saveRow.style.display = '';
        pageMgmt.style.display = '';
        gridLabel.textContent = 'Edit characters on this page';
        speakRow.style.display = 'none';
        paginationRow.classList.add('edit-mode-pagination');
    } else {
        saveRow.style.display = 'none';
        pageMgmt.style.display = 'none';
        gridLabel.textContent = 'Characters on this page';
        speakRow.style.display = '';
        paginationRow.classList.remove('edit-mode-pagination');
    }
}

// ── Render grid ────────────────────────────────────────────────────────────

function renderGrid(page) {
    lastPage = Math.max(1, worksheet.length);
    if (page > lastPage) page = lastPage;
    if (page < 1) page = 1;
    currentPage = page;

    var grid = document.getElementById('cbare');
    var info = document.getElementById('infospan');
    var pageInd = document.getElementById('page-indicator');

    if (editMode) {
        // Build input grid
        var pageData = worksheet[page - 1] || {"characters":""};
        var chars = (pageData.characters || '').split('');
        var html = '';
        for (var i = 0; i < gridCharsPerPage; i++) {
            var ch = chars[i] || '';
            html += '<input type="text" class="char-input" maxlength="1"' +
                ' value="' + escapeAttr(ch) + '"' +
                ' placeholder="字"' +
                ' data-idx="' + i + '">';
        }
        grid.innerHTML = html;
    } else {
        // Build view grid
        var pageDataV = worksheet[page - 1] || {"characters":""};
        var charsV = (pageDataV.characters || '').split('');
        var htmlV = '';
        for (var j = 0; j < gridCharsPerPage; j++) {
            var chV = charsV[j] || '';
            htmlV += '<div class="char-cell">' + (chV ? escapeHtml(chV) : '') + '</div>';
        }
        grid.innerHTML = htmlV;
    }

    // Update page info
    info.textContent = 'Page ' + page + ' of ' + lastPage;
    pageInd.textContent = page + ' / ' + lastPage;

    // Update prev/next button states
    var prevBtn = document.querySelector('.prev');
    var nextBtn = document.querySelector('.next');
    if (prevBtn) prevBtn.disabled = (page === 1);
    if (nextBtn) nextBtn.disabled = (page === lastPage);

    // Render detail table in view mode
    if (!editMode) {
        renderTable();
    }
}

// ── Utility ────────────────────────────────────────────────────────────────

function escapeHtml(s) {
    if (!s) return '';
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function escapeAttr(s) {
    if (!s) return '';
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

// ── Pagination ─────────────────────────────────────────────────────────────

function changePage(offset) {
    if (editMode) {
        // Save current page edits before navigating
        collectPageEdits();
    }
    currentPage += offset;
    renderGrid(currentPage);
}

function jumpToPage(page) {
    if (editMode) {
        collectPageEdits();
    }
    if (page === 1) {
        currentPage = 1;
    } else if (page === -1) {
        currentPage = lastPage;
    }
    renderGrid(currentPage);
}

function addPage() {
    collectPageEdits();
    var pos = currentPage;
    worksheet.splice(pos, 0, {"characters":""});
    lastPage = worksheet.length;
    currentPage = pos + 1;
    persistWorksheet();
    renderGrid(currentPage);
}

function removePage() {
    if (worksheet.length <= 1) {
        // Don't remove last page — just clear it
        worksheet[0].characters = '';
        persistWorksheet();
        renderGrid(currentPage);
        return;
    }
    worksheet.splice(currentPage - 1, 1);
    lastPage = worksheet.length;
    if (currentPage > lastPage) currentPage = lastPage;
    persistWorksheet();
    renderGrid(currentPage);
}

// ── Detail table (same as main page) ───────────────────────────────────────

function renderTable() {
    var pageData = worksheet[currentPage - 1];
    if (!pageData || !pageData.characters) {
        document.querySelector('#characters-table thead').innerHTML = '';
        document.querySelector('#characters-table tbody').innerHTML = '';
        document.getElementById('infospan2').textContent = '';
        return;
    }

    var gridChars = pageData.characters.split('');
    var gridCharSet = new Set(gridChars);

    var tableEntries = characters.filter(function(item) {
        return gridCharSet.has(item.char);
    });

    if (characters.length === 0) {
        document.querySelector('#characters-table thead').innerHTML = '';
        document.querySelector('#characters-table tbody').innerHTML =
            '<tr><td colspan="6" style="text-align:center;color:var(--text-faint);padding:20px">Character data loading…</td></tr>';
        document.getElementById('infospan2').textContent = '';
        return;
    }

    if (tableEntries.length === 0) {
        document.querySelector('#characters-table thead').innerHTML = '';
        document.querySelector('#characters-table tbody').innerHTML =
            '<tr><td colspan="6" style="text-align:center;color:var(--text-faint);padding:20px">No character data for this page</td></tr>';
        document.getElementById('infospan2').textContent = '';
        return;
    }

    var tbody = document.querySelector('#characters-table tbody');
    tbody.style.opacity = '0';

    setTimeout(function() {
        var theadHTML = '<tr><th>#</th><th>字</th><th>Pinyin</th><th>Example</th><th class="col-eng">English</th><th class="col-audio"></th></tr>';

        var rowsHTML = tableEntries.map(function(item) {
            var engCell = '<td class="col-eng">' + escapeHtml(item.english || '') + '</td>';
            var exampleHtml = escapeHtml(item.example || '');
            if (item.extraexample) {
                exampleHtml += '<span class="extra-example">' +
                    escapeHtml(item.extraexample) + '</span>';
            }
            var charEsc = escapeHtml(item.char).replace(/'/g, "\\'");
            var exEsc = escapeHtml(item.example || '').replace(/'/g, "\\'");
            var exxEsc = escapeHtml(item.extraexample || '').replace(/'/g, "\\'");
            return '<tr>' +
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

        document.querySelector('#characters-table thead').innerHTML = theadHTML;
        tbody.innerHTML = rowsHTML;
        tbody.style.opacity = '1';

        if (tableEntries.length > 0) {
            var ranks = tableEntries.map(function(e) { return parseInt(e.rank, 10); });
            var minRank = Math.min.apply(null, ranks);
            var maxRank = Math.max.apply(null, ranks);
            document.getElementById('infospan2').textContent =
                'Frequency ranks ' + minRank + '–' + maxRank +
                ' · ' + tableEntries.length + ' readings for ' + gridChars.length + ' characters';
        } else {
            document.getElementById('infospan2').textContent = '';
        }
    }, 120);
}

// ── TTS: speak a single table row ──────────────────────────────────────────

function speakRow(char_, example, extraexample) {
    var parts = [char_];
    var re = /[(（][^)）]+[)）]/gu;
    example = example.replace(re, '');
    extraexample = extraexample.replace(re, '');
    if (example) parts.push(example);
    if (extraexample) parts.push(extraexample);
    speakUtterance(parts.join('。'));
}

// ── Auto-save on input (debounced) ─────────────────────────────────────────

var saveTimer = null;
document.addEventListener('input', function(ev) {
    if (!editMode) return;
    if (!ev.target.classList.contains('char-input')) return;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function() {
        collectPageEdits();
    }, 600);
});

// ── TTS (same as main page, character-only) ────────────────────────────────

function speakUtterance(text) {
    if (!window.speechSynthesis) return;
    speechSynthesis.cancel();
    var utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'zh-CN';
    utter.rate = 0.9;
    var voices = speechSynthesis.getVoices();
    if (voices.length) {
        var zhVoice = voices.find(function(v) { return v.lang.startsWith('zh'); });
        if (zhVoice) utter.voice = zhVoice;
    }
    speechSynthesis.speak(utter);
}

var gridQueueActive = false;
var gridQueuePaused = false;
var gridQueueGeneration = 0;

function playQueue(queue, i, generation) {
    if (generation !== gridQueueGeneration) return;
    if (i >= queue.length) {
        gridQueueActive = false;
        gridQueuePaused = false;
        var pauseBtn = document.getElementById('btn-pause-grid');
        pauseBtn.classList.remove('active');
        pauseBtn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
        pauseBtn.title = 'Pause';
        return;
    }
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
    utter.onerror = function() {
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
    document.getElementById('btn-pause-grid').classList.remove('active');
    document.getElementById('btn-speak-grid').classList.remove('active');
}

function speakGrid() {
    try {
        var cells = document.querySelectorAll('#cbare .char-cell');
        if (cells.length === 0) return;

        var queue = [];
        cells.forEach(function(cell, idx) {
            var ch = cell.textContent.trim();
            if (!ch) return;
            queue.push({ text: '\u7b2c' + (idx + 1) + '\u5355\u8bcd', delayAfter: 200 });
            queue.push({ text: ch, delayAfter: 600 });
        });

        if (queue.length === 0) return;
        speechSynthesis.cancel();
        gridQueueActive = true;
        gridQueuePaused = false;
        gridQueueGeneration++;
        document.getElementById('btn-speak-grid').classList.add('active');
        playQueue(queue, 0, gridQueueGeneration);
    } catch (e) {
        console.error('speakGrid exception:', e);
    }
}

// ── Export / Import ────────────────────────────────────────────────────────

function exportWorksheet() {
    if (editMode) collectPageEdits();
    var state = { title: wsTitle, pages: worksheet };
    var blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = (wsTitle || 'worksheet') + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function importWorksheet(ev) {
    var file = ev.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    var status = document.getElementById('import-status');
    reader.onload = function(e) {
        try {
            var state = JSON.parse(e.target.result);
            if (!state.pages || !Array.isArray(state.pages)) {
                throw new Error('Invalid worksheet format: missing "pages" array.');
            }
            worksheet = state.pages;
            if (typeof state.title === 'string') {
                wsTitle = state.title;
                document.getElementById('ws-title').value = wsTitle;
            }
            lastPage = Math.max(1, worksheet.length);
            currentPage = 1;
            renderGrid(currentPage);
            persistWorksheet();
            status.textContent = '✓ Imported ' + worksheet.length + ' page(s)';
            setTimeout(function() { status.textContent = ''; }, 3000);
        } catch (err) {
            status.textContent = '✗ ' + err.message;
            setTimeout(function() { status.textContent = ''; }, 4000);
        }
    };
    reader.readAsText(file);
    // Reset file input so re-import works
    ev.target.value = '';
}

// ── Keyboard navigation ────────────────────────────────────────────────────

document.addEventListener('keydown', function(ev) {
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

// ── Handle Enter key in char inputs: move to next input ────────────────────

document.addEventListener('keydown', function(ev) {
    if (!editMode) return;
    if (!ev.target.classList.contains('char-input')) return;
    if (ev.key === 'Enter') {
        ev.preventDefault();
        var inputs = document.querySelectorAll('#cbare .char-input');
        var idx = parseInt(ev.target.getAttribute('data-idx'));
        if (idx < inputs.length - 1) {
            inputs[idx + 1].focus();
            inputs[idx + 1].select();
        }
    }
});

// ── Startup ────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function() {
    var savedDark = '0';
    try { savedDark = localStorage.getItem('ccs-dark-mode') || '0'; } catch(e) {}
    applyDarkMode(savedDark === '1');

    fetchRemote();
    loadWorksheet();
    applyEditViewMode();
});
