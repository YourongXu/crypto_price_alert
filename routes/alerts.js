import { Router } from 'express';
import { getAlerts, addAlert, deleteAlert } from '../services/alertsStore.js';
import { checkAlerts } from '../services/alertChecker.js';

export const alertsRouter = Router();

alertsRouter.get('/', (req, res) => {
  try {
    const alerts = getAlerts();
    res.json(alerts);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

alertsRouter.post('/', (req, res) => {
  try {
    const { cryptoId, symbol, name, condition, targetPrice, email } = req.body;
    if (!cryptoId || !symbol || !name || condition == null || targetPrice == null || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const alert = addAlert({ cryptoId, symbol, name, condition, targetPrice: Number(targetPrice), email });
    res.status(201).json(alert);
    // Check immediately after creating a new alert
    setTimeout(() => checkAlerts(), 1000);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

alertsRouter.delete('/:id', (req, res) => {
  try {
    const deleted = deleteAlert(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Alert not found' });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
