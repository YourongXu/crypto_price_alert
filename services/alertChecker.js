import { getActiveAlerts, markTriggered } from './alertsStore.js';
import { fetchMarketData } from './cryptoData.js';
import { sendAlertEmail } from './emailService.js';
import { buildAlertEmailHtml } from './emailTemplates.js';

const COIN_IDS = 'bitcoin,ethereum,solana,ripple,binancecoin,dogecoin,tron,cardano';
const CHECK_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

export async function checkAlerts() {
  const active = getActiveAlerts();
  if (active.length === 0) {
    console.log('[AlertChecker] No active alerts');
    return;
  }

  console.log(`[AlertChecker] Checking ${active.length} alert(s)...`);

  let prices;
  try {
    prices = await fetchMarketData(COIN_IDS);
  } catch (e) {
    console.error('[AlertChecker] Fetch prices failed:', e.message);
    return;
  }

  for (const alert of active) {
    const coin = prices[alert.cryptoId];
    if (!coin || coin.usd == null) continue;

    const currentPrice = coin.usd;
    const change24h = coin.usd_24h_change ?? 0;
    const triggered =
      alert.condition === 'above'
        ? currentPrice >= alert.targetPrice
        : currentPrice <= alert.targetPrice;

    console.log(`[AlertChecker] ${alert.symbol}: $${currentPrice} ${alert.condition} $${alert.targetPrice} → ${triggered ? 'TRIGGERED' : 'not yet'}`);

    if (triggered) {
      markTriggered(alert.id);
      const subject = `Price Alert Triggered - ${alert.symbol} $${alert.targetPrice}`;
      const html = buildAlertEmailHtml({
        name: alert.name,
        symbol: alert.symbol,
        condition: alert.condition,
        targetPrice: alert.targetPrice,
        currentPrice,
        change24h,
      });
      try {
        await sendAlertEmail({ to: alert.email, subject, html, alert: { ...alert, currentPrice, change24h } });
        console.log(`[AlertChecker] ✓ Email sent: ${alert.symbol} → ${alert.email}`);
      } catch (e) {
        console.error(`[AlertChecker] ✗ Email failed:`, e.message);
      }
    }
  }
}

export function startAlertChecker() {
  setInterval(checkAlerts, CHECK_INTERVAL_MS);
  checkAlerts();
}
