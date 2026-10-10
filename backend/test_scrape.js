const c = require('cheerio');
const a = require('axios');

a.get('https://www.screener.in/company/HDFCBANK/').then(r => {
  const $ = c.load(r.data);
  const extractTable = (selector) => {
    const table = $(selector).find('table');
    if (!table.length) return null;
    
    const headers = [];
    table.find('thead th').each((i, el) => {
      headers.push($(el).text().trim());
    });
    
    const rows = [];
    table.find('tbody tr').each((i, el) => {
      const row = [];
      $(el).find('td').each((j, td) => {
        row.push($(td).text().trim().replace(/[\n\r\t]+/g, ' '));
      });
      if (row.length > 0 && row[0] !== '') {
        rows.push(row);
      }
    });
    return { headers, rows };
  };

  console.log('--- Profit & Loss ---');
  console.log(extractTable('#profit-loss'));

  console.log('--- Quarters ---');
  console.log(extractTable('#quarters'));
}).catch(e => console.error(e));
