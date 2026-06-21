const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

function extractTables(file) {
  const html = fs.readFileSync(file, 'utf8');
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const table = document.querySelector("table");
  if(!table) return [];
  const rows = table.querySelectorAll("tbody tr");
  
  const data = [];
  rows.forEach(tr => {
    const tds = tr.querySelectorAll("td");
    const cols = Array.from(tds).map(td => td.textContent.trim());
    if (cols.length > 0) {
        data.push(cols);
    }
  });
  return data;
}

const bc = extractTables('temp_brainCOLOR.html');
const y17 = extractTables('temp_yeo17.html');
const pd = extractTables('temp_pandora.html');

fs.writeFileSync('src/spins_data.json', JSON.stringify({
    brainCOLOR: bc,
    Yeo17: y17,
    Pandora: pd
}, null, 2));

console.log('done');
