const c=require('cheerio'),a=require('axios');
a.get('https://www.screener.in/company/HDFCBANK/').then(r=>{
  const $=c.load(r.data);
  $('#top-ratios li').each((i,e)=>console.log($(e).find('.name').text().trim(),':',$(e).find('.value').text().trim()));
});
