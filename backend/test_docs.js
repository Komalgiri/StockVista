const c = require('cheerio');
const a = require('axios');

a.get('https://www.screener.in/company/HDFCBANK/').then(r => {
  const $ = c.load(r.data);
  const docs = {};
  
  $('#documents .documents').each((i, list) => {
    const title = $(list).find('h3').text().trim();
    const links = [];
    $(list).find('ul.list-links li a').each((j, aTag) => {
      links.push({
        name: $(aTag).text().trim(),
        url: $(aTag).attr('href'),
      });
    });
    if (title && links.length > 0) {
      docs[title] = links;
    }
  });

  console.log(JSON.stringify(docs, null, 2));
}).catch(e => console.error(e));
