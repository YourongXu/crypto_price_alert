import nodemailer from 'nodemailer';

let resendClient = null;
try {
  if (process.env.RESEND_API_KEY) {
    const { Resend } = await import('resend');
    resendClient = new Resend(process.env.RESEND_API_KEY);
    console.log('[Email] Resend configured');
  }
} catch (e) {
  console.error('[Email] Failed to init Resend:', e.message);
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port: port ? parseInt(port, 10) : 587,
      secure: port === '465',
      auth: { user, pass },
    });
  }
  return null;
}

const transporter = getTransporter();

// Resend: onboarding@resend.dev can only send to your Resend account email until you verify a domain
const FROM_EMAIL = process.env.EMAIL_FROM || 'CryptoAlert Pro <onboarding@resend.dev>';

async function sendViaResend(to, subject, html) {
  if (!resendClient) throw new Error('RESEND_API_KEY is not set');
  const { data, error } = await resendClient.emails.send({
    from: FROM_EMAIL,
    to: [to],
    subject,
    html,
  });
  if (error) throw new Error(error.message);
  return data;
}

async function sendViaSMTP(to, subject, html) {
  if (!transporter) throw new Error('SMTP is not configured (set SMTP_HOST, SMTP_USER, SMTP_PASS)');
  await transporter.sendMail({
    from: FROM_EMAIL,
    to,
    subject,
    html,
  });
}

export async function sendAlertEmail({ to, subject, html }) {
  if (resendClient) {
    await sendViaResend(to, subject, html);
    return;
  }
  if (transporter) {
    await sendViaSMTP(to, subject, html);
    return;
  }
  console.log('[Email] No provider configured. Would send to', to, subject);
  console.log('        Set RESEND_API_KEY or SMTP_* in .env to send real emails.');
}

export async function sendTestEmail(to, alert) {
  const { buildAlertEmailHtml } = await import('./emailTemplates.js');
  const subject = `[Test] Price Alert - ${alert.symbol} $${alert.targetPrice}`;
  const html = buildAlertEmailHtml({
    name: alert.name,
    symbol: alert.symbol,
    condition: alert.condition,
    targetPrice: alert.targetPrice,
    currentPrice: alert.currentPrice ?? alert.targetPrice * 0.99,
    change24h: alert.change24h ?? -1.5,
  });
  if (resendClient) {
    await sendViaResend(to, subject, html);
    return;
  }
  if (transporter) {
    await sendViaSMTP(to, subject, html);
    return;
  }
  console.log('[Email] Would send test to', to, subject);
}
