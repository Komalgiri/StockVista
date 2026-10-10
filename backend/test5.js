const c = require('cheerio');
const a = require('axios');

a.get('https://www.screener.in/company/HDFCBANK/').then(r => {
  const $ = c.load(r.data);
  function parseTable(sectionSelector) {
    const table = $(`${sectionSelector} table.data-table`).first();
    if (!table.length) return null;
  
    const headers = [];
    table.find('thead th').each((i, el) => {
      headers.push($(el).text().trim());
    });
  
    const rows = [];
    table.find('tbody tr').each((i, el) => {
      const row = $(el);
      const title = row.find('td.text').text().trim().replace(/\+/g, '').replace(/\s+/g, ' ');
      const values = [];
      row.find('td:not(.text)').each((j, td) => {
        values.push($(td).text().trim());
      });
      if (title) {
        rows.push({ title, values });
      }
    });
  
    return { headers, rows };
  }
  console.log('--- Shareholding ---');
  console.log(JSON.stringify(parseTable('section#shareholding'), null, 2));
}).catch(e => console.error(e));
