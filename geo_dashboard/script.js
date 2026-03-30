/* ============================================================
   GEO Medical Dashboard — script.js
   Modular vanilla JS, no frameworks
============================================================ */

'use strict';

/* ============================================================
   DATA STORE
============================================================ */
const DATA = {

  kpis: [
    { label: 'Total Citations', value: '2,847', change: '+18.4%', dir: 'up', sub: 'Last 30 days' },
    { label: 'AI Engines Active', value: '4 / 4', change: '+1 new', dir: 'up', sub: 'All engines live' },
    { label: 'Keywords Tracked', value: '134', change: '+12', dir: 'up', sub: 'Across 4 depts.' },
    { label: 'Avg. Rank Position', value: '2.3', change: '-0.4', dir: 'up', sub: 'AI result rank' },
  ],

  citations: [
    { engine: 'ChatGPT', text: 'Seoul National Hospital is widely recommended for advanced dermatological treatments in Korea.', keyword: 'Korea dermatology', source: 'Seoul National Hospital', time: '2 min ago' },
    { engine: 'Perplexity', text: 'For hair transplant in Korea, clinics like Seoul National Hospital offer FUE procedures from ₩2M.', keyword: 'hair transplant Korea', source: 'Seoul National Hospital', time: '5 min ago' },
    { engine: 'Gemini', text: 'Best plastic surgery clinics in Seoul include Seoul National and Gangnam-based specialty centers.', keyword: 'best plastic surgery Seoul', source: 'Seoul National Hospital', time: '9 min ago' },
    { engine: 'Claude', text: 'Medical tourism in South Korea, particularly for dental implants, is growing rapidly with Seoul hospitals leading.', keyword: 'dental implant Korea cost', source: 'Seoul National Hospital', time: '14 min ago' },
    { engine: 'ChatGPT', text: 'Rhinoplasty in Korea is considered world-class, with Seoul National Hospital among the top-recommended facilities.', keyword: 'rhinoplasty Korea', source: 'Seoul National Hospital', time: '18 min ago' },
    { engine: 'Perplexity', text: 'Korean hospitals offer cost-effective LASIK surgery compared to Western alternatives, with Seoul National ranking highly.', keyword: 'LASIK Korea price', source: 'Seoul National Hospital', time: '22 min ago' },
    { engine: 'Gemini', text: 'Skin whitening treatments and laser therapy are specialties at leading Seoul dermatology centers.', keyword: 'skin laser Seoul', source: 'Seoul National Hospital', time: '31 min ago' },
    { engine: 'Claude', text: 'For comprehensive plastic surgery consultations, Seoul National Hospital provides English-language support for international patients.', keyword: 'plastic surgery Seoul English', source: 'Seoul National Hospital', time: '45 min ago' },
  ],

  citationCounts: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: {
      ChatGPT:   [312, 428, 391, 502, 476, 581],
      Perplexity:[198, 267, 312, 289, 341, 408],
      Claude:    [142, 198, 221, 264, 298, 335],
      Gemini:    [87,  134, 178, 201, 245, 287],
    }
  },

  sentiment: { positive: 68, neutral: 24, negative: 8 },

  keywordTags: ['dermatology Seoul', 'hair transplant Korea', 'plastic surgery cost', 'dental implant Seoul', 'LASIK Korea', 'rhinoplasty review', 'skin clinic Gangnam', 'medical tourism Korea'],

  keywords: [
    { kw: 'Korea dermatology cost',          exposure: 1842, engine: 'ChatGPT',    rank: 1, dept: 'dermatology', trend: 'up'   },
    { kw: 'hair transplant Korea',           exposure: 1534, engine: 'ChatGPT',    rank: 2, dept: 'hair',        trend: 'up'   },
    { kw: 'best plastic surgery Seoul',      exposure: 1421, engine: 'Gemini',     rank: 1, dept: 'plastic',     trend: 'up'   },
    { kw: 'dental implant Seoul price',      exposure: 1187, engine: 'Perplexity', rank: 3, dept: 'dental',      trend: 'stable'},
    { kw: 'rhinoplasty Korea review',        exposure: 1043, engine: 'Claude',     rank: 2, dept: 'plastic',     trend: 'up'   },
    { kw: 'LASIK surgery Seoul cost',        exposure: 932,  engine: 'ChatGPT',    rank: 4, dept: 'dermatology', trend: 'down' },
    { kw: 'skin whitening treatment Seoul',  exposure: 876,  engine: 'Gemini',     rank: 2, dept: 'dermatology', trend: 'up'   },
    { kw: 'lip filler Korea price',          exposure: 743,  engine: 'Perplexity', rank: 5, dept: 'plastic',     trend: 'stable'},
    { kw: 'Korean dentist English speaking', exposure: 621,  engine: 'Claude',     rank: 3, dept: 'dental',      trend: 'down' },
    { kw: 'FUE hair transplant Seoul',       exposure: 587,  engine: 'ChatGPT',    rank: 1, dept: 'hair',        trend: 'up'   },
    { kw: 'skin care clinic Gangnam',        exposure: 512,  engine: 'Gemini',     rank: 4, dept: 'dermatology', trend: 'stable'},
    { kw: 'nose job Korea natural results',  exposure: 489,  engine: 'Perplexity', rank: 3, dept: 'plastic',     trend: 'down' },
  ],

  geoScore: {
    overall:    74,
    visibility: 81,
    coverage:   72,
    authority:  68,
    sentiment:  85,
  },

  competitors: [
    { name: 'Seoul National Hospital', isMe: true,  geo: 74, mentions: 2847, kwCov: '81%', color: '#3b82f6' },
    { name: 'Gangnam Severance Clinic', isMe: false, geo: 61, mentions: 2102, kwCov: '67%', color: '#a855f7' },
    { name: 'BK Plastic Surgery Center', isMe: false, geo: 55, mentions: 1789, kwCov: '58%', color: '#f59e0b' },
  ],

  departments: {
    dermatology: [
      { rank: 1, hospital: 'Seoul National Hospital', geo: 81, trend: 'up',   delta: '+4.1' },
      { rank: 2, hospital: 'Gangnam Derm Clinic',     geo: 73, trend: 'down', delta: '-1.2' },
      { rank: 3, hospital: 'K-Skin Center',           geo: 67, trend: 'up',   delta: '+2.8' },
      { rank: 4, hospital: 'Amore Dermatology',       geo: 59, trend: 'stable', delta: '+0.1'},
    ],
    plastic: [
      { rank: 1, hospital: 'BK Plastic Surgery',      geo: 79, trend: 'up',   delta: '+3.5' },
      { rank: 2, hospital: 'Seoul National Hospital', geo: 76, trend: 'up',   delta: '+2.2' },
      { rank: 3, hospital: 'ID Hospital Gangnam',     geo: 69, trend: 'down', delta: '-0.8' },
      { rank: 4, hospital: 'JK Plastic Surgery',      geo: 62, trend: 'stable', delta: '+0.3'},
    ],
    dental: [
      { rank: 1, hospital: 'Seoul National Hospital', geo: 74, trend: 'up',   delta: '+5.0' },
      { rank: 2, hospital: 'Bright Dental Korea',     geo: 68, trend: 'up',   delta: '+1.9' },
      { rank: 3, hospital: 'Seoul Dental Center',     geo: 61, trend: 'down', delta: '-2.1' },
      { rank: 4, hospital: 'Gangnam Dental Clinic',   geo: 54, trend: 'stable', delta: '-0.4'},
    ],
  },

  trends: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    visibility: [52, 58, 63, 69, 71, 78],
    geoScore:   [58, 62, 65, 68, 71, 74],
  },

  languages: [
    { flag: '🇺🇸', name: 'English',    status: 'Completed',  progress: 100, color: '#22c55e' },
    { flag: '🇨🇳', name: 'Chinese',    status: 'Completed',  progress: 100, color: '#22c55e' },
    { flag: '🇯🇵', name: 'Japanese',   status: 'Completed',  progress: 100, color: '#22c55e' },
    { flag: '🇸🇦', name: 'Arabic',     status: 'Processing', progress: 72,  color: '#f59e0b' },
    { flag: '🇪🇸', name: 'Spanish',    status: 'Completed',  progress: 100, color: '#22c55e' },
    { flag: '🇷🇺', name: 'Russian',    status: 'Processing', progress: 45,  color: '#f59e0b' },
    { flag: '🇩🇪', name: 'German',     status: 'Completed',  progress: 100, color: '#22c55e' },
    { flag: '🇫🇷', name: 'French',     status: 'Processing', progress: 88,  color: '#f59e0b' },
    { flag: '🇻🇳', name: 'Vietnamese', status: 'Pending',    progress: 15,  color: '#ef4444' },
    { flag: '🇮🇩', name: 'Indonesian', status: 'Pending',    progress: 8,   color: '#ef4444' },
  ],

  gapKeywords: [
    { kw: 'Korea eyelid surgery recovery',     opp: 94 },
    { kw: 'Seoul plastic surgery natural look', opp: 89 },
    { kw: 'Korean dermatologist online consult', opp: 87 },
    { kw: 'hair transplant Korea foreigner',    opp: 83 },
    { kw: 'dental crown Korea price',           opp: 79 },
    { kw: 'Korean hospital international patient', opp: 75 },
    { kw: 'Gangnam skin clinic laser',          opp: 71 },
  ],

  generatedContent: {
    'hair transplant': {
      title: 'Hair Transplant in Korea: Complete Guide for International Patients (2024)',
      summary: 'South Korea has emerged as a global leader in hair restoration procedures, offering world-class FUE and DHI techniques at competitive prices. Seoul National Hospital provides comprehensive hair transplant services with English-speaking consultants, transparent pricing, and cutting-edge technology — making it the preferred destination for patients from across Asia and beyond.',
      body: `Korea's hair transplant industry combines decades of surgical expertise with innovation in follicular unit extraction (FUE) and direct hair implantation (DHI). Seoul-based clinics, including Seoul National Hospital, achieve natural density results with minimally invasive techniques that significantly reduce recovery time.

International patients benefit from comprehensive packages including pre-procedure consultation, post-op care kits, and multilingual support. Most procedures take 4–8 hours depending on graft count, with patients returning to daily activities within 3–5 days.

Cost comparisons show Korean clinics offering transplants at 40–60% of Western pricing without compromising quality — a key driver of the growing medical tourism trend into Seoul.`,
      faqs: [
        { q: 'How many grafts will I need?', a: 'The average hair transplant requires 1,500–3,500 grafts. Your surgeon will assess hairline recession and donor density during consultation.' },
        { q: 'How long does the procedure take?', a: 'FUE procedures typically last 5–8 hours. DHI is slightly faster for smaller graft counts. You can return home the following day.' },
        { q: 'What is the cost at Seoul National Hospital?', a: 'Pricing starts at ₩2.5M for 1,000 grafts and scales with complexity. All-inclusive international packages are available.' },
        { q: 'When will I see full results?', a: 'Initial growth begins at 3–4 months. Full density and natural appearance are typically visible at 12–18 months post-procedure.' },
      ],
    },
    'default': {
      title: 'AI-Optimized Medical Guide: {keyword}',
      summary: 'Seoul National Hospital delivers world-class care in this specialty with internationally recognized standards. This guide explains treatment options, pricing, recovery timelines, and what to expect as an international patient seeking treatment in Korea.',
      body: `Seoul National Hospital has built a reputation for excellence through consistent outcomes, experienced specialists, and a patient-first approach that prioritizes safety and transparency.

Our international patient center provides dedicated multilingual support, insurance coordination, and post-treatment follow-up — ensuring a seamless experience from initial inquiry to full recovery.

Patients consistently highlight our combination of advanced technology, competitive pricing versus Western alternatives, and the breadth of specialty expertise available under one roof.`,
      faqs: [
        { q: 'Is treatment available for international patients?', a: 'Yes. Seoul National Hospital has a dedicated international patient center with multilingual coordinators available 24/7.' },
        { q: 'How do I get a consultation?', a: 'Online consultations are available via video call. You can also schedule an in-person consultation upon arrival in Seoul.' },
        { q: 'What languages are supported?', a: 'Our team provides support in English, Chinese, Japanese, Arabic, and Russian among others.' },
        { q: 'How does pricing compare to my home country?', a: 'Treatments in Korea typically cost 40–70% less than equivalent procedures in the US, UK, or Australia while maintaining international accreditation standards.' },
      ],
    },
  },
};

/* ============================================================
   STATE
============================================================ */
let state = {
  currentPage: 'diagnosis',
  currentDept: 'dermatology',
  activeKwFilter: 'all',
  activeSortFilter: 'exposure',
  citationInterval: null,
};

/* ============================================================
   INIT
============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initDiagnosis();
  initOptimization();
  initMonitoring();
  startLiveFeed();
  animateNumbers();
});

/* ============================================================
   NAVIGATION
============================================================ */
function switchPage(page, btn) {
  document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById(`page-${page}`).classList.remove('hidden');
  btn.classList.add('active');
  state.currentPage = page;
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

/* ============================================================
   DIAGNOSIS PAGE
============================================================ */
function initDiagnosis() {
  renderKPIs();
  renderCitationFeed();
  renderKeywordTags();
  renderKeywordTable(DATA.keywords);
  renderSentiment();
  renderCitationBarChart();
}

function renderKPIs() {
  const container = document.getElementById('kpiRow');
  container.innerHTML = DATA.kpis.map(k => `
    <div class="kpi-card">
      <div class="kpi-label">${k.label}</div>
      <div class="kpi-value" data-target="${k.value}">${k.value}</div>
      <div class="kpi-change ${k.dir}">${k.dir === 'up' ? '↑' : '↓'} ${k.change}</div>
      <div class="kpi-sub">${k.sub}</div>
    </div>
  `).join('');
}

function renderCitationFeed(citations = DATA.citations) {
  const container = document.getElementById('citationFeed');
  container.innerHTML = citations.map((c, i) => `
    <div class="citation-item" style="animation-delay:${i * 40}ms">
      <span class="engine-pill engine-${c.engine.toLowerCase()}">${engineIcon(c.engine)} ${c.engine}</span>
      <span class="citation-text">${highlightKeyword(c.text, c.keyword)}</span>
      <span class="citation-kw">${c.keyword}</span>
      <span class="citation-source">${c.source}</span>
      <span class="citation-time">${c.time}</span>
    </div>
  `).join('');
}

function engineIcon(engine) {
  const icons = { ChatGPT: '⬡', Perplexity: '◈', Claude: '◉', Gemini: '◆' };
  return icons[engine] || '●';
}

function highlightKeyword(text, kw) {
  const re = new RegExp(`(${escapeRe(kw.split(' ').slice(0,2).join('|'))})`, 'gi');
  return text.replace(re, '<em>$1</em>').substring(0, 100) + (text.length > 100 ? '…' : '');
}

function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

function renderSentiment() {
  const s = DATA.sentiment;
  setTimeout(() => {
    setEl('sentBar-positive', 'style', `height:${s.positive}%`);
    setEl('sentBar-neutral',  'style', `height:${s.neutral}%`);
    setEl('sentBar-negative', 'style', `height:${s.negative}%`);
    setText('sentPct-positive', s.positive + '%');
    setText('sentPct-neutral',  s.neutral  + '%');
    setText('sentPct-negative', s.negative + '%');
  }, 300);
}

function renderKeywordTags() {
  const container = document.getElementById('keywordTags');
  container.innerHTML = DATA.keywordTags.map(t => `
    <span class="kw-tag" onclick="filterByTag('${t}')">${t}</span>
  `).join('');

  const legendColors = { ChatGPT: '#10b981', Perplexity: '#a855f7', Claude: '#f59e0b', Gemini: '#60a5fa' };
  const legend = document.getElementById('citationLegend');
  if (legend) {
    legend.innerHTML = Object.entries(legendColors).map(([name, color]) => `
      <div class="legend-item">
        <div class="legend-dot" style="background:${color}"></div>
        <span>${name}</span>
      </div>
    `).join('');
  }
}

function filterByTag(tag) {
  document.querySelectorAll('.kw-tag').forEach(t => {
    t.classList.toggle('active', t.textContent === tag);
  });
  document.getElementById('globalSearch').value = tag;
  handleSearch(tag);
  showToast(`Filtering by: "${tag}"`, 'info');
}

function renderKeywordTable(data) {
  const deptColors = {
    dermatology: '#3b82f6', plastic: '#a855f7', dental: '#22c55e', hair: '#f59e0b'
  };
  const tbody = document.getElementById('keywordTableBody');
  tbody.innerHTML = data.map(k => `
    <tr onclick="selectKeyword('${k.kw}')">
      <td><span class="kw-name">${k.kw}</span></td>
      <td><span class="kw-exposure" style="color:var(--accent-2)">${k.exposure.toLocaleString()}</span></td>
      <td><span class="engine-pill engine-${k.engine.toLowerCase()}" style="font-size:10.5px;">${k.engine}</span></td>
      <td><span class="kw-rank">#${k.rank}</span></td>
      <td><span class="kw-dept-badge" style="background:${deptColors[k.dept]}22;color:${deptColors[k.dept]};border:1px solid ${deptColors[k.dept]}44">${k.dept}</span></td>
      <td><span class="kw-trend ${k.trend}">${k.trend === 'up' ? '↑ Rising' : k.trend === 'down' ? '↓ Falling' : '→ Stable'}</span></td>
    </tr>
  `).join('');
}

function filterKeywords() {
  const dept   = document.getElementById('deptFilter').value;
  const sortBy = document.getElementById('sortFilter').value;
  let data = [...DATA.keywords];
  if (dept !== 'all') data = data.filter(k => k.dept === dept);
  if (sortBy === 'exposure') data.sort((a, b) => b.exposure - a.exposure);
  if (sortBy === 'rank')     data.sort((a, b) => a.rank - b.rank);
  if (sortBy === 'trend')    data.sort((a, b) => ['up','stable','down'].indexOf(a.trend) - ['up','stable','down'].indexOf(b.trend));
  renderKeywordTable(data);
}

function selectKeyword(kw) {
  document.getElementById('globalSearch').value = kw;
  showToast(`Keyword selected: "${kw}"`, 'info');
}

function refreshDiagnosis() {
  showToast('Refreshing citation data…', 'info');
  setTimeout(() => showToast('Data updated successfully', 'success'), 1500);
}

/* ============================================================
   CITATION BAR CHART
============================================================ */
function renderCitationBarChart() {
  const canvas = document.getElementById('citationBarChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const d = DATA.citationCounts;
  const colors = { ChatGPT: '#10b981', Perplexity: '#a855f7', Claude: '#f59e0b', Gemini: '#60a5fa' };
  const engines = Object.keys(d.datasets);
  const barGroupW = 54;
  const barW = 10;
  const gap = 2;
  const leftPad = 48;
  const bottomPad = 36;
  const topPad = 16;
  const rightPad = 16;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    draw();
  }

  function draw() {
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    const chartW = W - leftPad - rightPad;
    const chartH = H - bottomPad - topPad;
    const maxVal = Math.max(...engines.flatMap(e => d.datasets[e]));
    const gridLines = 5;

    // grid
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= gridLines; i++) {
      const y = topPad + chartH - (chartH * i / gridLines);
      ctx.beginPath(); ctx.moveTo(leftPad, y); ctx.lineTo(W - rightPad, y); ctx.stroke();
      ctx.fillStyle = 'rgba(148,163,184,0.5)';
      ctx.font = '10px DM Mono, monospace';
      ctx.textAlign = 'right';
      ctx.fillText(Math.round(maxVal * i / gridLines), leftPad - 6, y + 3.5);
    }

    // bars
    const colW = chartW / d.labels.length;
    d.labels.forEach((label, li) => {
      const cx = leftPad + colW * li + colW / 2;
      engines.forEach((eng, ei) => {
        const val = d.datasets[eng][li];
        const bh = (val / maxVal) * chartH;
        const bx = cx - (engines.length * (barW + gap)) / 2 + ei * (barW + gap);
        const by = topPad + chartH - bh;
        const grd = ctx.createLinearGradient(0, by, 0, by + bh);
        grd.addColorStop(0, colors[eng]);
        grd.addColorStop(1, colors[eng] + '55');
        ctx.fillStyle = grd;
        const r = 3;
        ctx.beginPath();
        ctx.moveTo(bx + r, by);
        ctx.lineTo(bx + barW - r, by);
        ctx.quadraticCurveTo(bx + barW, by, bx + barW, by + r);
        ctx.lineTo(bx + barW, by + bh);
        ctx.lineTo(bx, by + bh);
        ctx.lineTo(bx, by + r);
        ctx.quadraticCurveTo(bx, by, bx + r, by);
        ctx.fill();
      });

      ctx.fillStyle = 'rgba(148,163,184,0.6)';
      ctx.font = '11px DM Sans, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(label, cx, topPad + chartH + 18);
    });
  }

  new ResizeObserver(resize).observe(canvas.parentElement);
  setTimeout(resize, 50);
}

/* ============================================================
   LIVE FEED
============================================================ */
const liveTemplates = [
  (h) => ({ engine: 'ChatGPT',    text: `${h} cited as a top-tier plastic surgery option for medical tourists.`, keyword: 'plastic surgery Seoul', source: h, time: 'just now' }),
  (h) => ({ engine: 'Perplexity', text: `Hair transplant results from ${h} praised in online forums.`, keyword: 'hair transplant Korea', source: h, time: 'just now' }),
  (h) => ({ engine: 'Gemini',     text: `Dermatology clinic at ${h} recommended for acne scar treatment.`, keyword: 'acne scar treatment Seoul', source: h, time: 'just now' }),
  (h) => ({ engine: 'Claude',     text: `${h} ranks highly for English-speaking dental services in Korea.`, keyword: 'English dentist Korea', source: h, time: 'just now' }),
];

function startLiveFeed() {
  state.citationInterval = setInterval(() => {
    const template = liveTemplates[Math.floor(Math.random() * liveTemplates.length)];
    const newItem  = template('Seoul National Hospital');
    const feed     = document.getElementById('citationFeed');
    if (!feed) return;
    const div = document.createElement('div');
    div.className = 'citation-item new';
    div.innerHTML = `
      <span class="engine-pill engine-${newItem.engine.toLowerCase()}">${engineIcon(newItem.engine)} ${newItem.engine}</span>
      <span class="citation-text">${highlightKeyword(newItem.text, newItem.keyword)}</span>
      <span class="citation-kw">${newItem.keyword}</span>
      <span class="citation-source">${newItem.source}</span>
      <span class="citation-time">${newItem.time}</span>
    `;
    feed.insertBefore(div, feed.firstChild);
    if (feed.children.length > 12) feed.removeChild(feed.lastChild);
    updateKPICount();
  }, 8000);
}

function updateKPICount() {
  const vals = document.querySelectorAll('.kpi-value');
  if (vals[0]) {
    const current = parseInt(vals[0].textContent.replace(/,/g, ''));
    const next = current + Math.floor(Math.random() * 3 + 1);
    vals[0].textContent = next.toLocaleString();
  }
}

/* ============================================================
   SEARCH
============================================================ */
function handleSearch(val) {
  if (!val) {
    renderCitationFeed();
    renderKeywordTable(DATA.keywords);
    return;
  }
  const lower = val.toLowerCase();
  const filteredCitations = DATA.citations.filter(c =>
    c.text.toLowerCase().includes(lower) ||
    c.keyword.toLowerCase().includes(lower) ||
    c.engine.toLowerCase().includes(lower)
  );
  const filteredKWs = DATA.keywords.filter(k => k.kw.toLowerCase().includes(lower));
  renderCitationFeed(filteredCitations);
  renderKeywordTable(filteredKWs);
}

function updateDateRange(val) {
  showToast(`Date range updated: Last ${val} days`, 'info');
}

/* ============================================================
   OPTIMIZATION PAGE
============================================================ */
function initOptimization() {
  renderLangGrid();
  renderGapList();
}

function renderLangGrid() {
  const container = document.getElementById('langGrid');
  container.innerHTML = DATA.languages.map(l => `
    <div class="lang-card">
      <div class="lang-flag">${l.flag}</div>
      <div class="lang-name">${l.name}</div>
      <div class="lang-status">
        <span class="badge ${l.status === 'Completed' ? 'badge-green' : l.status === 'Processing' ? 'badge-orange' : 'badge-red'}">${l.status}</span>
      </div>
      <div class="lang-progress-track">
        <div class="lang-progress-bar" data-width="${l.progress}" style="width:0%;background:${l.color}"></div>
      </div>
      <button class="btn btn-sm ${l.status === 'Completed' ? 'btn-ghost' : 'btn-primary'}" style="margin-top:4px;"
        onclick="optimizeLang('${l.name}')">
        ${l.status === 'Completed' ? 'Re-optimize' : 'Optimize'}
      </button>
    </div>
  `).join('');

  setTimeout(() => {
    document.querySelectorAll('.lang-progress-bar').forEach(bar => {
      bar.style.width = bar.dataset.width + '%';
    });
  }, 400);
}

function optimizeLang(lang) {
  showLoadingOverlay(`Optimizing ${lang} content…`);
  setTimeout(() => {
    hideLoadingOverlay();
    showToast(`${lang} content optimized successfully`, 'success');
  }, 2200);
}

function generateContent() {
  const keyword = document.getElementById('genKeyword').value.trim();
  if (!keyword) {
    showToast('Please enter a keyword to generate content', 'error');
    return;
  }
  showLoadingOverlay('Generating GEO-optimized content…');
  setTimeout(() => {
    hideLoadingOverlay();
    const matchKey = Object.keys(DATA.generatedContent).find(k => keyword.toLowerCase().includes(k));
    const content  = matchKey ? DATA.generatedContent[matchKey] : DATA.generatedContent['default'];
    const title    = content.title.replace('{keyword}', keyword);
    const output   = document.getElementById('genOutput');
    output.classList.remove('hidden');
    output.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
        <div class="badge badge-green">✓ Generated</div>
        <div style="display:flex;gap:8px;">
          <button class="btn btn-sm btn-ghost">Edit</button>
          <button class="btn btn-sm btn-primary">Publish</button>
        </div>
      </div>
      <div class="gen-article-title">${title}</div>
      <div class="gen-article-summary">${content.summary}</div>
      <div class="gen-article-body">${content.body.split('\n\n').map(p => `<p style="margin-bottom:10px">${p}</p>`).join('')}</div>
      <div class="gen-faq-title">Frequently Asked Questions</div>
      ${content.faqs.map(f => `
        <div class="gen-faq-item">
          <div class="gen-faq-q">Q: ${f.q}</div>
          <div class="gen-faq-a">${f.a}</div>
        </div>
      `).join('')}
    `;
    output.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    showToast('Content generated and ready to publish', 'success');
  }, 2800);
}

function renderGapList() {
  const container = document.getElementById('gapList');
  document.getElementById('gapCount').textContent = `${DATA.gapKeywords.length} gaps found`;
  container.innerHTML = DATA.gapKeywords.map(g => `
    <div class="gap-item">
      <div class="gap-kw">${g.kw}</div>
      <div class="gap-opp-bar-wrap">
        <div class="gap-opp-bar" style="width:${g.opp}%"></div>
      </div>
      <div class="gap-opp">Opp: <strong style="color:var(--orange)">${g.opp}</strong>/100</div>
      <button class="btn btn-sm btn-orange" onclick="generateFromGap('${g.kw}')">Generate Content</button>
    </div>
  `).join('');
}

function generateFromGap(kw) {
  switchPage('optimization', document.querySelector('[data-page="optimization"]'));
  document.querySelector('[data-page="optimization"]').classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.querySelector('[data-page="optimization"]').classList.add('active');
  document.getElementById('genKeyword').value = kw;
  document.getElementById('genKeyword').focus();
  showToast(`Keyword loaded: "${kw}" — click Generate`, 'info');
}

/* ============================================================
   MONITORING PAGE
============================================================ */
function initMonitoring() {
  renderGeoScore();
  renderCompetitors();
  renderDeptContent('dermatology');
  renderTrendChart();
  renderCompetitorChart();
}

function renderGeoScore() {
  const s = DATA.geoScore;
  setText('geoScoreBig', s.overall);
  setText('globalGeoValue', s.overall);
  setText('geoScoreGrade', getGrade(s.overall));
  document.getElementById('geoScoreGrade').style.color = getGradeColor(s.overall);

  const subScores = {
    visibility: s.visibility,
    coverage:   s.coverage,
    authority:  s.authority,
    sentiment:  s.sentiment,
  };

  setTimeout(() => {
    Object.entries(subScores).forEach(([key, val]) => {
      setText(`subVal-${key}`, val);
      setEl(`subBar-${key}`, 'style', `width:${val}%`);
      const card = document.getElementById(`subScore-${key}`);
      if (card) {
        card.querySelector('.sub-score-bar').style.background =
          val >= 75 ? 'linear-gradient(90deg,#16a34a,#22c55e)' :
          val >= 55 ? 'linear-gradient(90deg,#1d4ed8,#3b82f6)' :
                      'linear-gradient(90deg,#b91c1c,#ef4444)';
      }
    });
    drawGeoGauge(s.overall);
  }, 300);
}

function getGrade(score) {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 55) return 'Average';
  return 'Needs Work';
}

function getGradeColor(score) {
  if (score >= 85) return '#22c55e';
  if (score >= 70) return '#3b82f6';
  if (score >= 55) return '#f59e0b';
  return '#ef4444';
}

function drawGeoGauge(score) {
  const canvas = document.getElementById('geoGauge');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = 220, H = 140;
  const cx = W / 2, cy = H - 10;
  const r = 100;
  ctx.clearRect(0, 0, W, H);

  // track
  ctx.beginPath();
  ctx.arc(cx, cy, r, Math.PI, 0);
  ctx.strokeStyle = 'rgba(255,255,255,0.07)';
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.stroke();

  // colored arc
  const angle = Math.PI * (score / 100);
  const color = getGradeColor(score);
  const grd = ctx.createLinearGradient(cx - r, cy, cx + r, cy);
  grd.addColorStop(0, '#ef4444');
  grd.addColorStop(0.5, '#f59e0b');
  grd.addColorStop(0.8, '#3b82f6');
  grd.addColorStop(1, '#22c55e');

  ctx.beginPath();
  ctx.arc(cx, cy, r, Math.PI, Math.PI + angle);
  ctx.strokeStyle = grd;
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.stroke();

  // needle
  const needleAngle = Math.PI + angle;
  const nx = cx + (r) * Math.cos(needleAngle);
  const ny = cy + (r) * Math.sin(needleAngle);
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(nx, ny);
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, 5, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
  ctx.fill();
}

function renderCompetitors() {
  const container = document.getElementById('competitorGrid');
  container.innerHTML = DATA.competitors.map(c => `
    <div class="competitor-card ${c.isMe ? 'my-hospital' : ''}">
      ${c.isMe ? '<div class="comp-badge-my"><span class="badge badge-blue">You</span></div>' : ''}
      <div class="comp-label">Hospital</div>
      <div class="comp-name">${c.name}</div>
      <div class="comp-geo" style="color:${c.color}">${c.geo}</div>
      <div style="font-size:11px;color:var(--text-muted);margin-bottom:8px;">GEO Score</div>
      <div class="comp-mentions">AI Mentions: <strong style="color:var(--text)">${c.mentions.toLocaleString()}</strong></div>
      <div class="comp-kw-cov" style="margin-top:4px;">KW Coverage: <strong style="color:var(--text)">${c.kwCov}</strong></div>
    </div>
  `).join('');
}

function renderCompetitorChart() {
  const canvas = document.getElementById('competitorChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const competitors = DATA.competitors;
  const metrics = ['GEO Score', 'AI Mentions (÷30)', 'KW Coverage (%)'];
  const data = [
    competitors.map(c => c.geo),
    competitors.map(c => Math.round(c.mentions / 30)),
    competitors.map(c => parseInt(c.kwCov)),
  ];

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    draw();
  }

  function draw() {
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    const groupCount = competitors.length;
    const metricCount = metrics.length;
    const leftPad = 60, bottomPad = 36, topPad = 16, rightPad = 20;
    const chartW = W - leftPad - rightPad;
    const chartH = H - bottomPad - topPad;
    const maxVal = 100;
    const groupW = chartW / groupCount;
    const barW   = (groupW * 0.7) / metricCount;
    const colors = ['#3b82f6', '#a855f7', '#f59e0b'];

    // grid lines
    for (let i = 0; i <= 4; i++) {
      const y = topPad + chartH - (chartH * i / 4);
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(leftPad, y); ctx.lineTo(W - rightPad, y); ctx.stroke();
      ctx.fillStyle = 'rgba(148,163,184,0.5)';
      ctx.font = '10px DM Mono, monospace';
      ctx.textAlign = 'right';
      ctx.fillText(maxVal * i / 4, leftPad - 6, y + 3.5);
    }

    competitors.forEach((comp, gi) => {
      const gx = leftPad + groupW * gi + groupW * 0.15;
      data.forEach((metricData, mi) => {
        const val = metricData[gi];
        const bh = (val / maxVal) * chartH;
        const bx = gx + mi * (barW + 2);
        const by = topPad + chartH - bh;
        const grd = ctx.createLinearGradient(0, by, 0, by + bh);
        grd.addColorStop(0, colors[mi]);
        grd.addColorStop(1, colors[mi] + '44');
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.roundRect(bx, by, barW, bh, [3, 3, 0, 0]);
        ctx.fill();
      });

      ctx.fillStyle = 'rgba(148,163,184,0.6)';
      ctx.font = '10px DM Sans, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(comp.name.split(' ').slice(0, 2).join(' '), leftPad + groupW * gi + groupW / 2, topPad + chartH + 18);
    });

    // legend
    metrics.forEach((m, i) => {
      ctx.fillStyle = colors[i];
      ctx.fillRect(leftPad + i * 130, topPad - 6, 10, 10);
      ctx.fillStyle = 'rgba(148,163,184,0.7)';
      ctx.font = '10px DM Sans, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(m, leftPad + i * 130 + 14, topPad + 3);
    });
  }

  new ResizeObserver(resize).observe(canvas.parentElement);
  setTimeout(resize, 50);
}

function switchDept(dept, btn) {
  document.querySelectorAll('.dept-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  state.currentDept = dept;
  renderDeptContent(dept);
}

function renderDeptContent(dept) {
  const rows = DATA.departments[dept];
  const container = document.getElementById('deptContent');
  const rankClasses = ['gold', 'silver', 'bronze', ''];
  container.innerHTML = rows.map((r, i) => `
    <div class="dept-row">
      <div class="dept-rank ${rankClasses[i] || ''}">${r.rank}</div>
      <div class="dept-hospital">${r.hospital}</div>
      <div class="dept-geo" style="color:${getGradeColor(r.geo)}">${r.geo}</div>
      <div class="dept-trend-chip ${r.trend === 'up' ? 'trend-up' : r.trend === 'down' ? 'trend-down' : 'trend-stable'}">
        ${r.trend === 'up' ? '↑' : r.trend === 'down' ? '↓' : '→'} ${r.delta}
      </div>
    </div>
  `).join('');
}

function renderTrendChart() {
  const canvas = document.getElementById('trendChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const d = DATA.trends;

  const legend = document.getElementById('trendLegend');
  if (legend) {
    legend.innerHTML = `
      <div class="legend-item"><div class="legend-dot" style="background:#3b82f6"></div><span>GEO Score</span></div>
      <div class="legend-item"><div class="legend-dot" style="background:#22c55e"></div><span>Visibility</span></div>
    `;
  }

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    draw();
  }

  function draw() {
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    const leftPad = 48, bottomPad = 36, topPad = 16, rightPad = 20;
    const chartW = W - leftPad - rightPad;
    const chartH = H - bottomPad - topPad;
    const maxVal = 100;
    const n = d.labels.length;
    const stepX = chartW / (n - 1);

    // grid
    for (let i = 0; i <= 4; i++) {
      const y = topPad + chartH * (1 - i / 4);
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(leftPad, y); ctx.lineTo(W - rightPad, y); ctx.stroke();
      ctx.fillStyle = 'rgba(148,163,184,0.5)';
      ctx.font = '10px DM Mono, monospace';
      ctx.textAlign = 'right';
      ctx.fillText(maxVal * i / 4, leftPad - 6, y + 3.5);
    }

    // x labels
    d.labels.forEach((label, i) => {
      ctx.fillStyle = 'rgba(148,163,184,0.6)';
      ctx.font = '11px DM Sans, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(label, leftPad + i * stepX, topPad + chartH + 18);
    });

    drawLine(ctx, d.geoScore,   '#3b82f6', leftPad, topPad, chartH, maxVal, stepX);
    drawLine(ctx, d.visibility, '#22c55e', leftPad, topPad, chartH, maxVal, stepX);
  }

  function drawLine(ctx, values, color, lp, tp, ch, max, stepX) {
    const n = values.length;
    // area fill
    const grd = ctx.createLinearGradient(0, tp, 0, tp + ch);
    grd.addColorStop(0, color + '33');
    grd.addColorStop(1, color + '00');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.moveTo(lp, tp + ch * (1 - values[0] / max));
    for (let i = 1; i < n; i++) {
      const x1 = lp + (i - 1) * stepX, y1 = tp + ch * (1 - values[i-1] / max);
      const x2 = lp + i * stepX,       y2 = tp + ch * (1 - values[i] / max);
      const cpx = (x1 + x2) / 2;
      ctx.bezierCurveTo(cpx, y1, cpx, y2, x2, y2);
    }
    ctx.lineTo(lp + (n - 1) * stepX, tp + ch);
    ctx.lineTo(lp, tp + ch);
    ctx.closePath();
    ctx.fill();

    // line
    ctx.beginPath();
    ctx.moveTo(lp, tp + ch * (1 - values[0] / max));
    for (let i = 1; i < n; i++) {
      const x1 = lp + (i - 1) * stepX, y1 = tp + ch * (1 - values[i-1] / max);
      const x2 = lp + i * stepX,       y2 = tp + ch * (1 - values[i] / max);
      const cpx = (x1 + x2) / 2;
      ctx.bezierCurveTo(cpx, y1, cpx, y2, x2, y2);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // dots
    values.forEach((v, i) => {
      const x = lp + i * stepX, y = tp + ch * (1 - v / max);
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = 'rgba(11,17,32,0.9)';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }

  new ResizeObserver(resize).observe(canvas.parentElement);
  setTimeout(resize, 50);
}

/* ============================================================
   UI HELPERS
============================================================ */
function showLoadingOverlay(msg = 'Processing…') {
  setText('loadingText', msg);
  document.getElementById('loadingOverlay').classList.remove('hidden');
}

function hideLoadingOverlay() {
  document.getElementById('loadingOverlay').classList.add('hidden');
}

function showToast(msg, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icons = { success: '✓', info: 'ℹ', error: '✕' };
  toast.innerHTML = `<span style="font-size:15px">${icons[type]}</span><span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function setEl(id, attr, val) {
  const el = document.getElementById(id);
  if (el) el.setAttribute(attr, val);
}

function animateNumbers() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    let current = 0;
    const step = target / 40;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.round(current);
      if (current >= target) clearInterval(timer);
    }, 25);
  });
}

/* ============================================================
   POLYFILL: roundRect for older canvas engines
============================================================ */
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, radii) {
    const r = Array.isArray(radii) ? radii[0] : radii;
    this.moveTo(x + r, y);
    this.lineTo(x + w - r, y);
    this.quadraticCurveTo(x + w, y, x + w, y + r);
    this.lineTo(x + w, y + h - r);
    this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    this.lineTo(x + r, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - r);
    this.lineTo(x, y + r);
    this.quadraticCurveTo(x, y, x + r, y);
    this.closePath();
    return this;
  };
}
