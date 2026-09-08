// ================================================================
// VASUDEV VERMA WEBSITE — Main JavaScript
// Handles: Navbar, Schedule loading, Gallery, Admin, Forms
// ================================================================

// ---- Utility: format date ----
function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}
function formatDateEn(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}
function getTodayStr() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// ---- Utility: badge class for event type ----
function getBadgeClass(type) {
  const map = {
    'Party Meeting': 'badge-party',
    'Public Meeting': 'badge-public',
    'Inauguration': 'badge-inauguration',
    'Press Conference': 'badge-press',
    'Social Initiative': 'badge-social',
    'Constituency Work': 'badge-constituency',
    'Public Event': 'badge-public',
  };
  return map[type] || 'badge-default';
}

// ---- Navbar: mobile toggle + active link ----
function initNavbar() {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
        mobileNav.classList.remove('open');
      }
    });
  }
  // Active link highlight
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-nav a, .mobile-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

// ---- Load schedule from JSON ----
async function loadSchedule() {
  try {
    const res = await fetch('./schedule.json');
    return await res.json();
  } catch (e) {
    // Try relative path for subpages
    try {
      const res = await fetch('./schedule.json');
      return await res.json();
    } catch (e2) { return []; }
  }
}

// ---- Today's Schedule Widget (home page) ----
async function initTodayWidget() {
  const container = document.getElementById('today-schedule-timeline');
  const dateDisplay = document.getElementById('today-date-display');
  if (!container) return;

  const today = getTodayStr();
  if (dateDisplay) dateDisplay.textContent = formatDate(today);

  const data = await loadSchedule();
  const todayEvents = data.filter(e => e.date === today).sort((a, b) => a.time.localeCompare(b.time));

  if (todayEvents.length === 0) {
    container.innerHTML = `
      <div class="no-schedule">
        <div class="icon">📅</div>
        <p>आज का शेड्यूल अभी उपलब्ध नहीं है।<br><small>Please check back later or visit the full schedule page.</small></p>
      </div>`;
    return;
  }

  container.innerHTML = todayEvents.map((ev, i) => `
    <div class="schedule-entry">
      <div class="schedule-time-col">
        <span class="schedule-time">${ev.time}</span>
      </div>
      <div class="schedule-dot-col">
        <div class="schedule-dot"></div>
        ${i < todayEvents.length - 1 ? '<div class="schedule-line"></div>' : ''}
      </div>
      <div class="schedule-content">
        <span class="event-badge ${getBadgeClass(ev.eventType)}">${ev.eventType}</span>
        <div class="schedule-title">${ev.title}</div>
        <div class="schedule-location">
          📍 ${ev.location}
          ${ev.mapUrl ? `<a href="${ev.mapUrl}" target="_blank" rel="noopener">Maps ↗</a>` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

// ---- Full Schedule Page ----
async function initFullSchedule() {
  const container = document.getElementById('full-schedule-container');
  const dateTabsEl = document.getElementById('date-tabs');
  if (!container) return;

  const data = await loadSchedule();
  const today = getTodayStr();

  // Get unique dates, sorted desc
  const dates = [...new Set(data.map(e => e.date))].sort((a, b) => b.localeCompare(a));
  let activeDate = today;
  if (!dates.includes(today)) activeDate = dates[0] || today;

  // Render date tabs
  if (dateTabsEl) {
    dateTabsEl.innerHTML = dates.map(d => {
      const dateObj = new Date(d + 'T00:00:00');
      const isToday = d === today;
      return `
        <button class="date-tab ${d === activeDate ? 'active' : ''} ${isToday ? 'today' : ''}"
                data-date="${d}" onclick="switchDate('${d}')">
          <span class="day">${dateObj.getDate()}</span>
          <span class="dow">${dateObj.toLocaleDateString('en-IN', {weekday:'short'})}</span>
          ${isToday ? '<span style="font-size:0.6rem;color:var(--saffron)">TODAY</span>' : `<span style="font-size:0.65rem">${dateObj.toLocaleDateString('en-IN',{month:'short'})}</span>`}
        </button>`;
    }).join('');
  }

  window._scheduleData = data;
  window._activeDate = activeDate;
  renderScheduleForDate(activeDate);
}

function switchDate(date) {
  window._activeDate = date;
  document.querySelectorAll('.date-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.date === date);
  });
  renderScheduleForDate(date);
}

function renderScheduleForDate(date) {
  const container = document.getElementById('full-schedule-container');
  if (!container) return;
  const data = window._scheduleData || [];
  const events = data.filter(e => e.date === date).sort((a, b) => a.time.localeCompare(b.time));
  const headerDate = document.getElementById('schedule-header-date');
  if (headerDate) headerDate.textContent = formatDate(date);

  if (events.length === 0) {
    container.innerHTML = `<div class="no-schedule" style="padding:4rem;"><div class="icon">📅</div><p>इस दिन कोई कार्यक्रम दर्ज नहीं है।</p></div>`;
    return;
  }

  container.innerHTML = events.map((ev, i) => `
    <div class="full-entry">
      <div class="full-entry-time">${ev.time}</div>
      <div class="full-entry-dot">
        <div class="dot"></div>
        ${i < events.length - 1 ? '<div class="line"></div>' : ''}
      </div>
      <div class="full-entry-body">
        <span class="event-badge ${getBadgeClass(ev.eventType)}">${ev.eventType}</span>
        <h4>${ev.title}</h4>
        <div class="location">📍 ${ev.location}</div>
        ${ev.description ? `<p class="description">${ev.description}</p>` : ''}
        ${ev.mapUrl ? `<a class="map-btn" href="${ev.mapUrl}" target="_blank" rel="noopener">🗺️ Google Maps पर देखें</a>` : ''}
      </div>
    </div>
  `).join('');
}

// ---- News Page ----
async function loadNews() {
  try {
    const res = await fetch('./news.json');
    return await res.json();
  } catch {
    try { const res = await fetch('./news.json'); return await res.json(); } catch { return []; }
  }
}
async function initNewsPage() {
  const container = document.getElementById('news-container');
  if (!container) return;
  const data = await loadNews();
  container.innerHTML = data.map(item => `
    <div class="news-card">
      <div class="news-card-body">
        <div class="news-source">${item.source}</div>
        <h3>${item.headline}</h3>
        <p>${item.summary}</p>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:0.75rem;">
          <span class="news-date">📅 ${formatDate(item.date)}</span>
          <a href="${item.url}" class="news-link" target="_blank">पूरी खबर पढ़ें →</a>
        </div>
      </div>
    </div>
  `).join('');
}

// ---- Gallery ----
let allGalleryItems = [];
function initGallery() {
  allGalleryItems = document.querySelectorAll('.gallery-item');
  // Lightbox
  document.addEventListener('click', (e) => {
    const item = e.target.closest('.gallery-item');
    if (item && item.dataset.src) openLightbox(item.dataset.src, item.dataset.caption);
  });
  document.addEventListener('click', (e) => {
    if (e.target.closest('.lightbox') && !e.target.closest('.lightbox-content')) closeLightbox();
    if (e.target.closest('.lightbox-close')) closeLightbox();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
}
function filterGallery(category) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b.dataset.filter === category));
  document.querySelectorAll('.gallery-item').forEach(item => {
    const show = category === 'all' || item.dataset.category === category;
    item.style.display = show ? '' : 'none';
  });
}
function openLightbox(src, caption) {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  lb.querySelector('img').src = src;
  lb.querySelector('.lightbox-caption').textContent = caption || '';
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  lb.classList.remove('open');
  document.body.style.overflow = '';
}

// ---- Social tab switch ----
function switchSocialTab(tabId) {
  document.querySelectorAll('.social-tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tabId));
  document.querySelectorAll('.social-tab-content').forEach(c => c.style.display = c.id === tabId ? '' : 'none');
}

// ---- Contact/Volunteer Forms ----
function initForms() {
  document.querySelectorAll('form.ajax-form').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const msg = form.querySelector('.success-msg');
      btn.disabled = true; btn.textContent = 'भेजा जा रहा है…';
      await new Promise(r => setTimeout(r, 1200));
      btn.disabled = false; btn.textContent = btn.dataset.label || 'Submit';
      form.reset();
      if (msg) { msg.classList.add('show'); setTimeout(() => msg.classList.remove('show'), 5000); }
    });
  });
}

// ================================================================
// ADMIN PANEL
// ================================================================
const ADMIN_PASSWORD = 'vasudev2026'; // Change this!

function initAdmin() {
  const loginSection = document.getElementById('admin-login');
  const panelSection = document.getElementById('admin-panel-content');
  if (!loginSection) return;

  const saved = sessionStorage.getItem('vv_admin');
  if (saved === 'ok') showAdminPanel();

  document.getElementById('admin-login-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const pw = document.getElementById('admin-password').value;
    const errEl = document.getElementById('admin-error');
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem('vv_admin', 'ok');
      showAdminPanel();
    } else {
      errEl.textContent = '❌ गलत पासवर्ड। Please try again.';
      errEl.classList.add('show');
      setTimeout(() => errEl.classList.remove('show'), 3000);
    }
  });
}

function showAdminPanel() {
  document.getElementById('admin-login').style.display = 'none';
  document.getElementById('admin-panel-content').style.display = 'block';
  loadAdminSchedule();
}

function adminLogout() {
  sessionStorage.removeItem('vv_admin');
  location.reload();
}

let adminScheduleData = [];

async function loadAdminSchedule() {
  adminScheduleData = await loadSchedule();
  renderAdminList();
  updateAdminDateInput();
}

function updateAdminDateInput() {
  const dateInput = document.getElementById('entry-date');
  if (dateInput && !dateInput.value) dateInput.value = getTodayStr();
}

function renderAdminList() {
  const listEl = document.getElementById('admin-schedule-list');
  if (!listEl) return;
  const sorted = [...adminScheduleData].sort((a, b) => {
    if (a.date !== b.date) return b.date.localeCompare(a.date);
    return a.time.localeCompare(b.time);
  });
  if (sorted.length === 0) {
    listEl.innerHTML = '<p style="color:var(--text-light);text-align:center;padding:1rem;">कोई entry नहीं है। नीचे form से add करें।</p>';
    return;
  }
  listEl.innerHTML = sorted.map(ev => `
    <div class="schedule-entry-row">
      <div class="info">
        <strong>${ev.date} ${ev.time} — ${ev.title}</strong>
        <span>📍 ${ev.location} | ${ev.eventType}</span>
      </div>
      <button class="delete-btn" onclick="deleteAdminEntry('${ev.id}')">🗑️ Delete</button>
    </div>
  `).join('');
}

function deleteAdminEntry(id) {
  if (!confirm('क्या आप इस entry को delete करना चाहते हैं?')) return;
  adminScheduleData = adminScheduleData.filter(e => e.id !== id);
  saveScheduleData();
  renderAdminList();
}

function handleAddEntry(e) {
  e.preventDefault();
  const form = document.getElementById('add-entry-form');
  const entry = {
    id: Date.now().toString(),
    date: form.date.value,
    time: form.time.value,
    title: form.title.value,
    location: form.location.value,
    description: form.description.value,
    eventType: form.eventType.value,
    mapUrl: form.mapUrl.value || ''
  };
  adminScheduleData.push(entry);
  saveScheduleData();
  renderAdminList();
  form.reset();
  updateAdminDateInput();
  const savedMsg = document.getElementById('admin-saved-msg');
  if (savedMsg) { savedMsg.style.display = 'block'; setTimeout(() => savedMsg.style.display = 'none', 3000); }
}

function saveScheduleData() {
  // Save to localStorage (acts as in-browser persistence)
  // For production: replace this with a real API call (PHP, Node, etc.)
  localStorage.setItem('vv_schedule_override', JSON.stringify(adminScheduleData));
  showExportModal();
}

function showExportModal() {
  const modal = document.getElementById('export-modal');
  if (!modal) return;
  const textarea = document.getElementById('export-json');
  if (textarea) textarea.value = JSON.stringify(adminScheduleData, null, 2);
  modal.style.display = 'flex';
}
function closeExportModal() {
  const modal = document.getElementById('export-modal');
  if (modal) modal.style.display = 'none';
}
function copyExportJson() {
  const textarea = document.getElementById('export-json');
  textarea.select();
  document.execCommand('copy');
  const btn = document.getElementById('copy-json-btn');
  if (btn) { btn.textContent = '✅ Copied!'; setTimeout(() => btn.textContent = '📋 Copy JSON', 2000); }
}

// ---- Override schedule loading with localStorage if available ----
const _origLoadSchedule = loadSchedule;
window.loadScheduleWithOverride = async function() {
  const override = localStorage.getItem('vv_schedule_override');
  if (override) {
    try { return JSON.parse(override); } catch {}
  }
  return await _origLoadSchedule();
};

// ================================================================
// INIT
// ================================================================
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initForms();
  initGallery();
  // Page-specific
  if (document.getElementById('today-schedule-timeline')) initTodayWidget();
  if (document.getElementById('full-schedule-container')) initFullSchedule();
  if (document.getElementById('news-container')) initNewsPage();
  if (document.getElementById('admin-login')) initAdmin();
  // Override schedule loading with localStorage
  window.loadSchedule = window.loadScheduleWithOverride || loadSchedule;
});
