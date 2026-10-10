import axios from 'axios';
import * as cheerio from 'cheerio';

// Helper to fetch and parse HTML
async function fetchScreenerData(ticker: string) {
  try {
    // Attempt to get consolidated data first, fallback to standalone
    let url = `https://www.screener.in/company/${ticker}/consolidated/`;
    let res = await axios.get(url).catch(() => null);
    
    if (!res || res.status !== 200) {
      url = `https://www.screener.in/company/${ticker}/`;
      res = await axios.get(url).catch(() => null);
    }
    
    if (!res || res.status !== 200) return null;
    
    return cheerio.load(res.data);
  } catch (error) {
    console.error(`Error fetching screener data for ${ticker}:`, error);
    return null;
  }
}

export async function getScreenerRatios(ticker: string) {
  const $ = await fetchScreenerData(ticker);
  if (!$) return null;

  const ratios: Record<string, string> = {};
  $('#top-ratios li').each((i, el) => {
    const name = $(el).find('.name').text().trim();
    const value = $(el).find('.value').text().trim();
    if (name && value) {
      ratios[name] = value;
    }
  });

  return ratios;
}

function parseTable($: cheerio.CheerioAPI, sectionSelector: string) {
  const table = $(`${sectionSelector} table.data-table`).first();
  if (!table.length) return null;

  const headers: string[] = [];
  const headerEls = table.find('thead th').length > 0 
    ? table.find('thead th')
    : table.find('tbody tr:first-child th');

  headerEls.each((i, el) => {
    headers.push($(el).text().trim().replace(/[\n\r\t]+/g, ' ').replace(/\s+/g, ' '));
  });

  const rows: any[] = [];
  table.find('tbody tr').each((i, el) => {
    const row = $(el);
    let title = '';
    const anchor = row.find('td.text a');
    if (anchor.length) {
      title = anchor.text().trim();
    } else {
      title = row.find('td.text').last().text().trim();
    }
    title = title.replace(/\+/g, '').replace(/\s+/g, ' ');

    const values: string[] = [];
    row.find('td:not(.text)').each((j, td) => {
      values.push($(td).text().trim());
    });
    if (title) {
      rows.push({ title, values });
    }
  });

  return { headers, rows };
}

export async function getScreenerIncome(ticker: string) {
  const $ = await fetchScreenerData(ticker);
  if (!$) return null;
  return {
    quarterly: parseTable($, 'section#quarters'),
    annual: parseTable($, 'section#profit-loss')
  };
}

export async function getScreenerBalanceSheet(ticker: string) {
  const $ = await fetchScreenerData(ticker);
  if (!$) return null;
  return parseTable($, 'section#balance-sheet');
}

export async function getScreenerCashFlow(ticker: string) {
  const $ = await fetchScreenerData(ticker);
  if (!$) return null;
  return parseTable($, 'section#cash-flow');
}

export async function getScreenerShareholding(ticker: string) {
  const $ = await fetchScreenerData(ticker);
  if (!$) return null;
  return parseTable($, 'section#shareholding');
}

export async function getScreenerPeers(ticker: string) {
  const $ = await fetchScreenerData(ticker);
  if (!$) return null;
  const companyId = $('div[data-company-id]').attr('data-company-id');
  if (!companyId) return null;

  try {
    const response = await axios.get(`https://www.screener.in/api/company/${companyId}/peers/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    });
    const $peers = cheerio.load(response.data);
    return parseTable($peers, 'body');
  } catch (error) {
    console.error('Error fetching peers:', error);
    return null;
  }
}

export async function getScreenerDocuments(ticker: string) {
  const $ = await fetchScreenerData(ticker);
  if (!$) return null;
  const docs: Record<string, { name: string, url: string }[]> = {};
  
  $('#documents .documents').each((i, list) => {
    const title = $(list).find('h3').text().trim();
    const links: { name: string, url: string }[] = [];
    $(list).find('ul.list-links li a').each((j, aTag) => {
      const url = $(aTag).attr('href');
      if (url) {
        links.push({
          name: $(aTag).text().trim(),
          url: url,
        });
      }
    });
    if (title && links.length > 0) {
      docs[title] = links;
    }
  });

  return docs;
}
