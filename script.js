var characters;

const rowsPerPage = 10;
let currentPage = 1;
var lastPage = 0;
var showEng = 0;

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

function launchPage() {
    //characters = JSON.parse( '[{ "rank":1, "char": "的", "pinyin": "dè", "example": "他的书 （tā dè shū)", "english": "Definition: of, genetive marker.  Example: His book" }]' );
	//console.log("characters ", characters);
	
// Fetch data from the URL
fetch('./data.json')
.then(function(response) {
  if (!response.ok) {
    throw new Error('Network response was not ok ' + response.statusText);
  }
  return response.json();
})
.then(function(json) {
  characters = json;
  console.log(characters); // Optional: Log the data to the console to verify
})
.catch(function(error) {
  console.error('There has been a problem with your fetch operation:', error);
});


//	fetch('https://peanuttruck.github.io/data.json')
//	.then(response => {
//		console.log( response );
//		response.json()
//	})
//	.then(data => {	
//		characters = data;
//	})
//	.catch(error => console.error('Error loading the JSON file:', error));
	

 
	
	lastPage = Math.ceil(characters.length / rowsPerPage);
	const params = new URLSearchParams(window.location.search);
	const page = parseInt(params.get('page'));
	if ( page )
		currentPage = Math.min(Math.max( page, 1), lastPage);
	showEng = parseBoolean(params.get('eng') ? `params.get('eng')` : `` );
	toggle = document.getElementById('toggleEnglish').checked = showEng;


	console.log("launchPage currentPage ",currentPage);
	
	renderTable(currentPage);
		
}

document.getElementById('toggleEnglish').addEventListener('change', function() {
	showEng = this.checked
	renderTable(currentPage);
});


document.addEventListener('DOMContentLoaded', () => launchPage());
