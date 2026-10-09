import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import companiesRouter from './routes/companies';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } });
});

// Routes
app.use('/api/companies', companiesRouter);
// Search acts as a shortcut on /api/search
app.get('/api/search', (req: express.Request, res: express.Response) => {
  const query = (req.query.q as string || '').toLowerCase();
  
  // Dummy database of top Indian companies for demonstration
  const companies = [
    { name: "Reliance Industries Ltd.", ticker: "RELIANCE", exchange: "NSE" },
    { name: "Tata Consultancy Services", ticker: "TCS", exchange: "NSE" },
    { name: "HDFC Bank Ltd.", ticker: "HDFCBANK", exchange: "NSE" },
    { name: "Infosys Ltd.", ticker: "INFY", exchange: "NSE" },
    { name: "ICICI Bank Ltd.", ticker: "ICICIBANK", exchange: "NSE" }
  ];

  const results = query ? companies.filter(c => 
    c.name.toLowerCase().includes(query) || c.ticker.toLowerCase().includes(query)
  ) : [];

  res.json({ success: true, data: results, meta: { message: "Mock search implemented." } });
});

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: {
      message: err.message || 'Internal Server Error'
    }
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
