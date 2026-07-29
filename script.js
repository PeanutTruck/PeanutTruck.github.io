var characters;

const rowsPerPage = 10;
let currentPage = 1;
var lastPage = 0;
var showEng = 0;
var dataSourceLabel = '';

// ── Default remote data URL ────────────────────────────────────────────
const REMOTE_DATA_URL = 'https://peanuttruck.github.io/data.json';

function renderTable(page) {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const tableBody = document.querySelector('#characters-table tbody');
    tableBody.innerHTML = '';
	
	const pagechars = characters.slice(start, end)

	const tableHdr = `<th>Frequency Rank</th><th>Character</th><th>Pinyin</th><th>Example</th>${showEng ? `<th>English</th>`:``}`
    const rows = pagechars.map(item => `
        <tr ${item.english ? ` title="${item.english}"` : ''} >
            <td>${item.rank}</td>
			<td>${item.char}</td>
            <td>${item.pinyin}</td>
            <td>${item.example}</td>
			${showEng ? `<td>${item.english ? `${item.english}` : ''}</td>`:``}

        </tr>
    `).join('');
	
    tableBody.innerHTML = tableHdr + rows;

    document.querySelector('.prev').disabled = page === 1;
    document.querySelector('.next').disabled = page === lastPage;
	document.getElementById("infospan").textContent=`Page: ${page} of ${lastPage} `;

	var cbaretable = document.getElementById("cbare");
	cbaretable.innerHTML = '';
	var row = cbaretable.insertRow(0);
	var row2 = cbaretable.insertRow(1);

	const seen = new Set();
	pagechars.forEach(item => { seen.add(item.char) });
	
	uniarry = Array.from(seen)
	const midpt = Math.ceil(uniarry.length / 2);
	
	if( uniarry.length > 4 ) {
		const c1 = uniarry.slice(0, midpt).map(item => `<td>${item}</td> `).join('');
		row.innerHTML = c1;
		const c2 = uniarry.slice(midpt).map(item => `<td>${item}</td> `).join('');
		row2.innerHTML = c2;

	} else {
		const charcols = uniarry.map(item => `<td>${item}</td> `).join('');
		row.innerHTML = charcols;
	}
	
	const params = new URLSearchParams(window.location.search);
    params.set('page', page);
    window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);
    params.set('eng', showEng);
    window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);

}

function changePage(offset) {
    currentPage += offset;	
    renderTable(currentPage);
}

function jumpToPage( jumpPage ) {
	
	if( jumpPage && ( jumpPage == 1 ) )
		currentPage = jumpPage
	else if( jumpPage && ( jumpPage == -1 ) )
		currentPage = lastPage
	else {
        const pageInput = document.getElementById('jump-page').value;
        const page = parseInt(pageInput, 10);
        if (page >= 1 && page <= lastPage) {
            currentPage = page;
        } else {
            alert('Please enter a valid page number.');
			return;
        }
	}
	
    renderTable(currentPage);
}

function parseBoolean(str) {
    return str.toLowerCase() === 'true';
}

// ── Load characters from a parsed JSON array ───────────────────────────
function initFromData(data, sourceLabel) {
    characters = data;
    dataSourceLabel = sourceLabel;
    lastPage = Math.ceil(characters.length / rowsPerPage);

    const params = new URLSearchParams(window.location.search);
    const page = parseInt(params.get('page'));
    if (page)
        currentPage = Math.min(Math.max(page, 1), lastPage);

    // Fix: parse the 'eng' param properly
    const engParam = params.get('eng');
    showEng = (engParam === 'true' || engParam === '1');
    document.getElementById('toggleEnglish').checked = showEng;

    document.getElementById('datasource').textContent =
        'Loaded: ' + dataSourceLabel + ' (' + characters.length + ' entries)';

    console.log('launchPage currentPage', currentPage, 'source', sourceLabel);
    renderTable(currentPage);
}

// ── Fetch remote data ──────────────────────────────────────────────────
function fetchRemote() {
    document.getElementById('datasource').textContent = 'Fetching remote data…';
    fetch(REMOTE_DATA_URL, { method: 'GET' })
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(function(data) {
            initFromData(data, REMOTE_DATA_URL);
        })
        .catch(function(error) {
            console.error('Fetch error:', error);
            document.getElementById('datasource').textContent =
                'Remote fetch failed: ' + error.message;
        });
}

// ── File input handler ─────────────────────────────────────────────────
document.getElementById('local-data').addEventListener('change', function(ev) {
    const file = ev.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            initFromData(data, file.name);
        } catch (err) {
            alert('Failed to parse JSON: ' + err.message);
            document.getElementById('datasource').textContent =
                'Parse error: ' + err.message;
        }
    };
    reader.readAsText(file);
});

document.getElementById('toggleEnglish').addEventListener('change', function() {
	showEng = this.checked
	renderTable(currentPage);
});


document.addEventListener('DOMContentLoaded', function() {
    // Check for a ?source= URL param pointing to an alternate data URL
    const params = new URLSearchParams(window.location.search);
    const sourceParam = params.get('source');
    if (sourceParam) {
        document.getElementById('datasource').textContent = 'Fetching ' + sourceParam + '…';
        fetch(sourceParam, { method: 'GET' })
            .then(function(r) { return r.json(); })
            .then(function(data) { initFromData(data, sourceParam); })
            .catch(function(err) {
                console.error('Source fetch error:', err);
                document.getElementById('datasource').textContent =
                    'Source fetch failed: ' + err.message;
            });
    } else {
        fetchRemote();
    }
});
