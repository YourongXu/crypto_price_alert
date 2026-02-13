# CryptoAlert Pro

A CoinMarketCap-style crypto price alert tool with **real-time data** and **email notifications**. Set alerts for Bitcoin, Ethereum, Solana, XRP, BNB, Dogecoin, TRON, and Cardano; when price crosses your target, an email is sent to you.

## Features

- **Live market overview**: Total market cap, 24h volume, BTC/ETH dominance, Fear & Greed index
- **Real-time cryptocurrency prices**: Refreshed every 30 seconds via [CoinGecko API](https://www.coingecko.com/en/api)
- **Price alerts**: Choose crypto, condition (above/below), target price, and your email
- **Email notifications**: When a condition is met, a formatted email is sent (SMTP required for real delivery)
- **Email preview**: After setting an alert, preview the notification and send a test email

## Quick start

```bash
npm install
npm start
```

Open **http://localhost:3000**.

## Receiving real emails

By default, no email is sent (only logged). To **actually receive** alert emails:

### Easiest: Resend (free tier)

1. Sign up at **[resend.com](https://resend.com)** and get your **API key** (Dashboard → API Keys).
2. In the project folder, copy `.env.example` to `.env` and add:
   ```env
   RESEND_API_KEY=re_your_api_key_here
   ```
3. Restart the server: `npm start`.
4. Set a price alert with **your email** in the form. When the price crosses your target, the email is sent to that address.

**Note:** With the default sender (`onboarding@resend.dev`), Resend may only allow sending to the email you used to sign up. To send to **any user's email**, add and verify your own domain in the Resend dashboard, then set `EMAIL_FROM=CryptoAlert Pro <alerts@yourdomain.com>` in `.env`.

### 让其他用户也可以收到邮件 / Let other users receive emails

- **Gmail SMTP**：配置好后，**任意用户**在「价格提醒」里填的邮箱都会收到提醒，无需额外设置。
- **Resend**：要发给**任意邮箱**（不限于你的 Resend 账号邮箱），需在 [Resend 后台 → Domains](https://resend.com/domains) 添加并验证你的域名（按提示加 DNS 记录），然后在 `.env` 里设置 `EMAIL_FROM=CryptoAlert Pro <alerts@你的域名.com>`。

### Alternative: Gmail SMTP

1. Copy `.env.example` to `.env`.
2. Enable 2FA on your Google account, then create an [App Password](https://myaccount.google.com/apppasswords).
3. In `.env` set:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=yourname@gmail.com
   SMTP_PASS=your-16-char-app-password
   EMAIL_FROM=CryptoAlert Pro <yourname@gmail.com>
   ```
4. Restart the server. Triggered alerts will be sent to the email addresses you enter in the Price Alert form.

## Tech stack

- **Frontend**: Vanilla HTML/CSS/JS, dark theme aligned with CoinMarketCap
- **Backend**: Node.js, Express
- **Data**: CoinGecko (prices, global stats), Alternative.me (Fear & Greed)
- **Email**: Resend (API) or Nodemailer (SMTP)

## Design assets

UI design and reference images are in `public/assets/`. The dashboard follows the provided CryptoAlert Pro mockups (dark theme, gradient accents, card layout).
