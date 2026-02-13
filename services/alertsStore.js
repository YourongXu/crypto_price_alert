import { v4 as uuidv4 } from 'uuid';

let alerts = [];

export function getAlerts() {
  return [...alerts];
}

export function addAlert({ cryptoId, symbol, name, condition, targetPrice, email }) {
  const id = uuidv4();
  const alert = {
    id,
    cryptoId,
    symbol,
    name,
    condition, // 'above' | 'below'
    targetPrice,
    email,
    createdAt: new Date().toISOString(),
    triggered: false,
  };
  alerts.push(alert);
  return alert;
}

export function deleteAlert(id) {
  const i = alerts.findIndex((a) => a.id === id);
  if (i === -1) return false;
  alerts.splice(i, 1);
  return true;
}

export function markTriggered(id) {
  const a = alerts.find((x) => x.id === id);
  if (a) a.triggered = true;
}

export function getActiveAlerts() {
  return alerts.filter((a) => !a.triggered);
}
