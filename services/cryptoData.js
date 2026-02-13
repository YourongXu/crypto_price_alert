import fetch from 'node-fetch';

// --- Cache layer to avoid CoinGecko rate limits (429) ---
const cache = {};
const CACHE_TTL = 600_000; // 10 minutes

async function cachedFetch(key, url, transform) {
  const now = Date.now();
  if (cache[key] && now - cache[key].ts < CACHE_TTL) {
    return cache[key].data;
  }
  const res = await fetch(url);
  if (res.status === 429) {
    // Rate limited — return stale cache if available
    if (cache[key]) return cache[key].data;
    throw new Error('Rate limited by CoinGecko');
  }
  if (!res.ok) {
    if (cache[key]) return cache[key].data;
    throw new Error(`Fetch failed: ${res.status}`);
  }
  const json = await res.json();
  const data = transform ? transform(json) : json;
  cache[key] = { data, ts: now };
  return data;
}

export function fetchMarketData(coinIds) {
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`;
  return cachedFetch('prices', url);
}

export function fetchGlobalData() {
  return cachedFetch('global', 'https://api.coingecko.com/api/v3/global', (json) => {
    const d = json.data;
    return {
      totalMarketCap: d.total_market_cap?.usd ?? 0,
      totalVolume: d.total_volume?.usd ?? 0,
      marketCapChange24h: d.market_cap_change_percentage_24h_usd ?? 0,
      volumeChange24h: d.volume_change_percentage_24h_usd ?? 0,
      btcDominance: d.market_cap_percentage?.btc ?? 0,
      ethDominance: d.market_cap_percentage?.eth ?? 0,
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
