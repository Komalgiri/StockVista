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
  const table = $(`${sectionSelector} table.data-table`);
  if (!table.length) return null;

  const headers: string[] = [];
  table.find('thead th').each((i, el) => {
    headers.push($(el).text().trim());
  });

  const rows: any[] = [];
  table.find('tbody tr').each((i, el) => {
    const row = $(el);
    const title = row.find('td.text').text().trim().replace(/\\+/g, '').replace(/\\s+/g, ' ');
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
  return parseTable($, 'section#profit-loss');
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
  return parseTable($, 'section#peers');
}
