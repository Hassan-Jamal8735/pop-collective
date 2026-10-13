/* Shared helpers, icons and components. */

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const money = (n) => '$' + Number(n || 0).toLocaleString('en-CA');
const parseDate = (d) => new Date(d + 'T12:00:00');
const fmtDate = (d, opts = { month: 'short', day: 'numeric', year: 'numeric' }) => parseDate(d).toLocaleDateString('en-CA', opts);
const fmtLong = (d) => parseDate(d).toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
const fmtTime = (t) => { const [h, m] = t.split(':').map(Number); return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`; };
const fmtStamp = (iso) => new Date(iso).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' }) + ' · ' + new Date(iso).toLocaleTimeString('en-CA', { hour: 'numeric', minute: '2-digit' });
const filmStamp = (d) => { const x = parseDate(d); return `'${String(x.getFullYear()).slice(2)} ${x.getMonth() + 1} ${x.getDate()}`; };

const P = (d) => `<path d="${d}"/>`;
const ICONS = {
  heart: P('M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z'),
  bookmark: P('m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z'),
  pin: P('M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z') + '<circle cx="12" cy="10" r="3"/>',
  cal: '<rect x="3" y="4" width="18" height="18" rx="2"/>' + P('M16 2v4M8 2v4M3 10h18'),
  metro: '<rect x="4" y="3" width="16" height="16" rx="2"/>' + P('M8 15V8l4 4 4-4v7M8 22l2-3M16 22l-2-3'),
  parking: '<rect x="3" y="3" width="18" height="18" rx="2"/>' + P('M9 17V7h4a3 3 0 0 1 0 6H9'),
  access: '<circle cx="16" cy="4" r="1"/>' + P('m18 19 1-7-6 1M5 8l3-3 5.5 3-2.4 3.5M4.2 14.5a5 5 0 0 0 6.9 5.3M13.8 17.5a5 5 0 0 0-6.6-6.4'),
  paw: '<circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="20" cy="16" r="2"/>' + P('M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.8 1.1 2 2 0 0 0-1.3-1.3A3.5 3.5 0 0 1 7 11.5 3 3 0 0 1 9 10Z'),
  ticket: P('M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2ZM13 5v2M13 17v2M13 11v2'),
  search: '<circle cx="11" cy="11" r="8"/>' + P('m21 21-4.3-4.3'),
  map: P('M14.1 6 9.9 3.9a2 2 0 0 0-1.8 0L3.6 6.1A1 1 0 0 0 3 7v12.8a1 1 0 0 0 1.4.9l3.7-1.8a2 2 0 0 1 1.8 0l4.2 2.1a2 2 0 0 0 1.8 0l4.5-2.2a1 1 0 0 0 .6-.9V5.2a1 1 0 0 0-1.4-.9l-3.7 1.8a2 2 0 0 1-1.8 0ZM15 6v15M9 3v15'),
  list: P('M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01'),
  home: P('M3 10 12 3l9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2ZM9 22V12h6v10'),
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  users: P('M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8') + '<circle cx="9" cy="7" r="4"/>',
  msg: P('M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'),
  chart: P('M3 3v18h18M7 16l4-4 4 4 5-6'),
  card: '<rect x="2" y="5" width="20" height="14" rx="2"/>' + P('M2 10h20'),
  gear: '<circle cx="12" cy="12" r="3"/>' + P('M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z'),
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/>' + P('M7 11V7a5 5 0 0 1 10 0v4'),
  file: P('M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7ZM14 2v4a2 2 0 0 0 2 2h4'),
  check: P('M20 6 9 17l-5-5'),
  x: P('M18 6 6 18M6 6l12 12'),
  clock: '<circle cx="12" cy="12" r="10"/>' + P('M12 6v6l4 2'),
  plus: P('M12 5v14M5 12h14'),
  minus: P('M5 12h14'),
  arrow: P('M5 12h14M12 5l7 7-7 7'),
  back: P('M19 12H5M12 19l-7-7 7-7'),
  upload: P('M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12'),
  download: P('M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3'),
  user: '<circle cx="12" cy="8" r="5"/>' + P('M20 21a8 8 0 0 0-16 0'),
  bell: P('M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.9 1.9 0 0 0 3.4 0'),
  megaphone: P('m3 11 18-5v12L3 14v-3zM11.6 16.8a3 3 0 1 1-5.8-1.6'),
  send: P('m22 2-7 20-4-9-9-4ZM22 2 11 13'),
  share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>' + P('m8.6 13.5 6.8 4M15.4 6.5l-6.8 4'),
  play: P('m6 3 14 9-14 9V3z'),
  phone: '<rect x="5" y="2" width="14" height="20" rx="2"/>' + P('M12 18h.01'),
  refresh: P('M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5'),
  store: P('m2 7 4.4-4.4A2 2 0 0 1 7.8 2h8.4a2 2 0 0 1 1.4.6L22 7M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M2 7h20v3a2 2 0 0 1-2 2 2.7 2.7 0 0 1-2-1 2.7 2.7 0 0 1-2 1 2.7 2.7 0 0 1-2-1 2.7 2.7 0 0 1-2 1 2.7 2.7 0 0 1-2-1 2.7 2.7 0 0 1-2 1 2 2 0 0 1-2-2Z'),
  edit: P('M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z'),
  sparkle: P('M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2 2M16 16l2 2M6 18l2-2M16 8l2-2'),
};
const ic = (name, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ''}</svg>`;

const wordmark = (variant = 'inline', cls = '') => variant === 'stacked'
  ? `<span class="wm wm-stacked ${cls}"><span>POP//</span><span>COLLECTIVE</span></span>`
  : `<span class="wm ${cls}">POP<i>/</i>COLLECTIVE</span>`;

const STATUS_LABEL = { pending: 'Pending', accepted: 'Accepted', waitlisted: 'Waitlisted', rejected: 'Rejected', published: 'Published', draft: 'Draft', withdrawn: 'Withdrawn' };
const pill = (status) => `<span class="pill pill-${status}">${STATUS_LABEL[status] || status}</span>`;
const tags = (cats, n = 3) => `<div class="tags">${cats.slice(0, n).map((c) => `<span class="tag">${esc(c)}</span>`).join('')}</div>`;
const film = (id, w, cls = '', alt = '') => `<div class="film ${cls}"><img src="${IMG(id, w)}" alt="${esc(alt)}" loading="lazy" /></div>`;

function eventCard(e, role = 'consumer') {
  const href = role === 'vendor' ? `#/v/event/${e.id}` : `#/event/${e.id}`;
  const saved = role === 'vendor' ? Store.s.savedVendor.includes(e.id) : Store.s.savedConsumer.includes(e.id);
  const my = role === 'vendor' ? Store.myAppFor(e.id) : null;
  return `<article class="ecard">
    <a href="${href}" class="ecard-img">${film(e.img, 600, '', e.title)}<span class="stamp">${filmStamp(e.date)}</span></a>
    <button class="save-btn ${saved ? 'on' : ''}" data-act="toggle-save" data-id="${e.id}" data-role="${role}" aria-label="Save">${ic(role === 'vendor' ? 'bookmark' : 'heart')}</button>
    <a href="${href}" class="ecard-body">
      <div class="ecard-top"><h3>${esc(e.title)}</h3>${my ? pill(my.status) : ''}</div>
      <p class="muted">${fmtDate(e.date, { weekday: 'short', month: 'short', day: 'numeric' })} · ${esc(e.neighbourhood)}</p>
      ${role === 'vendor' ? `<p class="muted small">${money(Math.min(...e.booths.map((b) => b.price)))} – ${money(Math.max(...e.booths.map((b) => b.price)))} booths · apply by ${fmtDate(e.deadline, { month: 'short', day: 'numeric' })}</p>` : ''}
      ${tags(e.categories)}
    </a>
  </article>`;
}

function toast(html, kind = '') {
  const el = document.createElement('div');
  el.className = 'toast ' + kind;
  el.innerHTML = html;
  document.getElementById('toasts').appendChild(el);
  requestAnimationFrame(() => el.classList.add('in'));
  setTimeout(() => { el.classList.remove('in'); setTimeout(() => el.remove(), 300); }, 4200);
}

function modal(html, cls = '') {
  const root = document.getElementById('modal-root');
  root.innerHTML = `<div class="modal-back" data-act="close-modal"><div class="modal ${cls}" onclick="event.stopPropagation()">
    <button class="modal-x" data-act="close-modal" aria-label="Close">${ic('x')}</button>${html}</div></div>`;
}
const closeModal = () => { document.getElementById('modal-root').innerHTML = ''; };

/* ---------- Leaflet map helper ---------- */
const Maps = { instances: [] };
function destroyMaps() { Maps.instances.forEach((m) => m.remove()); Maps.instances = []; }
function pinIcon(active = false, label = '') {
  return L.divIcon({ className: 'pc-pin-wrap', html: `<div class="pc-pin ${active ? 'active' : ''}">${label}</div>`, iconSize: [30, 38], iconAnchor: [15, 38], popupAnchor: [0, -34] });
}
function makeMap(el, center = [45.515, -73.585], zoom = 12, opts = {}) {
  const m = L.map(el, { zoomControl: true, scrollWheelZoom: opts.scroll ?? false, attributionControl: true }).setView(center, zoom);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors', maxZoom: 19,
  }).addTo(m);
  Maps.instances.push(m);
  return m;
}

/* ---------- Layouts ---------- */
function publicHeader(active = '') {
  const u = Store.s.consumerUser;
  const link = (href, label, key) => `<a href="${href}" class="${active === key ? 'on' : ''}">${label}</a>`;
  return `<header class="pub-head">
    <a href="#/" class="logo-link">${wordmark()}</a>
    <nav class="pub-nav">
      ${link('#/discover', 'Discover', 'discover')}
      ${link('#/for-vendors', 'For Vendors', 'vendors')}
      ${link('#/for-organizers', 'For Organizers', 'organizers')}
      ${link('#/brand', 'Brand', 'brand')}
    </nav>
    <div class="pub-actions">
      <a href="#/saved" class="icon-btn" title="Saved events">${ic('heart')}<span class="count">${Store.s.savedConsumer.length}</span></a>
      ${u ? `<button class="chip-user" data-act="logout">${ic('user')} ${esc(u.name)}</button>` : `<button class="btn btn-ghost sm" data-act="login">Log in</button>`}
    </div>
  </header>`;
}

function publicFooter() {
  return `<footer class="pub-foot">
    <div class="foot-mark">${wordmark('inline', 'xl')}</div>
    <div class="foot-cols">
      <div><h4>Discover</h4><a href="#/discover">All events</a><a href="#/discover?view=map">Map</a><a href="#/saved">Saved</a></div>
      <div><h4>Join</h4><a href="#/for-vendors">For vendors</a><a href="#/for-organizers">For organizers</a><a href="#/membership">Membership</a></div>
      <div><h4>Montréal first</h4><p class="muted">Small brands, big communities. Made with love in Tiohtià:ke / Montréal.</p></div>
    </div>
    <p class="tiny muted">Prototype · fictional data · © 2026 POP/COLLECTIVE</p>
  </footer>`;
}

function dashLayout(role, active, content) {
  const vendorNav = [
    ['#/v', 'home', 'Overview', 'home'],
    ['#/v/discover', 'search', 'Discover Events', 'discover'],
    ['#/v/applications', 'file', 'My Applications', 'applications'],
    ['#/v/groups', 'msg', 'Event Groups', 'groups'],
    ['#/v/saved', 'bookmark', 'Saved', 'saved'],
    ['#/v/profile', 'store', 'Brand Profile', 'profile'],
    ['#/membership?tab=vendor', 'card', 'Membership', 'billing'],
  ];
  const orgNav = [
    ['#/o', 'home', 'Overview', 'home'],
    ['#/o/events', 'cal', 'My Events', 'events'],
    ['#/o/applications/mile-end', 'users', 'Applications', 'applications'],
    ['#/o/group/mile-end', 'msg', 'Event Groups', 'groups'],
    ['#/membership?tab=organizer', 'card', 'Membership', 'billing'],
  ];
  const nav = role === 'vendor' ? vendorNav : orgNav;
  const pend = role === 'organizer' ? Store.s.applications.filter((a) => a.status === 'pending' && Store.event(a.eventId).organizerId === ME_ORG).length : 0;
  const unread = role === 'vendor' ? Store.s.notifications.filter((n) => n.to === 'vendor' && !n.read).length : 0;
  const who = role === 'vendor'
    ? { name: 'Atelier Nord', sub: 'Vendor · Pro plan', img: VENDORS[ME_VENDOR].photo }
    : { name: 'Camille Tremblay', sub: 'Montreal Makers Collective', img: PHOTOS.camille };
  return `<div class="dash">
    <aside class="side">
      <a href="#/" class="side-logo">${wordmark('stacked')}</a>
      <nav>${nav.map(([h, i, l, k]) => `<a href="${h}" class="${active === k ? 'on' : ''}">${ic(i)}<span>${l}</span>${k === 'applications' && pend ? `<b class="badge">${pend}</b>` : ''}${k === 'home' && unread ? `<b class="badge">${unread}</b>` : ''}</a>`).join('')}</nav>
      <div class="side-who"><img src="${IMG(who.img, 120)}" alt="" /><div><strong>${who.name}</strong><span>${who.sub}</span></div></div>
    </aside>
    <main class="dash-main">${content}</main>
  </div>`;
}

function emptyState(icon, title, text, cta = '') {
  return `<div class="empty">${ic(icon)}<h3>${title}</h3><p class="muted">${text}</p>${cta}</div>`;
}
