import { Router } from 'express';
import { fetchMarketData, fetchGlobalData, fetchFearGreed } from '../services/cryptoData.js';

export const dataRouter = Router();

const COIN_IDS = 'bitcoin,ethereum,solana,ripple,binancecoin,dogecoin,tron,cardano';

dataRouter.get('/prices', async (req, res) => {
  try {
    const data = await fetchMarketData(COIN_IDS);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

dataRouter.get('/global', async (req, res) => {
  try {
    const data = await fetchGlobalData();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

dataRouter.get('/fear-greed', async (req, res) => {
  try {
    const data = await fetchFearGreed();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
