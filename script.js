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
    //characters = JSON.parse( "[\n{ \"rank\":\"1\", \"char\": \"的\", \"pinyin\": \"dè\", \"example\": \"他的书 （tā dè shū）\", \"english\": \"Definition: of, genetive marker.  Usage: His book\" },\n{ \"rank\":\"1\", \"char\": \"的\", \"pinyin\": \"dí\", \"example\": \"的确 （dí què）\", \"english\": \"Indeed\" },\n{ \"rank\":\"1\", \"char\": \"的\", \"pinyin\": \"dì\", \"example\": \"目的 （mù dì）\", \"english\": \"Objective, Goal\" },\n{ \"rank\":\"2\", \"char\": \"一\", \"pinyin\": \"yī\", \"example\": \"我有一只猫 （wǒ yǒu yī zhī māo）\", \"english\": \"one, a.  Usage: I have a cat\"  },\n{ \"rank\":\"3\", \"char\": \"是\", \"pinyin\": \"shì\", \"example\": \"这是我的书 （zhè shì wǒ de shū）\", \"english\": \"Definition: is.  Usage: This is my book\" },\n{ \"rank\":\"4\", \"char\": \"不\", \"pinyin\": \"bù\", \"example\": \"不喜欢 （bù xǐ huān）\" },\n{ \"rank\":\"4\", \"char\": \"不\", \"pinyin\": \"bú\", \"example\": \"不要 （bú yào）\" },\n{ \"rank\":\"5\", \"char\": \"了\", \"pinyin\": \"le\", \"example\": \"我吃饭了 （wǒ chīfàn le）\" },\n{ \"rank\":\"5\", \"char\": \"了\", \"pinyin\": \"liǎo\", \"example\": \"事已经了解了 （shì yǐjīng liǎo jiě le）\" },\n{ \"rank\":\"6\", \"char\": \"在\", \"pinyin\": \"zài\", \"example\": \"我在家里 （wǒ zài jiālǐ）\" }\n]" );

	//console.log("characters ", characters);
	
// Fetch data from the URL
fetch('https://peanuttruck.github.io/data.json', { 
  method: 'GET'
})
.then(function(response) {
  if (!response.ok) {
    throw new Error('Network response was not ok ' + response.statusText);
  }
  return response.text();
})
.then(function(jsontext) {
	
    characters = JSON.parse(jsontext);
	lastPage = Math.ceil(characters.length / rowsPerPage);
	const params = new URLSearchParams(window.location.search);
	const page = parseInt(params.get('page'));
	if ( page )
		currentPage = Math.min(Math.max( page, 1), lastPage);
	showEng = parseBoolean(params.get('eng') ? `params.get('eng')` : `` );
	toggle = document.getElementById('toggleEnglish').checked = showEng;


	console.log("launchPage currentPage ",currentPage);
	
	renderTable(currentPage);
  
})
.catch(function(error) {
  console.error('There has been a problem with your fetch operation:', error);
});


 
	

		
}

document.getElementById('toggleEnglish').addEventListener('change', function() {
	showEng = this.checked
	renderTable(currentPage);
});


document.addEventListener('DOMContentLoaded', () => launchPage());
