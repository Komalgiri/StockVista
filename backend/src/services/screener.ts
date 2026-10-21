import axios from 'axios';
import * as cheerio from 'cheerio';

const BROWSER_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

// Helper to fetch and parse HTML
export async function fetchScreenerData(ticker: string) {
  try {
    // Attempt to get consolidated data first, fallback to standalone
    let url = `https://www.screener.in/company/${ticker}/consolidated/`;
    let res = await axios.get(url, {
      headers: { 'User-Agent': BROWSER_USER_AGENT },
      timeout: 15000
    }).catch(() => null);
    
    if (!res || res.status !== 200) {
      url = `https://www.screener.in/company/${ticker}/`;
      res = await axios.get(url, {
        headers: { 'User-Agent': BROWSER_USER_AGENT },
        timeout: 15000
      }).catch(() => null);
    }
    
    if (!res || res.status !== 200) return null;
    
    return cheerio.load(res.data);
  } catch (error) {
    console.error(`Error fetching screener data for ${ticker}:`, error);
    return null;
  }
}

export function parseTable($: cheerio.CheerioAPI, sectionSelector: string) {
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

export function extractRatios($: cheerio.CheerioAPI): Record<string, string> {
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

export function extractIncome($: cheerio.CheerioAPI) {
  return {
    quarterly: parseTable($, 'section#quarters'),
    annual: parseTable($, 'section#profit-loss')
  };
}

export function extractDocuments($: cheerio.CheerioAPI): Record<string, { name: string; url: string }[]> {
  const docs: Record<string, { name: string; url: string }[]> = {};
  $('#documents .documents').each((i, list) => {
    const title = $(list).find('h3').text().trim();
    const links: { name: string; url: string }[] = [];
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

export function extractAnalysis($: cheerio.CheerioAPI) {
  const pros: string[] = [];
  $('#analysis .pros li').each((i, el) => {
    const text = $(el).text().trim();
    if (text) pros.push(text);
  });

  const cons: string[] = [];
  $('#analysis .cons li').each((i, el) => {
    const text = $(el).text().trim();
    if (text) cons.push(text);
  });

  return { pros, cons };
}

export function extractDetails($: cheerio.CheerioAPI) {
  let about = $('.company-profile .about p').text().trim() || $('.about').text().trim();
  if (about.length > 600) about = about.slice(0, 600) + '...';

  let website = '';
  let bseCode = '';
  let bseUrl = '';
  let nseUrl = '';

  $('a[href]').each((i, el) => {
    const href = $(el).attr('href') || '';
    const text = $(el).text().trim();
    if (href.includes('bseindia.com/stock-share-price')) {
      bseUrl = href;
      const match = href.match(/\/(\d{6})\/?/);
      if (match) bseCode = match[1];
    } else if (href.includes('nseindia.com/get-quotes/equity')) {
      nseUrl = href;
    } else if (text === 'Website' || $(el).attr('aria-label') === 'Company website' || (!website && href.startsWith('http') && !href.includes('screener.in') && !href.includes('bseindia') && !href.includes('nseindia') && !href.includes('google') && !href.includes('crisil') && !href.includes('youtube') && !href.endsWith('.pdf'))) {
      website = href;
    }
  });

  return {
    about: about || null,
    website: website || null,
    bseCode: bseCode || null,
    bseUrl: bseUrl || null,
    nseUrl: nseUrl || null,
  };
}

// ── Complete Single-Request Bundle Parser ─────────────────────────────────────
export async function getCompleteScreenerBundle(ticker: string) {
  const $ = await fetchScreenerData(ticker);
  if (!$) return null;

  const ratios = extractRatios($);
  const income = extractIncome($);
  const balanceSheet = parseTable($, 'section#balance-sheet');
  const cashFlow = parseTable($, 'section#cash-flow');
  const shareholding = parseTable($, 'section#shareholding');
  const documents = extractDocuments($);
  const analysis = extractAnalysis($);
  const details = extractDetails($);

  // Optional: Fetch peers
  let peers = null;
  const companyId = $('div[data-company-id]').attr('data-company-id');
  if (companyId) {
    try {
      const response = await axios.get(`https://www.screener.in/api/company/${companyId}/peers/`, {
        headers: { 'User-Agent': BROWSER_USER_AGENT },
        timeout: 10000
      });
      const $peers = cheerio.load(response.data);
      peers = parseTable($peers, 'body');
    } catch {
      peers = null;
    }
  }

  return {
    ticker: ticker.toUpperCase(),
    ratios,
    income,
    balanceSheet,
    cashFlow,
    shareholding,
    documents,
    analysis,
    details,
    peers,
    cachedAt: new Date().toISOString()
  };
}

// ── Individual Endpoints (Backward compatible) ────────────────────────────────
export async function getScreenerRatios(ticker: string) {
  const $ = await fetchScreenerData(ticker);
  return $ ? extractRatios($) : null;
}

export async function getScreenerIncome(ticker: string) {
  const $ = await fetchScreenerData(ticker);
  return $ ? extractIncome($) : null;
}

export async function getScreenerBalanceSheet(ticker: string) {
  const $ = await fetchScreenerData(ticker);
  return $ ? parseTable($, 'section#balance-sheet') : null;
}

export async function getScreenerCashFlow(ticker: string) {
  const $ = await fetchScreenerData(ticker);
  return $ ? parseTable($, 'section#cash-flow') : null;
}

export async function getScreenerShareholding(ticker: string) {
  const $ = await fetchScreenerData(ticker);
  return $ ? parseTable($, 'section#shareholding') : null;
}

export async function getScreenerPeers(ticker: string) {
  const $ = await fetchScreenerData(ticker);
  if (!$) return null;
  const companyId = $('div[data-company-id]').attr('data-company-id');
  if (!companyId) return null;

  try {
    const response = await axios.get(`https://www.screener.in/api/company/${companyId}/peers/`, {
      headers: { 'User-Agent': BROWSER_USER_AGENT },
      timeout: 10000
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
  return $ ? extractDocuments($) : null;
}

export async function getScreenerAnalysis(ticker: string) {
  const $ = await fetchScreenerData(ticker);
  return $ ? extractAnalysis($) : { pros: [], cons: [] };
}

export async function getScreenerCompanyDetails(ticker: string) {
  const $ = await fetchScreenerData(ticker);
  return $ ? extractDetails($) : null;
}
