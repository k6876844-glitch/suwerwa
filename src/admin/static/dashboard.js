'use strict';

const API = '/admin/api';

/* ══════════════════════════════════════════════════════════════
   SERVER STATUS BANNER
   ══════════════════════════════════════════════════════════════ */
function showBanner(online) {
  let banner = document.getElementById('serverBanner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'serverBanner';
    banner.style.cssText = `
      position:fixed;bottom:20px;right:20px;z-index:9999;
      padding:10px 18px;border-radius:8px;font-size:0.78rem;font-weight:600;
      display:flex;align-items:center;gap:8px;box-shadow:0 4px 16px rgba(0,0,0,0.2);
      font-family:Inter,sans-serif;cursor:pointer;transition:opacity 0.3s;
    `;
    banner.onclick = () => banner.style.opacity = '0';
    document.body.appendChild(banner);
  }
  if (online) {
    banner.style.cssText += 'background:#1a6b3c;color:#fff;';
    banner.innerHTML = '<i class="fas fa-circle" style="font-size:.5rem"></i> Live data loaded from server';
    setTimeout(() => { banner.style.opacity = '0'; }, 4000);
  } else {
    banner.style.cssText += 'background:#c0392b;color:#fff;';
    banner.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Server offline — showing demo data. Run: <code style="background:rgba(0,0,0,.3);padding:2px 6px;border-radius:4px;">npm run dev</code>';
  }
}

/* ══════════════════════════════════════════════════════════════
   API HELPERS
   ══════════════════════════════════════════════════════════════ */
async function apiFetch(path, opts = {}) {
  const res = await fetch(API + path, {
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  if (res.status === 401) {
    window.location.href = '/admin/login?redirect=' + encodeURIComponent(location.pathname);
    return new Promise(() => {}); // navigation is in flight; never resolve
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/* ══════════════════════════════════════════════════════════════
   SIDEBAR TOGGLE
   ══════════════════════════════════════════════════════════════ */
const sidebar        = document.getElementById('sidebar');
const mainWrapper    = document.getElementById('mainWrapper');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const menuToggle     = document.getElementById('menuToggle');
const sidebarClose   = document.getElementById('sidebarClose');

let sidebarCollapsed = false;

menuToggle.addEventListener('click', () => {
  if (window.innerWidth <= 768) {
    sidebar.classList.toggle('open');
    sidebarOverlay.classList.toggle('open');
  } else {
    sidebarCollapsed = !sidebarCollapsed;
    sidebar.style.width      = sidebarCollapsed ? '0'   : '';
    sidebar.style.overflow   = sidebarCollapsed ? 'hidden' : '';
    mainWrapper.style.marginLeft = sidebarCollapsed ? '0' : '';
  }
});
sidebarClose.addEventListener('click', () => {
  sidebar.classList.remove('open');
  sidebarOverlay.classList.remove('open');
});
sidebarOverlay.addEventListener('click', () => {
  sidebar.classList.remove('open');
  sidebarOverlay.classList.remove('open');
});

/* ══════════════════════════════════════════════════════════════
   SECTION SWITCHING
   ══════════════════════════════════════════════════════════════ */
const navItems   = document.querySelectorAll('.nav-item[data-section]');
const sectionMap = {
  overview:  document.getElementById('sectionOverview'),
  analytics: document.getElementById('sectionAnalytics'),
};
const breadcrumb = document.getElementById('breadcrumbSection');
const labels     = { overview: 'Dashboard', analytics: 'Analytics' };

navItems.forEach(item => {
  item.addEventListener('click', () => {
    const sec = item.dataset.section;
    navItems.forEach(n => n.classList.remove('active'));
    item.classList.add('active');
    Object.values(sectionMap).forEach(el => el.classList.add('hidden'));
    sectionMap[sec].classList.remove('hidden');
    breadcrumb.textContent = labels[sec] || sec;
    if (window.innerWidth <= 768) {
      sidebar.classList.remove('open');
      sidebarOverlay.classList.remove('open');
    }
    if (sec === 'analytics') renderAnalyticsCharts();
  });
});

/* ══════════════════════════════════════════════════════════════
   NOTIFICATIONS
   ══════════════════════════════════════════════════════════════ */
const notifBtn   = document.getElementById('notifBtn');
const notifPanel = document.getElementById('notifPanel');
const notifClear = document.getElementById('notifClear');

notifBtn.addEventListener('click', e => {
  e.stopPropagation();
  notifPanel.classList.toggle('open');
});
notifClear.addEventListener('click', () => {
  document.querySelectorAll('.notif-item.unread').forEach(el => el.classList.remove('unread'));
  const badge = notifBtn.querySelector('.badge');
  if (badge) badge.style.display = 'none';
});
document.addEventListener('click', e => {
  if (!notifPanel.contains(e.target) && e.target !== notifBtn) {
    notifPanel.classList.remove('open');
  }
});

/* ══════════════════════════════════════════════════════════════
   GLOBAL SEARCH
   ══════════════════════════════════════════════════════════════ */
const PAGES = [
  { label:'Home',              icon:'fa-home',            url:'/index.html' },
  { label:'Our Profile',       icon:'fa-school',          url:'/profile.html' },
  { label:'History',           icon:'fa-landmark',        url:'/history.html' },
  { label:'Vision & Mission',  icon:'fa-eye',             url:'/vision.html' },
  { label:'Administration',    icon:'fa-user-tie',        url:'/administration.html' },
  { label:'Staff',             icon:'fa-users',           url:'/staff.html' },
  { label:'News & Events',     icon:'fa-newspaper',       url:'/news.html' },
  { label:'Notice Board',      icon:'fa-bullhorn',        url:'/noticeboard.html' },
  { label:'Clubs & Societies', icon:'fa-star',            url:'/clubs.html' },
  { label:'Gallery',           icon:'fa-images',          url:'/gallery.html' },
  { label:'KCSE Results',      icon:'fa-award',           url:'/kcse.html' },
  { label:'Facilities',        icon:'fa-building',        url:'/facilities.html' },
  { label:'Admissions',        icon:'fa-info-circle',     url:'/adm-overview.html' },
  { label:'Fee Structure',     icon:'fa-money-bill-wave', url:'/fee.html' },
  { label:'Apply Now',         icon:'fa-file-pen',        url:'/apply.html' },
  { label:'Contact Us',        icon:'fa-envelope',        url:'/contact.html' },
  { label:'Alumni',            icon:'fa-user-graduate',   url:'/alumni.html' },
];

const searchInput   = document.getElementById('globalSearch');
const searchResults = document.getElementById('searchResults');

searchInput.addEventListener('input', () => {
  const q = searchInput.value.trim().toLowerCase();
  if (!q) { searchResults.classList.remove('show'); return; }
  const hits = PAGES.filter(p => p.label.toLowerCase().includes(q)).slice(0, 8);
  searchResults.innerHTML = hits.length
    ? hits.map(p => `<div class="sr-item" onclick="window.open('${p.url}','_blank')"><i class="fas ${p.icon}"></i>${p.label}</div>`).join('')
    : '<div class="sr-no">No results found</div>';
  searchResults.classList.add('show');
});
document.addEventListener('click', e => {
  if (!searchInput.contains(e.target) && !searchResults.contains(e.target))
    searchResults.classList.remove('show');
});

/* ══════════════════════════════════════════════════════════════
   COUNTER ANIMATION
   ══════════════════════════════════════════════════════════════ */
function animateCounter(el, target) {
  const isText = isNaN(target);
  if (isText) { el.textContent = target; return; }
  let cur = 0;
  const step = Math.ceil(target / 40);
  const iv = setInterval(() => {
    cur = Math.min(cur + step, target);
    el.textContent = cur.toLocaleString();
    if (cur >= target) clearInterval(iv);
  }, 30);
}

/* ══════════════════════════════════════════════════════════════
   RENDER STATS
   ══════════════════════════════════════════════════════════════ */
function renderStats(stats) {
  const map = {
    'statStudents':  stats.total_students,
    'statStaff':     stats.total_staff,
    'statKcse':      stats.kcse_mean_grade,
    'statClubs':     stats.total_clubs,
    'statApps':      stats.applications,
    'statNews':      stats.news_count,
  };
  Object.entries(map).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) animateCounter(el, val);
  });
}

/* ══════════════════════════════════════════════════════════════
   RENDER NEWS
   ══════════════════════════════════════════════════════════════ */
const CAT_COLORS = {
  Sports:      'nc-sports',
  Academic:    'nc-academic',
  Culture:     'nc-culture',
  General:     'nc-admin',
  Infrastructure: 'nc-teal',
};
const DOT_COLORS = ['nd-navy','nd-gold','nd-teal','nd-navy','nd-gold','nd-teal'];

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' });
}

function renderNews(items) {
  const list = document.getElementById('newsList');
  if (!list) return;
  if (!items.length) { list.innerHTML = '<div style="padding:20px;color:#5a6070;font-size:.82rem">No news yet.</div>'; return; }
  list.innerHTML = items.slice(0, 6).map((n, i) => `
    <div class="news-item" data-id="${n.id}">
      <div class="news-dot ${DOT_COLORS[i % DOT_COLORS.length]}"></div>
      <div class="news-body">
        <div class="news-title">${escHtml(n.title)}</div>
        <div class="news-meta">
          <i class="fas fa-calendar-alt"></i> ${formatDate(n.created_at)}
          &nbsp;·&nbsp; <span class="news-cat ${CAT_COLORS[n.category] || 'nc-admin'}">${escHtml(n.category)}</span>
          &nbsp;·&nbsp; <span style="color:#5a6070">${escHtml(n.author)}</span>
          <button class="del-btn" onclick="deleteNews(${n.id})" title="Delete"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    </div>`).join('');
}

/* ══════════════════════════════════════════════════════════════
   RENDER NOTICES
   ══════════════════════════════════════════════════════════════ */
function renderNotices(items) {
  const list = document.getElementById('noticeList');
  if (!list) return;
  if (!items.length) { list.innerHTML = '<div style="padding:20px;color:#5a6070;font-size:.82rem">No notices.</div>'; return; }
  list.innerHTML = items.slice(0, 5).map(n => `
    <div class="notice-item ${n.is_urgent ? 'ni-urgent' : 'ni-info'}" data-id="${n.id}">
      <div class="ni-badge">${n.is_urgent ? 'Urgent' : (n.category || 'Info')}</div>
      <div class="ni-text">${escHtml(n.title)} — ${escHtml(n.content.slice(0, 90))}${n.content.length > 90 ? '…' : ''}</div>
      <div class="ni-date" style="display:flex;justify-content:space-between;align-items:center">
        <span>${formatDate(n.created_at)}</span>
        <button class="del-btn" onclick="deleteNotice(${n.id})" title="Delete"><i class="fas fa-trash"></i></button>
      </div>
    </div>`).join('');
}

/* ══════════════════════════════════════════════════════════════
   RENDER EVENTS
   ══════════════════════════════════════════════════════════════ */
const EVENT_TYPE_CLASS = { School:'et-school', Exam:'et-exam', Event:'et-event' };

function renderEvents(items) {
  const list = document.getElementById('eventsList');
  if (!list) return;
  const upcoming = items.filter(e => new Date(e.event_date) >= new Date()).slice(0, 6);
  if (!upcoming.length) { list.innerHTML = '<div style="padding:20px;color:#5a6070;font-size:.82rem">No upcoming events.</div>'; return; }
  list.innerHTML = upcoming.map(e => {
    const d   = new Date(e.event_date);
    const day = d.toLocaleDateString('en-GB', { day:'2-digit' });
    const mon = d.toLocaleDateString('en-GB', { month:'short' });
    return `
    <div class="event-item" data-id="${e.id}">
      <div class="event-date"><span class="ed-day">${day}</span><span class="ed-mon">${mon}</span></div>
      <div class="event-info">
        <div class="event-title">${escHtml(e.title)}</div>
        <div class="event-sub"><i class="fas fa-map-marker-alt"></i> ${escHtml(e.venue || 'School Grounds')}</div>
      </div>
      <div class="event-type ${EVENT_TYPE_CLASS[e.event_type] || 'et-event'}">${escHtml(e.event_type)}</div>
      <button class="del-btn" onclick="deleteEvent(${e.id})" title="Delete" style="margin-left:8px"><i class="fas fa-trash"></i></button>
    </div>`;
  }).join('');
}

/* ══════════════════════════════════════════════════════════════
   DELETE HELPERS
   ══════════════════════════════════════════════════════════════ */
function escHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

async function deleteNews(id) {
  if (!confirm('Delete this news article?')) return;
  await apiFetch(`/news/${id}`, { method:'DELETE' });
  loadDashboard();
}
async function deleteNotice(id) {
  if (!confirm('Delete this notice?')) return;
  await apiFetch(`/notices/${id}`, { method:'DELETE' });
  loadDashboard();
}
async function deleteEvent(id) {
  if (!confirm('Delete this event?')) return;
  await apiFetch(`/events/${id}`, { method:'DELETE' });
  loadDashboard();
}
window.deleteNews    = deleteNews;
window.deleteNotice  = deleteNotice;
window.deleteEvent   = deleteEvent;

/* ══════════════════════════════════════════════════════════════
   CHART.JS SETUP
   ══════════════════════════════════════════════════════════════ */
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.font.size   = 11;
Chart.defaults.color       = '#5a6070';

let overviewChartsDrawn = false;
let analyticsChartsDrawn = false;
let analyticsData = null;

function drawOverviewCharts(kcseHistory, enrollmentTrend) {
  if (overviewChartsDrawn) return;
  overviewChartsDrawn = true;

  const years5  = kcseHistory.slice(-5);
  const kcseCtx = document.getElementById('kcseChart');
  if (kcseCtx) {
    new Chart(kcseCtx, {
      type: 'line',
      data: {
        labels: years5.map(r => String(r.year)),
        datasets: [{
          label: 'Mean Score',
          data: years5.map(r => r.mean_score),
          borderColor: '#0a1f44',
          backgroundColor: 'rgba(10,31,68,0.07)',
          fill: true, tension: 0.4,
          pointBackgroundColor: '#b8860b',
          pointRadius: 5, pointHoverRadius: 7, borderWidth: 2.5,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: true,
        plugins: { legend: { display: false } },
        scales: {
          y: { min: 40, max: 84, grid: { color: 'rgba(0,0,0,0.05)' } },
          x: { grid: { display: false } },
        },
      },
    });
  }

  // KCSE select toggle
  document.getElementById('kcseSelect')?.addEventListener('change', function () {
    const chart = Chart.getChart('kcseChart');
    if (!chart) return;
    const slice = this.value === '10' ? kcseHistory : kcseHistory.slice(-5);
    chart.data.labels = slice.map(r => String(r.year));
    chart.data.datasets[0].data = slice.map(r => r.mean_score);
    chart.update();
  });

  const enrollCtx = document.getElementById('enrollChart');
  if (enrollCtx && enrollmentTrend.length) {
    new Chart(enrollCtx, {
      type: 'bar',
      data: {
        labels: enrollmentTrend.map(r => String(r.year)),
        datasets: [{
          label: 'Students',
          data: enrollmentTrend.map(r => r.students),
          backgroundColor: ['rgba(10,31,68,0.8)','rgba(184,134,11,0.8)','rgba(0,105,92,0.8)','rgba(94,53,177,0.8)','rgba(192,57,43,0.8)'],
          borderRadius: 6, borderSkipped: false,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: true,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: false, grid: { color: 'rgba(0,0,0,0.05)' } },
          x: { grid: { display: false } },
        },
      },
    });
  }
}

function renderAnalyticsCharts() {
  if (analyticsChartsDrawn || !analyticsData) return;
  analyticsChartsDrawn = true;
  const { kcseHistory, enrollmentTrend, staffByDept } = analyticsData;

  // Big KCSE chart
  const bigCtx = document.getElementById('kcseChartBig');
  if (bigCtx) {
    new Chart(bigCtx, {
      type: 'line',
      data: {
        labels: kcseHistory.map(r => String(r.year)),
        datasets: [
          {
            label: 'SFG Mean Score', data: kcseHistory.map(r => r.mean_score),
            borderColor: '#0a1f44', backgroundColor: 'rgba(10,31,68,0.07)',
            fill: true, tension: 0.4, pointBackgroundColor: '#b8860b', pointRadius: 4, borderWidth: 2.5,
          },
          {
            label: 'National Average',
            data: kcseHistory.map((_, i) => 50 + i * 0.5),
            borderColor: '#c0392b', backgroundColor: 'transparent',
            fill: false, tension: 0.4, borderDash: [6, 3], pointRadius: 3, borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'top' } },
        scales: {
          y: { min: 35, max: 84, grid: { color: 'rgba(0,0,0,0.05)' } },
          x: { grid: { display: false } },
        },
      },
    });
  }

  // Grade distribution (latest year)
  const latest = kcseHistory[kcseHistory.length - 1];
  const subCtx = document.getElementById('subjectChart');
  if (subCtx && latest) {
    new Chart(subCtx, {
      type: 'doughnut',
      data: {
        labels: ['A plain', 'A minus', 'B plus', 'B plain', 'B minus', 'Below B'],
        datasets: [{
          data: [latest.a_plain, latest.a_minus, latest.b_plus, latest.b_plain, latest.b_minus, latest.below_b],
          backgroundColor: ['#0a1f44','#b8860b','#00695c','#1565C0','#5e35b1','#c0392b'],
          borderWidth: 0, hoverOffset: 8,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: true,
        plugins: {
          legend: { position: 'right', labels: { boxWidth: 12, padding: 12 } },
          title: { display: true, text: `${latest.year} KCSE Grade Distribution (${latest.candidates} candidates)`, font: { size: 12 } },
        },
        cutout: '60%',
      },
    });
  }

  // Enrollment trend
  const etCtx = document.getElementById('enrollTrendChart');
  if (etCtx) {
    new Chart(etCtx, {
      type: 'bar',
      data: {
        labels: enrollmentTrend.map(r => String(r.year)),
        datasets: [{
          label: 'Total Students',
          data: enrollmentTrend.map(r => r.students),
          backgroundColor: 'rgba(10,31,68,0.75)',
          borderRadius: 6, borderSkipped: false,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: true,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: false, grid: { color: 'rgba(0,0,0,0.05)' } },
          x: { grid: { display: false } },
        },
      },
    });
  }

  // Candidates per year line
  const fdCtx = document.getElementById('formDistChart');
  if (fdCtx) {
    new Chart(fdCtx, {
      type: 'line',
      data: {
        labels: kcseHistory.map(r => String(r.year)),
        datasets: [{
          label: 'KCSE Candidates',
          data: kcseHistory.map(r => r.candidates),
          borderColor: '#b8860b', backgroundColor: 'rgba(184,134,11,0.08)',
          fill: true, tension: 0.4, pointBackgroundColor: '#0a1f44',
          pointRadius: 4, borderWidth: 2,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: true,
        plugins: { legend: { display: false }, title: { display: true, text: 'KCSE Candidates Per Year' } },
        scales: {
          y: { beginAtZero: false, grid: { color: 'rgba(0,0,0,0.05)' } },
          x: { grid: { display: false } },
        },
      },
    });
  }

  // Staff by department
  const clubCtx = document.getElementById('clubChart');
  if (clubCtx && staffByDept.length) {
    new Chart(clubCtx, {
      type: 'bar',
      data: {
        labels: staffByDept.map(d => d.department),
        datasets: [{
          label: 'Staff Count',
          data: staffByDept.map(d => d.count),
          backgroundColor: 'rgba(184,134,11,0.75)',
          borderRadius: 4, borderSkipped: false,
        }],
      },
      options: {
        indexAxis: 'y',
        responsive: true, maintainAspectRatio: true,
        plugins: { legend: { display: false }, title: { display: true, text: 'Staff by Department' } },
        scales: {
          x: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
          y: { grid: { display: false } },
        },
      },
    });
  }
}

/* ══════════════════════════════════════════════════════════════
   LOAD DASHBOARD DATA
   ══════════════════════════════════════════════════════════════ */
async function loadDashboard() {
  try {
    const [statsRes, newsRes, noticesRes, eventsRes, analyticsRes] = await Promise.all([
      apiFetch('/stats'),
      apiFetch('/news'),
      apiFetch('/notices'),
      apiFetch('/events'),
      apiFetch('/analytics'),
    ]);

    showBanner(true);

    renderStats(statsRes.stats);
    renderNews(newsRes.news);
    renderNotices(noticesRes.notices);
    renderEvents(eventsRes.events);

    analyticsData = analyticsRes.analytics;
    drawOverviewCharts(analyticsRes.analytics.kcseHistory, analyticsRes.analytics.enrollmentTrend);

    // Update notification panel with live notices
    const urgentNotices = noticesRes.notices.filter(n => n.is_urgent).slice(0, 3);
    if (urgentNotices.length) {
      const panel = document.querySelector('.notif-panel');
      const header = panel.querySelector('.notif-header');
      panel.innerHTML = '';
      panel.appendChild(header);
      urgentNotices.forEach(n => {
        const div = document.createElement('div');
        div.className = 'notif-item unread';
        div.innerHTML = `<i class="fas fa-exclamation-circle"></i><div><strong>${escHtml(n.title)}</strong><br>${escHtml(n.content.slice(0,60))}…<br><small>${formatDate(n.created_at)}</small></div>`;
        panel.appendChild(div);
      });
      const badge = document.querySelector('.notif-btn .badge');
      if (badge) badge.textContent = urgentNotices.length;
    }

  } catch (err) {
    console.warn('Server offline:', err.message);
    showBanner(false);
    loadFallbackData();
  }
}

/* ══════════════════════════════════════════════════════════════
   FALLBACK DEMO DATA (when server is offline)
   ══════════════════════════════════════════════════════════════ */
function loadFallbackData() {
  renderStats({ total_students:1240, total_staff:72, kcse_mean_grade:'A−', total_clubs:18, applications:34, news_count:9 });

  renderNews([
    { id:1, title:'Inter-School Athletics — Form 3 Team Wins Gold', category:'Sports', author:'Sports Dept', created_at:'2025-05-28' },
    { id:2, title:'2025 KCSE Mock Examination Schedule Released',    category:'Academic', author:'Registrar',  created_at:'2025-05-20' },
    { id:3, title:'Science Congress — SFG Wins Regional Best Project', category:'Academic', author:'Science Dept', created_at:'2025-05-12' },
    { id:4, title:'Annual Music Festival — Choir Advances to Nationals', category:'Culture', author:'Music Dept', created_at:'2025-04-30' },
    { id:5, title:'New Computer Laboratory Officially Opened', category:'Infrastructure', author:'Principal', created_at:'2025-04-15' },
  ]);

  renderNotices([
    { id:1, title:'Term 3 Fee Deadline', content:'Fee payment deadline is July 1, 2025. Late payments attract 5% penalty.', category:'Finance', is_urgent:1, created_at:'2025-06-01' },
    { id:2, title:'Form 1 Registration 2026', content:'Opens August 15, 2025. Online portal available.', category:'Admissions', is_urgent:0, created_at:'2025-05-30' },
    { id:3, title:'Boarding Students Reporting', content:'All boarding students to report for Term 3 by July 7, 2025.', category:'Info', is_urgent:0, created_at:'2025-05-28' },
  ]);

  renderEvents([
    { id:1, title:'Term 3 Reopening',                event_date:'2025-07-07', venue:'Main School Gate', event_type:'School' },
    { id:2, title:'KCSE Mock Examination Begins',    event_date:'2025-07-15', venue:'Exam Halls',       event_type:'Exam' },
    { id:3, title:'Inter-School Debate Competition', event_date:'2025-08-22', venue:'Main Hall',        event_type:'Event' },
    { id:4, title:'Open Day — Parents & Guardians',  event_date:'2025-09-14', venue:'School Grounds',   event_type:'Event' },
    { id:5, title:'Prize Giving Day & Graduation',   event_date:'2025-11-22', venue:'School Grounds',   event_type:'School' },
  ]);

  const fallbackKcse = [
    {year:2020,mean_score:56},{year:2021,mean_score:59},{year:2022,mean_score:61},{year:2023,mean_score:64},{year:2024,mean_score:68},
  ];
  const fallbackEnroll = [
    {year:2021,students:1050},{year:2022,students:1120},{year:2023,students:1190},{year:2024,students:1240},
  ];
  analyticsData = {
    kcseHistory: fallbackKcse,
    enrollmentTrend: fallbackEnroll,
    staffByDept: [{department:'Sciences',count:14},{department:'Languages',count:12},{department:'Mathematics',count:10},{department:'Humanities',count:10},{department:'Administration',count:8}],
  };
  drawOverviewCharts(fallbackKcse, fallbackEnroll);
}

/* ══════════════════════════════════════════════════════════════
   MODAL HELPER
   ══════════════════════════════════════════════════════════════ */
function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
window.openModal  = openModal;
window.closeModal = closeModal;

document.querySelectorAll('.modal-overlay').forEach(m => {
  m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
});

/* ══════════════════════════════════════════════════════════════
   ADD NEWS FORM
   ══════════════════════════════════════════════════════════════ */
document.getElementById('newsForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  const btn  = e.target.querySelector('button[type=submit]');
  const body = {
    title:       document.getElementById('nTitle').value.trim(),
    content:     document.getElementById('nContent').value.trim(),
    category:    document.getElementById('nCategory').value,
    author:      document.getElementById('nAuthor').value.trim() || 'Administration',
    image_emoji: document.getElementById('nEmoji').value.trim() || '📰',
  };
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving…';
  try {
    await apiFetch('/news', { method:'POST', body: JSON.stringify(body) });
    closeModal('modalNews');
    e.target.reset();
    await loadDashboard();
  } catch {
    alert('Server is offline. Start the server to save data.');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Publish News';
  }
});

/* ══════════════════════════════════════════════════════════════
   ADD NOTICE FORM
   ══════════════════════════════════════════════════════════════ */
document.getElementById('noticeForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  const btn  = e.target.querySelector('button[type=submit]');
  const body = {
    title:      document.getElementById('ntTitle').value.trim(),
    content:    document.getElementById('ntContent').value.trim(),
    category:   document.getElementById('ntCategory').value,
    is_urgent:  document.getElementById('ntUrgent').checked,
    posted_by:  document.getElementById('ntPostedBy').value.trim() || 'Administration',
    expires_at: document.getElementById('ntExpires').value || null,
  };
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving…';
  try {
    await apiFetch('/notices', { method:'POST', body: JSON.stringify(body) });
    closeModal('modalNotice');
    e.target.reset();
    await loadDashboard();
  } catch {
    alert('Server is offline. Start the server to save data.');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Post Notice';
  }
});

/* ══════════════════════════════════════════════════════════════
   ADD EVENT FORM
   ══════════════════════════════════════════════════════════════ */
document.getElementById('eventForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  const btn  = e.target.querySelector('button[type=submit]');
  const body = {
    title:       document.getElementById('evTitle').value.trim(),
    description: document.getElementById('evDesc').value.trim(),
    event_date:  document.getElementById('evDate').value,
    venue:       document.getElementById('evVenue').value.trim() || 'School Grounds',
    event_type:  document.getElementById('evType').value,
  };
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving…';
  try {
    await apiFetch('/events', { method:'POST', body: JSON.stringify(body) });
    closeModal('modalEvent');
    e.target.reset();
    await loadDashboard();
  } catch {
    alert('Server is offline. Start the server to save data.');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Add Event';
  }
});

/* ══════════════════════════════════════════════════════════════
   INIT
   ══════════════════════════════════════════════════════════════ */
loadDashboard();
