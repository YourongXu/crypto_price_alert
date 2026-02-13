import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { alertsRouter } from './routes/alerts.js';
import { dataRouter } from './routes/data.js';
import { startAlertChecker } from './services/alertChecker.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

app.use('/api/alerts', alertsRouter);
app.use('/api/data', dataRouter);

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
createServer(app).listen(PORT, () => {
  console.log(`CryptoAlert Pro running at http://localhost:${PORT}`);
  startAlertChecker();
});
