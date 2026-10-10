const c = require('cheerio');
const a = require('axios');

a.get('https://www.screener.in/company/HDFCBANK/').then(r => {
  const $ = c.load(r.data);
  console.log('Does table have data-table?', $('section#profit-loss table.data-table').length);
}).catch(e => console.error(e));
