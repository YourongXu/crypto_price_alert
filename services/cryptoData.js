import fetch from 'node-fetch';

// --- Cache layer ---
const cache = {};
const CACHE_TTL = 600_000; // 10 minutes

async function cachedFetch(key, urlOrNull, transform) {
  const now = Date.now();
  if (cache[key] && now - cache[key].ts < CACHE_TTL) {
    return cache[key].data;
  }
  let data;
  if (typeof transform === 'function' && transform.length === 0) {
    // transform is an async function that does its own fetching
    data = await transform();
  } else {
    const res = await fetch(urlOrNull);
    if (!res.ok) {
      if (cache[key]) return cache[key].data;
      throw new Error(`Fetch failed: ${res.status}`);
    }
    const json = await res.json();
    data = transform ? transform(json) : json;
  }
  cache[key] = { data, ts: now };
  return data;
}

// CoinPaprika ID mapping (paprika uses "symbol-name" format)
const PAPRIKA_IDS = {
  'bitcoin': 'btc-bitcoin',
  'ethereum': 'eth-ethereum',
  'solana': 'sol-solana',
  'ripple': 'xrp-xrp',
  'binancecoin': 'bnb-binance-coin',
  'dogecoin': 'doge-dogecoin',
  'tron': 'trx-tron',
  'cardano': 'ada-cardano',
};

export async function fetchMarketData(coinIds) {
  const ids = coinIds.split(',');
  const paprikaIds = ids.map(id => PAPRIKA_IDS[id]).filter(Boolean);

  return cachedFetch('prices', '_prices_', async () => {
    const results = {};
    // Fetch all in parallel
    const responses = await Promise.all(
      paprikaIds.map(pid => fetch(`https://api.coinpaprika.com/v1/tickers/${pid}`).then(r => r.ok ? r.json() : null))
    );
    for (const coin of responses) {
      if (!coin) continue;
      // Find the original gecko ID
      const geckoId = Object.keys(PAPRIKA_IDS).find(k => PAPRIKA_IDS[k] === coin.id);
      if (!geckoId) continue;
      const q = coin.quotes?.USD || {};
      results[geckoId] = {
        usd: q.price || 0,
        usd_24h_change: q.percent_change_24h || 0,
        usd_market_cap: q.market_cap || 0,
        usd_24h_vol: q.volume_24h || 0,
      };
    }
    return results;
  });
}

export function fetchGlobalData() {
  return cachedFetch('global', 'https://api.coinpaprika.com/v1/global', (json) => {
    return {
      totalMarketCap: json.market_cap_usd || 0,
      totalVolume: json.volume_24h_usd || 0,
      marketCapChange24h: json.market_cap_change_24h || 0,
      volumeChange24h: json.volume_24h_change_24h || 0,
      btcDominance: json.bitcoin_dominance_percentage || 0,
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
