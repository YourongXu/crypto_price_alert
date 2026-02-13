export function buildAlertEmailHtml({ name, symbol, condition, targetPrice, currentPrice, change24h }) {
  const conditionText = condition === 'above' ? 'Price goes above' : 'Price goes below';
  const changeClass = change24h >= 0 ? 'positive' : 'negative';
  const changeStr = (change24h >= 0 ? '+' : '') + change24h.toFixed(2) + '%';
  const now = new Date().toLocaleString('en-US', {
    dateStyle: 'short',
    timeStyle: 'medium',
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f0f1a; color: #e0e0e0; margin: 0; padding: 24px; }
    .container { max-width: 520px; margin: 0 auto; background: #1a1a2e; border-radius: 12px; padding: 24px; }
    h1 { font-size: 20px; margin: 0 0 16px; color: #fff; }
    .sub { color: #888; font-size: 14px; margin-bottom: 20px; }
    .box { background: #16213e; border-radius: 8px; padding: 16px; margin: 16px 0; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .label { color: #888; font-size: 12px; }
    .value { font-weight: 600; color: #fff; }
    .positive { color: #00C853; }
    .negative { color: #FF5252; }
    .footer { margin-top: 24px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Price Alert Triggered!</h1>
    <p class="sub">Your price alert for <strong>${name} (${symbol})</strong> has been triggered.</p>
    <div class="box">
      <div>
        <div class="label">Alert Condition</div>
        <div class="value">${conditionText}</div>
      </div>
      <div>
        <div class="label">Target Price</div>
        <div class="value">$${targetPrice}</div>
      </div>
      <div>
        <div class="label">Current Price</div>
        <div class="value positive">$${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</div>
      </div>
      <div>
        <div class="label">24h Change</div>
        <div class="value ${changeClass}">${changeStr}</div>
      </div>
    </div>
    <p class="footer">Triggered at: ${now}. This is an automated alert from CryptoAlert Pro. You can manage your alerts in your dashboard.</p>
  </div>
</body>
</html>
  `.trim();
}
