/**
 * NSE Company Catalog
 * A curated list of top NSE-listed companies spanning major sectors.
 * Used as the primary search index. In production, this would be replaced
 * by a PostgreSQL table synced with the NSE daily instrument list.
 */

export interface CatalogEntry {
  name: string;
  ticker: string;   // NSE symbol (without .NS suffix)
  exchange: string;
  sector: string;
  industry: string;
}

export const NSE_CATALOG: CatalogEntry[] = [
  // === LARGE CAP - NIFTY 50 Core ===
  { name: "Reliance Industries Ltd.", ticker: "RELIANCE", exchange: "NSE", sector: "Energy", industry: "Oil & Gas Refining & Marketing" },
  { name: "Tata Consultancy Services Ltd.", ticker: "TCS", exchange: "NSE", sector: "Technology", industry: "IT Services & Consulting" },
  { name: "HDFC Bank Ltd.", ticker: "HDFCBANK", exchange: "NSE", sector: "Financial Services", industry: "Private Sector Bank" },
  { name: "Infosys Ltd.", ticker: "INFY", exchange: "NSE", sector: "Technology", industry: "IT Services & Consulting" },
  { name: "ICICI Bank Ltd.", ticker: "ICICIBANK", exchange: "NSE", sector: "Financial Services", industry: "Private Sector Bank" },
  { name: "Hindustan Unilever Ltd.", ticker: "HINDUNILVR", exchange: "NSE", sector: "FMCG", industry: "Household & Personal Products" },
  { name: "State Bank of India", ticker: "SBIN", exchange: "NSE", sector: "Financial Services", industry: "Public Sector Bank" },
  { name: "Bharti Airtel Ltd.", ticker: "BHARTIARTL", exchange: "NSE", sector: "Telecommunication", industry: "Telecom Services" },
  { name: "ITC Ltd.", ticker: "ITC", exchange: "NSE", sector: "FMCG", industry: "Tobacco Products" },
  { name: "Kotak Mahindra Bank Ltd.", ticker: "KOTAKBANK", exchange: "NSE", sector: "Financial Services", industry: "Private Sector Bank" },
  { name: "Larsen & Toubro Ltd.", ticker: "LT", exchange: "NSE", sector: "Construction", industry: "Infrastructure" },
  { name: "Axis Bank Ltd.", ticker: "AXISBANK", exchange: "NSE", sector: "Financial Services", industry: "Private Sector Bank" },
  { name: "Bajaj Finance Ltd.", ticker: "BAJFINANCE", exchange: "NSE", sector: "Financial Services", industry: "Consumer Finance" },
  { name: "Asian Paints Ltd.", ticker: "ASIANPAINT", exchange: "NSE", sector: "Consumer Discretionary", industry: "Paints" },
  { name: "Maruti Suzuki India Ltd.", ticker: "MARUTI", exchange: "NSE", sector: "Automobile", industry: "Passenger Vehicles" },
  { name: "HCL Technologies Ltd.", ticker: "HCLTECH", exchange: "NSE", sector: "Technology", industry: "IT Services & Consulting" },
  { name: "Sun Pharmaceutical Industries Ltd.", ticker: "SUNPHARMA", exchange: "NSE", sector: "Healthcare", industry: "Pharmaceuticals" },
  { name: "Tata Motors Ltd.", ticker: "TATAMOTORS", exchange: "NSE", sector: "Automobile", industry: "Commercial Vehicles" },
  { name: "Wipro Ltd.", ticker: "WIPRO", exchange: "NSE", sector: "Technology", industry: "IT Services & Consulting" },
  { name: "UltraTech Cement Ltd.", ticker: "ULTRACEMCO", exchange: "NSE", sector: "Construction Materials", industry: "Cement" },
  { name: "Titan Company Ltd.", ticker: "TITAN", exchange: "NSE", sector: "Consumer Discretionary", industry: "Watches & Accessories" },
  { name: "Mahindra & Mahindra Ltd.", ticker: "M&M", exchange: "NSE", sector: "Automobile", industry: "Utility Vehicles" },
  { name: "NTPC Ltd.", ticker: "NTPC", exchange: "NSE", sector: "Power", industry: "Power Generation" },
  { name: "Power Grid Corporation of India", ticker: "POWERGRID", exchange: "NSE", sector: "Power", industry: "Power Transmission" },
  { name: "Nestle India Ltd.", ticker: "NESTLEIND", exchange: "NSE", sector: "FMCG", industry: "Packaged Foods" },
  { name: "Tech Mahindra Ltd.", ticker: "TECHM", exchange: "NSE", sector: "Technology", industry: "IT Services & Consulting" },
  { name: "Bajaj Auto Ltd.", ticker: "BAJAJ-AUTO", exchange: "NSE", sector: "Automobile", industry: "2/3 Wheelers" },
  { name: "Divi's Laboratories Ltd.", ticker: "DIVISLAB", exchange: "NSE", sector: "Healthcare", industry: "Specialty Chemicals" },
  { name: "Hindalco Industries Ltd.", ticker: "HINDALCO", exchange: "NSE", sector: "Metals & Mining", industry: "Aluminium" },
  { name: "JSW Steel Ltd.", ticker: "JSWSTEEL", exchange: "NSE", sector: "Metals & Mining", industry: "Steel" },
  { name: "Tata Steel Ltd.", ticker: "TATASTEEL", exchange: "NSE", sector: "Metals & Mining", industry: "Steel" },
  { name: "HDFC Life Insurance Company", ticker: "HDFCLIFE", exchange: "NSE", sector: "Financial Services", industry: "Life Insurance" },
  { name: "SBI Life Insurance Company", ticker: "SBILIFE", exchange: "NSE", sector: "Financial Services", industry: "Life Insurance" },
  { name: "Cipla Ltd.", ticker: "CIPLA", exchange: "NSE", sector: "Healthcare", industry: "Pharmaceuticals" },
  { name: "Dr. Reddy's Laboratories Ltd.", ticker: "DRREDDY", exchange: "NSE", sector: "Healthcare", industry: "Pharmaceuticals" },
  { name: "Eicher Motors Ltd.", ticker: "EICHERMOT", exchange: "NSE", sector: "Automobile", industry: "2/3 Wheelers" },
  { name: "Hero MotoCorp Ltd.", ticker: "HEROMOTOCO", exchange: "NSE", sector: "Automobile", industry: "2/3 Wheelers" },
  { name: "IndusInd Bank Ltd.", ticker: "INDUSINDBK", exchange: "NSE", sector: "Financial Services", industry: "Private Sector Bank" },
  { name: "Grasim Industries Ltd.", ticker: "GRASIM", exchange: "NSE", sector: "Construction Materials", industry: "Cement" },
  { name: "Coal India Ltd.", ticker: "COALINDIA", exchange: "NSE", sector: "Metals & Mining", industry: "Coal" },
  { name: "Oil & Natural Gas Corporation", ticker: "ONGC", exchange: "NSE", sector: "Energy", industry: "Oil & Gas Exploration" },
  { name: "Britannia Industries Ltd.", ticker: "BRITANNIA", exchange: "NSE", sector: "FMCG", industry: "Packaged Foods" },
  { name: "Apollo Hospitals Enterprise Ltd.", ticker: "APOLLOHOSP", exchange: "NSE", sector: "Healthcare", industry: "Hospitals" },
  { name: "Adani Enterprises Ltd.", ticker: "ADANIENT", exchange: "NSE", sector: "Diversified", industry: "Diversified Conglomerate" },
  { name: "Adani Ports & Special Economic Zone", ticker: "ADANIPORTS", exchange: "NSE", sector: "Industrials", industry: "Port Services" },
  { name: "Bajaj Finserv Ltd.", ticker: "BAJAJFINSV", exchange: "NSE", sector: "Financial Services", industry: "Diversified Financial Services" },
  { name: "Shree Cement Ltd.", ticker: "SHREECEM", exchange: "NSE", sector: "Construction Materials", industry: "Cement" },
  // === MID CAP ===
  { name: "Persistent Systems Ltd.", ticker: "PERSISTENT", exchange: "NSE", sector: "Technology", industry: "IT Services & Consulting" },
  { name: "Coforge Ltd.", ticker: "COFORGE", exchange: "NSE", sector: "Technology", industry: "IT Services & Consulting" },
  { name: "Mphasis Ltd.", ticker: "MPHASIS", exchange: "NSE", sector: "Technology", industry: "IT Services & Consulting" },
  { name: "LTIMindtree Ltd.", ticker: "LTIM", exchange: "NSE", sector: "Technology", industry: "IT Services & Consulting" },
  { name: "Zomato Ltd.", ticker: "ZOMATO", exchange: "NSE", sector: "Consumer Services", industry: "Food Delivery" },
  { name: "Nykaa (FSN E-Commerce Ventures)", ticker: "NYKAA", exchange: "NSE", sector: "Consumer Discretionary", industry: "E-Commerce" },
  { name: "Paytm (One97 Communications)", ticker: "PAYTM", exchange: "NSE", sector: "Financial Services", industry: "Fintech" },
  { name: "Marico Ltd.", ticker: "MARICO", exchange: "NSE", sector: "FMCG", industry: "Household & Personal Products" },
  { name: "Godrej Consumer Products Ltd.", ticker: "GODREJCP", exchange: "NSE", sector: "FMCG", industry: "Household & Personal Products" },
  { name: "Dabur India Ltd.", ticker: "DABUR", exchange: "NSE", sector: "FMCG", industry: "Household & Personal Products" },
  { name: "Colgate-Palmolive (India) Ltd.", ticker: "COLPAL", exchange: "NSE", sector: "FMCG", industry: "Household & Personal Products" },
  { name: "Pidilite Industries Ltd.", ticker: "PIDILITIND", exchange: "NSE", sector: "Specialty Chemicals", industry: "Adhesives & Sealants" },
  { name: "Havells India Ltd.", ticker: "HAVELLS", exchange: "NSE", sector: "Consumer Discretionary", industry: "Consumer Electrical" },
  { name: "Voltas Ltd.", ticker: "VOLTAS", exchange: "NSE", sector: "Consumer Discretionary", industry: "Air Conditioners" },
  { name: "Muthoot Finance Ltd.", ticker: "MUTHOOTFIN", exchange: "NSE", sector: "Financial Services", industry: "Gold Financing" },
  { name: "Cholamandalam Investment & Finance", ticker: "CHOLAFIN", exchange: "NSE", sector: "Financial Services", industry: "Vehicle Financing" },
  { name: "Delhivery Ltd.", ticker: "DELHIVERY", exchange: "NSE", sector: "Industrials", industry: "Logistics" },
  { name: "Trent Ltd.", ticker: "TRENT", exchange: "NSE", sector: "Consumer Discretionary", industry: "Retail" },
  { name: "Oberoi Realty Ltd.", ticker: "OBEROIRLTY", exchange: "NSE", sector: "Real Estate", industry: "Real Estate Development" },
  { name: "DLF Ltd.", ticker: "DLF", exchange: "NSE", sector: "Real Estate", industry: "Real Estate Development" },
  { name: "InterGlobe Aviation (IndiGo)", ticker: "INDIGO", exchange: "NSE", sector: "Industrials", industry: "Airlines" },
  { name: "GMR Airports Ltd.", ticker: "GMRINFRA", exchange: "NSE", sector: "Industrials", industry: "Airport Infrastructure" },
  { name: "Biocon Ltd.", ticker: "BIOCON", exchange: "NSE", sector: "Healthcare", industry: "Biotechnology" },
  { name: "Lupin Ltd.", ticker: "LUPIN", exchange: "NSE", sector: "Healthcare", industry: "Pharmaceuticals" },
  { name: "Torrent Pharmaceuticals Ltd.", ticker: "TORNTPHARM", exchange: "NSE", sector: "Healthcare", industry: "Pharmaceuticals" },
  { name: "Aurobindo Pharma Ltd.", ticker: "AUROPHARMA", exchange: "NSE", sector: "Healthcare", industry: "Pharmaceuticals" },
  { name: "Dixon Technologies India Ltd.", ticker: "DIXON", exchange: "NSE", sector: "Technology", industry: "Electronics Manufacturing" },
  { name: "PB Fintech (PolicyBazaar)", ticker: "POLICYBZR", exchange: "NSE", sector: "Financial Services", industry: "Insurance Broking" },
  { name: "Varun Beverages Ltd.", ticker: "VBL", exchange: "NSE", sector: "FMCG", industry: "Beverages" },
  { name: "Info Edge (India) Ltd.", ticker: "NAUKRI", exchange: "NSE", sector: "Technology", industry: "Internet Services" },
  { name: "Indraprastha Gas Ltd.", ticker: "IGL", exchange: "NSE", sector: "Energy", industry: "City Gas Distribution" },
];
