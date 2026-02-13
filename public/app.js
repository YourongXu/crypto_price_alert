const API = '/api';

const COINS = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', img: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', img: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
  { id: 'solana', symbol: 'SOL', name: 'Solana', img: 'https://assets.coingecko.com/coins/images/4128/small/solana.png' },
  { id: 'ripple', symbol: 'XRP', name: 'XRP', img: 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png' },
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB', img: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png' },
  { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', img: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png' },
  { id: 'tron', symbol: 'TRX', name: 'TRON', img: 'https://assets.coingecko.com/coins/images/1094/small/tron-logo.png' },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano', img: 'https://assets.coingecko.com/coins/images/975/small/cardano.png' },
];

let prices = {};
let globalData = {};
let fearGreed = { value: 50, classification: 'Neutral' };
let activeAlerts = [];
const favorites = new Set();

// --- Formatters ---
function fmtUSD(n) {
  if (n == null || isNaN(n)) return '--';
  if (n >= 1e12) return '$' + (n / 1e12).toFixed(2) + 'T';
  if (n >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(2) + 'M';
  if (n >= 1) return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 });
}

function fmtPct(n) {
  if (n == null || isNaN(n)) return '--';
  return Math.abs(n).toFixed(2) + '%';
}

function fmtSupply(n, sym) {
  if (n == null || isNaN(n)) return '--';
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B ' + sym;
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M ' + sym;
  if (n >= 1e3) return (n / 1e3).toFixed(2) + 'K ' + sym;
  return n.toFixed(2) + ' ' + sym;
}

function pctClass(n) {
  if (n == null) return 'pct-na';
  return n >= 0 ? 'pct-up' : 'pct-down';
}
function pctArrow(n) {
  if (n == null) return '';
  return n >= 0 ? '▲' : '▼';
}

function sparkline(pts, up) {
  const w = 120, h = 36, pad = 2;
  const mn = Math.min(...pts), mx = Math.max(...pts), rng = mx - mn || 1;
  const xs = pts.map((_, i) => pad + (i / (pts.length - 1)) * (w - 2 * pad));
  const ys = pts.map(p => h - pad - ((p - mn) / rng) * (h - 2 * pad));
  const d = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x} ${ys[i]}`).join(' ');
  const c = up ? '#16c784' : '#ea3943';
  return `<svg viewBox="0 0 ${w} ${h}"><path d="${d}" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

function fakePoints(ch) {
  const t = (ch ?? 0) >= 0 ? 1 : -1;
  return Array.from({ length: 12 }, (_, i) => 50 + t * i * 3 + (Math.random() - 0.5) * 5);
}

// --- Data fetching ---
async function fetchPrices() { const r = await fetch(`${API}/data/prices`); if (!r.ok) throw 0; return r.json(); }
async function fetchGlobal() { const r = await fetch(`${API}/data/global`); if (!r.ok) throw 0; return r.json(); }
async function fetchFG() { const r = await fetch(`${API}/data/fear-greed`); if (!r.ok) return { value: '--', classification: '' }; return r.json(); }

// --- Render header + footer stats ---
function renderStats() {
  const g = globalData;
  const pairs = [
    ['hMC', 'fMC', fmtUSD(g.totalMarketCap)],
    ['hVol', 'fVol', fmtUSD(g.totalVolume)],
    ['hBtc', 'fBtc', g.btcDominance != null ? g.btcDominance.toFixed(1) + '%' : '--%'],
    ['hEth', 'fEth', g.ethDominance != null ? g.ethDominance.toFixed(1) + '%' : '--%'],
    ['hFg', 'fFg', fearGreed.value],
  ];
  pairs.forEach(([h, f, v]) => {
    [h, f].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = v; });
  });
  // change indicators
  [['hMCCh', 'fMCCh', g.marketCapChange24h], ['hVolCh', 'fVolCh', g.volumeChange24h]].forEach(([h, f, v]) => {
    [h, f].forEach(id => {
      const el = document.getElementById(id);
      if (!el || v == null) return;
      el.textContent = (v >= 0 ? '▲' : '▼') + Math.abs(v).toFixed(2) + '%';
      el.className = 'ch ' + (v >= 0 ? 'up' : 'down');
    });
  });
}

// --- Render table ---
function renderTable() {
  const tbody = document.getElementById('cryptoTableBody');
  if (!tbody) return;
  tbody.innerHTML = COINS.map((c, i) => {
    const p = prices[c.id];
    const price = p?.usd;
    const ch24 = p?.usd_24h_change;
    const mcap = p?.usd_market_cap;
    const vol = p?.usd_24h_vol;
    const supply = price && mcap ? mcap / price : null;
    const pts = fakePoints(ch24);
    const hit = activeAlerts.some(a => {
      if (a.cryptoId !== c.id || price == null) return false;
      return a.condition === 'above' ? price >= +a.targetPrice : price <= +a.targetPrice;
    });
    const fav = favorites.has(c.id);
    return `<tr class="${hit ? 'alert-hit' : ''}">
      <td class="td-star${fav ? ' starred' : ''}" data-coin="${c.id}">${fav ? '★' : '☆'}</td>
      <td class="td-rank">${i + 1}</td>
      <td><div class="td-name"><img class="coin-icon" src="${c.img}" alt="${c.symbol}" width="24" height="24"><span class="coin-name">${c.name}</span><span class="coin-sym">${c.symbol}</span></div></td>
      <td class="td-price">${fmtUSD(price)}</td>
      <td class="td-pct pct-na">--</td>
      <td class="td-pct ${pctClass(ch24)}">${pctArrow(ch24)} ${fmtPct(ch24)}</td>
      <td class="td-pct pct-na">--</td>
      <td class="td-mcap">${fmtUSD(mcap)}</td>
      <td class="td-vol">${fmtUSD(vol)}</td>
      <td class="td-supply">${fmtSupply(supply, c.symbol)}</td>
      <td class="td-chart">${sparkline(pts, (ch24 ?? 0) >= 0)}</td>
    </tr>`;
  }).join('');
}

// --- Alerts ---
function renderAlerts(list) {
  const c = document.getElementById('activeAlertsInline');
  if (!c) return;
  if (!list.length) { c.innerHTML = ''; return; }
  c.innerHTML = list.map(a => {
    const cond = a.condition === 'above' ? '↑' : '↓';
    const cls = a.triggered ? 'alert-tag triggered' : 'alert-tag';
    const status = a.triggered ? ' ✓' : '';
    return `<span class="${cls}">${a.symbol} ${cond} $${Number(a.targetPrice).toLocaleString()}${status} <button data-id="${a.id}">×</button></span>`;
  }).join('');
  c.querySelectorAll('button').forEach(b => b.addEventListener('click', () => deleteAlert(b.dataset.id)));
}

async function loadAlerts() {
  try {
    const r = await fetch(`${API}/alerts`);
    if (!r.ok) return;
    const d = await r.json();
    activeAlerts = d.filter(a => !a.triggered);
    renderAlerts(d); // show ALL alerts (active + triggered)
    renderTable();
  } catch {}
}

async function addAlert(payload) {
  const r = await fetch(`${API}/alerts`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  if (!r.ok) { const e = await r.json().catch(() => ({})); throw new Error(e.error || 'Failed'); }
  return r.json();
}

async function deleteAlert(id) {
  await fetch(`${API}/alerts/${id}`, { method: 'DELETE' });
  loadAlerts();
}

// --- Toast ---
function toast(msg) {
  const t = document.getElementById('toast');
  document.getElementById('toastMessage').textContent = msg;
  t.hidden = false;
  clearTimeout(t._t);
  t._t = setTimeout(() => t.hidden = true, 3000);
}

// --- Main refresh ---
async function refresh() {
  try {
    const [p, g, fg] = await Promise.all([fetchPrices(), fetchGlobal(), fetchFG()]);
    prices = p; globalData = g; fearGreed = fg;
    renderStats();
    renderTable();
  } catch (e) {
    console.error('Refresh failed', e);
    const tbody = document.getElementById('cryptoTableBody');
    if (tbody) tbody.innerHTML = '<tr><td colspan="11" class="table-msg">Failed to load</td></tr>';
  }
}

// --- Custom select logic ---
function initCustomSelect(wrapId, triggerId, menuId, hiddenId, onChange) {
  const wrap = document.getElementById(wrapId);
  const trigger = document.getElementById(triggerId);
  const menu = document.getElementById(menuId);
  const hidden = document.getElementById(hiddenId);
  const label = trigger.querySelector('.cs-label');

  trigger.addEventListener('click', () => {
    // Close all other custom selects first
    document.querySelectorAll('.custom-select.open').forEach(el => {
      if (el !== wrap) el.classList.remove('open');
    });
    wrap.classList.toggle('open');
  });

  menu.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (!li) return;
    const val = li.dataset.value;
    hidden.value = val;
    label.textContent = li.textContent;
    // Mark selected
    menu.querySelectorAll('li').forEach(l => l.classList.remove('selected'));
    li.classList.add('selected');
    wrap.classList.remove('open');
    if (onChange) onChange(val, li);
  });
}

// Close dropdowns on outside click
document.addEventListener('click', (e) => {
  if (!e.target.closest('.custom-select')) {
    document.querySelectorAll('.custom-select.open').forEach(el => el.classList.remove('open'));
  }
});

// Store selected crypto metadata
let selectedCryptoMeta = { symbol: '', name: '' };

initCustomSelect('cryptoSelectWrap', 'cryptoTrigger', 'cryptoMenu', 'cryptoSelect', (val, li) => {
  selectedCryptoMeta.symbol = li.dataset.symbol || '';
  selectedCryptoMeta.name = li.dataset.name || '';
});

initCustomSelect('conditionWrap', 'conditionTrigger', 'conditionMenu', 'condition');

// --- Form submit ---
document.getElementById('alertForm').addEventListener('submit', async e => {
  e.preventDefault();
  const cryptoId = document.getElementById('cryptoSelect').value;
  const data = {
    cryptoId,
    symbol: selectedCryptoMeta.symbol,
    name: selectedCryptoMeta.name,
    condition: document.getElementById('condition').value,
    targetPrice: parseFloat(document.getElementById('targetPrice').value),
    email: document.getElementById('email').value.trim(),
  };
  if (!data.cryptoId || !data.email || isNaN(data.targetPrice) || data.targetPrice <= 0) {
    toast('Please fill all fields'); return;
  }
  try {
    await addAlert(data);
    toast(`Alert set: ${data.symbol} at $${data.targetPrice}`);
    await loadAlerts();
  } catch (err) {
    toast(err.message || 'Failed');
  }
});

// --- Star toggle ---
document.getElementById('cryptoTableBody').addEventListener('click', e => {
  const td = e.target.closest('.td-star');
  if (!td) return;
  const coin = td.dataset.coin;
  if (favorites.has(coin)) {
    favorites.delete(coin);
  } else {
    favorites.add(coin);
  }
  renderTable();
});

// --- Init ---
refresh();
setInterval(refresh, 600000); // 10 minutes
loadAlerts();
