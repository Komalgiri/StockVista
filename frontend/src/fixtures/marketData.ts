export const companyProfile = {
  name: "Reliance Industries Ltd",
  ticker: "RELIANCE",
  exchange: "NSE",
  sector: "Energy / Telecommunications",
  currentPrice: 2850.45,
  dayChange: 42.10,
  dayChangePercent: 1.5,
  marketCap: "₹19.2 Lakh Cr",
  peRatio: 26.5,
  pbRatio: 2.8,
  dividendYield: 0.35,
  weekHigh52: 3024.90,
  weekLow52: 2220.30,
};

export const historicalPrices = [
  { date: "2023-01", price: 2300 },
  { date: "2023-04", price: 2450 },
  { date: "2023-07", price: 2600 },
  { date: "2023-10", price: 2550 },
  { date: "2024-01", price: 2700 },
  { date: "2024-04", price: 2950 },
  { date: "2024-07", price: 3100 },
  { date: "2024-10", price: 2850 },
];

export const financialStatements = {
  incomeStatement: [
    { title: "Revenue from Operations", values: ['5,96,679', '4,66,924', '6,99,962', '8,79,468', '9,74,864'], growth: "+10.8%", isHeader: true, expandable: true },
    { title: "Operating Expenses", values: ['5,08,140', '3,84,163', '5,85,258', '7,37,160', '8,02,732'], growth: "+8.9%", indent: true },
    { title: "Operating Profit (EBITDA)", values: ['88,239', '82,761', '1,10,504', '1,42,308', '1,72,784'], growth: "+21.4%" },
    { title: "OPM %", values: ['14.8%', '17.7%', '15.8%', '16.2%', '17.7%'], growth: "+150 bps", isRatio: true },
    { title: "Depreciation", values: ['22,203', '26,572', '29,797', '39,315', '48,120'], growth: "+18.4%", indent: true },
    { title: "Interest", values: ['22,027', '21,189', '14,584', '19,571', '23,280'], growth: "+19.0%", indent: true },
    { title: "Profit before Tax (PBT)", values: ['53,607', '55,461', '84,312', '94,003', '1,08,860'], growth: "+15.8%" },
    { title: "Net Profit (PAT)", values: ['39,880', '53,739', '67,845', '74,088', '79,020'], growth: "+6.7%", isHeader: true, expandable: true },
    { title: "EPS in Rs", values: ['63.1', '79.4', '100.4', '108.5', '116.4'], growth: "+6.7%", indent: true },
  ],
  balanceSheet: [
    { title: "Total Assets", values: ['11,65,915', '13,23,564', '14,99,665', '16,73,812', '18,52,000'], growth: "+10.6%", isHeader: true, expandable: true },
    { title: "Total Liabilities", values: ['6,34,500', '7,10,000', '8,15,000', '8,95,000', '9,50,000'], growth: "+6.1%", isHeader: true, expandable: true },
    { title: "Total Equity", values: ['5,31,415', '6,13,564', '6,84,665', '7,78,812', '9,02,000'], growth: "+15.8%", isHeader: true, expandable: true },
  ],
};

export const peerComparison = [
  { name: "Reliance", pe: 26.5, pb: 2.8, roe: 10.5, rocm: 12.1 },
  { name: "TCS", pe: 31.2, pb: 14.5, roe: 45.2, rocm: 52.4 },
  { name: "HDFC Bank", pe: 16.4, pb: 2.9, roe: 16.5, rocm: 15.2 },
  { name: "Infosys", pe: 24.1, pb: 8.2, roe: 32.1, rocm: 38.5 },
];

export const shareholding = [
  { category: "Promoters", percentage: 50.3 },
  { category: "FII", percentage: 22.4 },
  { category: "DII", percentage: 16.1 },
  { category: "Public", percentage: 11.2 },
];
