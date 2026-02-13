# CryptoAlert Pro

A CoinMarketCap-style crypto price alert tool with real-time data and email notifications.

## Features

- **Live market data**: Prices, 24h change, market cap, volume, Fear & Greed index
- **8 cryptocurrencies**: BTC, ETH, SOL, XRP, BNB, DOGE, TRX, ADA
- **Price alerts**: Set above/below conditions, get notified by email when triggered
- **Auto-check**: Background checker runs every 10 minutes
- **Favorites**: Star your watched coins

## Quick Start

```bash
npm install
npm start
```

Open **http://localhost:3000**

## Email Setup

By default, alert emails are logged to console. To send real emails:

**Option 1: Resend (recommended)**

1. Sign up at [resend.com](https://resend.com) and get an API key
2. Create `.env` in project root:
   ```
   RESEND_API_KEY=re_your_api_key_here
   ```
3. Restart server

**Option 2: Gmail SMTP**

1. Enable 2FA on Google account, create an [App Password](https://myaccount.google.com/apppasswords)
2. Create `.env`:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=yourname@gmail.com
   SMTP_PASS=your-app-password
   EMAIL_FROM=CryptoAlert <yourname@gmail.com>
   ```
3. Restart server

## Tech Stack

- **Frontend**: HTML / CSS / JavaScript
- **Backend**: Node.js, Express
- **Data**: CoinPaprika (prices & market data), Alternative.me (Fear & Greed)
- **Email**: Resend or Nodemailer (SMTP)

## Live Demo

Deployed on Render: [https://crypto-price-alert-th7b.onrender.com](https://crypto-price-alert-th7b.onrender.com)
