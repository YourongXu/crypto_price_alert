import fetch from 'node-fetch';

// --- Cache layer ---
const cache = {};
const CACHE_TTL = 600_000; // 10 minutes

async function cachedFetch(key, url, transform) {
  const now = Date.now();
  if (cache[key] && now - cache[key].ts < CACHE_TTL) {
    return cache[key].data;
  }
  const res = await fetch(url);
  if (!res.ok) {
    if (cache[key]) return cache[key].data;
    throw new Error(`Fetch failed: ${res.status}`);
  }
  const json = await res.json();
  const data = transform ? transform(json) : json;
  cache[key] = { data, ts: now };
  return data;
}

// CoinPaprika ID → CoinGecko ID (frontend uses CoinGecko IDs)
const COINS = [
  { paprika: 'btc-bitcoin', gecko: 'bitcoin' },
  { paprika: 'eth-ethereum', gecko: 'ethereum' },
  { paprika: 'sol-solana', gecko: 'solana' },
  { paprika: 'xrp-xrp', gecko: 'ripple' },
  { paprika: 'bnb-binance-coin', gecko: 'binancecoin' },
  { paprika: 'doge-dogecoin', gecko: 'dogecoin' },
  { paprika: 'trx-tron', gecko: 'tron' },
  { paprika: 'ada-cardano', gecko: 'cardano' },
];

export async function fetchMarketData() {
  const cacheKey = 'prices';
  const now = Date.now();
  if (cache[cacheKey] && now - cache[cacheKey].ts < CACHE_TTL) {
    return cache[cacheKey].data;
  }

  const results = await Promise.all(
    COINS.map(async (c) => {
      try {
        const res = await fetch(`https://api.coinpaprika.com/v1/tickers/${c.paprika}`);
        if (!res.ok) return null;
        const json = await res.json();
        const q = json.quotes?.USD;
        return {
          geckoId: c.gecko,
          usd: q?.price ?? null,
          usd_24h_change: q?.percent_change_24h ?? null,
          usd_market_cap: q?.market_cap ?? null,
          usd_24h_vol: q?.volume_24h ?? null,
        };
      } catch {
        return null;
      }
    })
  );

  const data = {};
  for (const r of results) {
    if (r) data[r.geckoId] = { usd: r.usd, usd_24h_change: r.usd_24h_change, usd_market_cap: r.usd_market_cap, usd_24h_vol: r.usd_24h_vol };
  }

  if (Object.keys(data).length > 0) {
    cache[cacheKey] = { data, ts: now };
  }
  return data;
}

export function fetchGlobalData() {
  return cachedFetch('global', 'https://api.coinpaprika.com/v1/global', (json) => {
    return {
      totalMarketCap: json.market_cap_usd ?? 0,
      totalVolume: json.volume_24h_usd ?? 0,
      marketCapChange24h: json.market_cap_change_24h ?? null,
      volumeChange24h: json.volume_24h_change_24h ?? null,
      btcDominance: json.bitcoin_dominance_percentage ?? 0,
      ethDominance: 0, // CoinPaprika doesn't provide ETH dominance directly
    };
  });
}

export async function fetchFearGreed() {
  try {
    return await cachedFetch('fg', 'https://api.alternative.me/fng/', (json) => {
      const d = json.data?.[0];
      return {
        value: parseInt(d?.value ?? 50, 10),
        classification: d?.value_classification ?? 'Neutral',
      };
    });
  } catch {
    return { value: 50, classification: 'Neutral' };
  }
}
