/* Router, demo bar and interaction handlers. */

const ROUTES = [
  [/^\/?$/, Views.home],
  [/^\/discover$/, Views.discover],
  [/^\/event\/([\w-]+)$/, Views.event],
  [/^\/maker\/([\w-]+)$/, Views.maker],
  [/^\/saved$/, Views.saved],
  [/^\/for-vendors$/, Views.forVendors],
  [/^\/for-organizers$/, Views.forOrganizers],
  [/^\/membership$/, Views.membership],
  [/^\/brand$/, Views.brand],
  [/^\/v$/, Views.vHome],
  [/^\/v\/discover$/, Views.vDiscover],
  [/^\/v\/event\/([\w-]+)$/, Views.vEvent],
  [/^\/v\/apply\/([\w-]+)$/, Views.vApply],
  [/^\/v\/applied\/([\w-]+)$/, Views.vApplied],
  [/^\/v\/applications$/, Views.vApplications],
  [/^\/v\/application\/([\w-]+)$/, Views.vApplication],
  [/^\/v\/groups$/, Views.vGroups],
  [/^\/v\/group\/([\w-]+)$/, Views.vGroup],
  [/^\/v\/saved$/, Views.vSaved],
  [/^\/v\/profile$/, Views.vProfile],
  [/^\/o$/, Views.oHome],
  [/^\/o\/events$/, Views.oEvents],
  [/^\/o\/event\/(new)$/, Views.oWizard],
  [/^\/o\/event\/([\w-]+)\/edit$/, Views.oWizard],
  [/^\/o\/applications\/([\w-]+)$/, Views.oApplications],
  [/^\/o\/group\/([\w-]+)$/, Views.oGroup],
];

const EMBED = new URLSearchParams(location.search).has('embed');
let lastPath = null;
let scenarioOpen = false;
let pendingSave = null;

function parseHash() {
  const raw = location.hash.replace(/^#/, '') || '/';
  const [path, qs] = raw.split('?');
  return { path, params: new URLSearchParams(qs || '') };
}
const roleOf = (path) => (path.startsWith('/v') ? 'vendor' : path.startsWith('/o') ? 'organizer' : 'consumer');
const go = (hash) => { location.hash = hash; };

function render() {
  const { path, params } = parseHash();
  let view = Views.home, arg;
  for (const [re, fn] of ROUTES) { const m = path.match(re); if (m) { view = fn; arg = m[1]; break; } }
  destroyMaps();
  const y = window.scrollY;
  document.getElementById('app').innerHTML = view(params, arg);
  document.body.dataset.role = roleOf(path);
  if (path !== lastPath) window.scrollTo(0, 0); else window.scrollTo(0, y);
  lastPath = path;
  if (view.mount) view.mount(params, arg);
  const feed = document.getElementById('feed');
  if (feed) feed.scrollTop = feed.scrollHeight;
  renderDemoBar();
}

/* ---------------- Demo bar + guided scenario ---------------- */
function renderDemoBar() {
  if (EMBED) return;
  const role = roleOf(parseHash().path);
  const nord = Store.myAppFor('mile-end');
  const st = Store.eventStats('mile-end');
  const r = (k, href, label, sub) => `<a href="${href}" class="${role === k ? 'on' : ''}">${label}<small>${sub}</small></a>`;
  const done = nord && nord.status === 'accepted';
  document.getElementById('demobar').innerHTML = `<div class="demobar">
    <span class="db-tag">Prototype</span>
    <div class="db-roles"><span class="db-label">View as</span>
      ${r('consumer', '#/', 'Consumer', 'public site')}${r('vendor', '#/v', 'Vendor', 'Atelier Nord')}${r('organizer', '#/o', 'Organizer', 'Camille')}
    </div>
    <div class="db-tools">
      <button data-act="scenario" class="${scenarioOpen ? 'on' : ''}">${ic('play')}<span>Scenario</span></button>
      <button data-act="palette" data-p="${Store.s.palette === 'b' ? 'a' : 'b'}" title="Switch colour palette"><i class="dot-pal"></i><span>Palette ${Store.s.palette.toUpperCase()}</span></button>
      <button data-act="mobile" title="Mobile preview">${ic('phone')}<span>Mobile</span></button>
      <button data-act="reset" title="Reset demo data">${ic('refresh')}<span>Reset</span></button>
    </div>
  </div>
  ${scenarioOpen ? `<div class="scenario">
    <div class="sc-head"><b>Connected scenario</b><button data-act="scenario">${ic('x')}</button></div>
    <p class="small muted">Mile End Vintage Market · Le Livart · June 7, 2027</p>
    <div class="sc-live">
      <div><span>Atelier Nord</span>${pill(nord ? nord.status : 'pending')}</div>
      <div><span>Est. revenue</span><b>${money(st.revenue)}</b></div>
      <div><span>Accepted</span><b>${st.accepted}</b></div>
    </div>
    <ol>
      <li class="${role === 'vendor' ? 'here' : ''}"><a href="#/v/application/app-nord-mileend"><b>Vendor</b> — Atelier Nord's application: 6-ft table + 2 racks = $300, <em>Pending</em>; event group locked.</a></li>
      <li class="${role === 'organizer' ? 'here' : ''}"><a href="#/o/applications/mile-end?app=app-nord-mileend"><b>Organizer</b> — Camille reviews and clicks <em>Accept</em>.</a></li>
      <li class="${done ? '' : 'dim'}"><a href="#/o"><b>Organizer</b> — totals & estimated revenue update (+$300).</a></li>
      <li class="${done ? '' : 'dim'}"><a href="#/v/group/mile-end"><b>Vendor</b> — status <em>Accepted</em>; event group unlocks: announcements, messages, flyer & files.</a></li>
      <li class="${done ? '' : 'dim'}"><a href="#/event/mile-end"><b>Consumer</b> — Atelier Nord now appears on the public event page.</a></li>
    </ol>
    <p class="tiny muted">No money changes hands. Use Reset to replay.</p>
  </div>` : ''}`;
}

/* ---------------- Palette ---------------- */
function applyPalette() { document.documentElement.dataset.palette = Store.s.palette; }

/* ---------------- Click actions ---------------- */
const Actions = {
  'scenario': () => { scenarioOpen = !scenarioOpen; renderDemoBar(); },
  'palette': (el) => { Store.s.palette = el.dataset.p; applyPalette(); Store.save(); toast(`Palette ${el.dataset.p.toUpperCase()} — ${el.dataset.p === 'b' ? 'Orange & Cream' : 'Chocolate & Butter'}`); },
  'mobile': () => modal(`<div class="mob-prev"><div class="phone big"><iframe src="?embed=1${location.hash}" title="Mobile preview"></iframe></div><p class="tiny muted center">Live 390px preview — fully clickable</p></div>`, 'modal-phone'),
  'reset': () => { if (confirm('Reset all demo data to the starting scenario?')) { Store.reset(); WZ = null; AP.eventId = null; applyPalette(); toast('Demo data reset'); go('#/'); render(); } },
  'close-modal': () => closeModal(),

  'login': () => modal(`<div class="login">${wordmark('stacked')}<h2 class="h1">Save your favourite events</h2><p class="muted">Free account — discovery is always free. (Simulated login)</p>
    <form data-submit="login"><label class="field"><span>First name</span><input name="name" value="Léa" required/></label><label class="field"><span>Email</span><input name="email" value="lea@example.com" type="email"/></label>
    <button class="btn block">Continue</button></form><p class="tiny muted center">No real account is created.</p></div>`),
  'logout': () => { Store.s.consumerUser = null; Store.save(); toast('Logged out'); },

  'toggle-save': (el) => {
    const id = el.dataset.id, role = el.dataset.role;
    if (role === 'consumer' && !Store.s.consumerUser) { pendingSave = id; Actions.login(); return; }
    const list = role === 'vendor' ? Store.s.savedVendor : Store.s.savedConsumer;
    const i = list.indexOf(id);
    if (i >= 0) list.splice(i, 1); else list.push(id);
    Store.save();
    toast(i >= 0 ? 'Removed from saved' : `${ic('heart')} Saved — ${esc(Store.event(id).title)}`);
  },
  'share': () => { navigator.clipboard?.writeText(location.href); toast('Link copied to clipboard'); },
  'follow': (el) => { el.textContent = el.textContent === 'Following' ? 'Follow' : 'Following'; },
  'choose-plan': (el) => toast(`${esc(el.dataset.plan)} selected — checkout is simulated in the prototype`),
  'fake-upload': () => toast('Upload simulated — photos are mock data in the prototype'),
  'read-notes': () => { Store.s.notifications.forEach((n) => { n.read = true; }); localStorage.setItem(STORE_KEY, JSON.stringify(Store.s)); },

  // discover
  'df-cat': (el) => { const c = el.dataset.cat; DF.cats = DF.cats.includes(c) ? DF.cats.filter((x) => x !== c) : [...DF.cats, c]; el.classList.toggle('on'); updateDiscover(); },
  'df-view': (el) => { DF.view = el.dataset.v; render(); },
  'df-clear': () => { Object.assign(DF, { q: '', cats: [], hood: '', when: '', free: false, active: null }); render(); },

  // vendor apply
  'ap-qty': (el) => {
    const e = Store.event(AP.eventId); const b = e.booths.find((x) => x.id === el.dataset.b);
    const q = Math.max(0, Math.min(b.addon ? 6 : 2, (AP.selection[b.id] || 0) + Number(el.dataset.d)));
    if (q) AP.selection[b.id] = q; else delete AP.selection[b.id];
    render();
  },
  'ap-photo': (el) => { const ph = el.dataset.ph; AP.photos = AP.photos.includes(ph) ? AP.photos.filter((x) => x !== ph) : [...AP.photos, ph]; el.classList.toggle('on'); },
  'withdraw': (el) => { if (confirm('Withdraw this application?')) { Store.setStatus(el.dataset.id, 'withdrawn'); toast('Application withdrawn'); } },

  // organizer
  'set-status': (el) => {
    const a = Store.app(el.dataset.id); const s = el.dataset.s;
    if (a.status === s) return;
    const before = Store.eventStats(a.eventId).revenue;
    Store.setStatus(a.id, s);
    const after = Store.eventStats(a.eventId).revenue;
    const v = VENDORS[a.vendorId];
    const diff = after - before;
    toast(`<b>${esc(v.name)}</b> ${STATUS_LABEL[s].toLowerCase()}${diff ? ` · est. revenue ${diff > 0 ? '+' : '−'}${money(Math.abs(diff))} → ${money(after)}` : ''}${s === 'accepted' ? ' · event group unlocked for vendor' : ''}`, s === 'accepted' ? 'good' : '');
  },
  'add-file': (el) => { Store.group(el.dataset.ev).files.push({ id: 'f' + Date.now(), name: 'Booth_Map_v2.pdf', size: '820 KB', kind: 'doc' }); Store.save(); toast('File shared with all accepted vendors'); },
  'open-file': (el) => {
    const e = Store.event(el.dataset.ev); const name = el.dataset.name;
    if (/flyer|poster/i.test(name)) {
      modal(`<div class="flyer film"><img src="${IMG(e.img, 900)}" alt=""/><div class="flyer-in">${wordmark('stacked')}<h2>${esc(e.title)}</h2><p>${fmtLong(e.date)}<br/>${fmtTime(e.start)} – ${fmtTime(e.end)} · ${esc(e.venue)}</p><span class="scribble light">free entry ✶</span></div></div><p class="tiny muted center">${esc(name)} — mock preview</p>`, 'modal-flyer');
    } else {
      modal(`<div class="doc-prev">${ic('file')}<h3>${esc(name)}</h3><p class="muted">Shared by ${esc(ORGANIZERS[e.organizerId].org)} · mock document preview</p><button class="btn" data-act="close-modal">${ic('download')} Download (simulated)</button></div>`);
    }
  },

  // wizard
  'wz-cat': (el) => { const c = el.dataset.cat; WZ.categories = WZ.categories.includes(c) ? WZ.categories.filter((x) => x !== c) : [...WZ.categories, c]; el.classList.toggle('on'); },
  'wz-cover': (el) => { WZ.img = el.dataset.ph; document.querySelectorAll('[data-act="wz-cover"]').forEach((b) => b.classList.toggle('on', b === el)); },
  'wz-bqty': (el) => { const b = WZ.booths[el.dataset.i]; b.qty = Math.max(1, Number(b.qty) + Number(el.dataset.d)); render(); },
  'wz-brm': (el) => { WZ.booths.splice(el.dataset.i, 1); render(); },
  'wz-badd': () => { WZ.booths.push({ id: 'b' + Date.now(), name: 'New booth type', price: 150, qty: 10 }); render(); },
  'wz-qadd': () => { if (WZ.questions.length < 4) { WZ.questions.push({ key: 'q' + Date.now(), label: '' }); render(); } },
  'wz-qrm': (el) => { WZ.questions.splice(el.dataset.i, 1); render(); },
  'wz-save': (el) => {
    const status = el.dataset.s;
    if (!WZ.title.trim()) { toast('Add an event title first (step 1)', 'warn'); go(`#/o/event/${WZ._for === 'new' ? 'new' : WZ._for + '/edit'}?step=1`); return; }
    if (status === 'published' && !WZ.booths.length) { toast('Add at least one booth type before publishing', 'warn'); return; }
    WZ.questions = WZ.questions.filter((q) => q.label.trim());
    const { _for, ...data } = WZ;
    data.status = status;
    if (_for === 'new') {
      const [lat, lng] = NEIGHBOURHOODS[data.neighbourhood];
      Object.assign(data, {
        id: data.title.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + String(Date.now()).slice(-4),
        organizerId: ME_ORG, source: 'organizer', lat: lat + (Math.random() - 0.5) * 0.006, lng: lng + (Math.random() - 0.5) * 0.006,
        gallery: [], views: 0, access: 'Details coming soon', pets: 'Ask the organizer', entry: 'Free entry',
        metro: data.metro || 'Details coming soon', parking: data.parking || 'Details coming soon',
        address: data.address || 'Montréal, QC', venue: data.venue || 'Venue TBD', desc: data.desc || '',
        schedule: [[data.start, 'Market opens'], [data.end, 'Market closes']],
      });
      Store.s.events.push(data);
    } else {
      const i = Store.s.events.findIndex((x) => x.id === _for);
      Store.s.events[i] = { ...Store.s.events[i], ...data };
    }
    WZ = null;
    Store.save();
    toast(status === 'published' ? `${ic('map')} <b>${esc(data.title)}</b> is live on the public map` : `<b>${esc(data.title)}</b> saved as draft`, 'good');
    go(status === 'published' ? `#/event/${data.id}` : '#/o/events');
  },
};

document.addEventListener('click', (ev) => {
  const el = ev.target.closest('[data-act]');
  if (!el) return;
  const fn = Actions[el.dataset.act];
  if (!fn) return;
  if (el.tagName !== 'A' || el.dataset.act === 'toggle-save') ev.preventDefault();
  ev.stopPropagation();
  fn(el, ev);
});

/* ---------------- Inputs ---------------- */
document.addEventListener('input', (ev) => {
  const el = ev.target;
  if (el.dataset.input === 'df-q') { DF.q = el.value; updateDiscover(); }
  if (el.dataset.ap) AP[el.dataset.ap] = el.value;
  if (el.dataset.apq) AP.answers[el.dataset.apq] = el.value;
  if (el.dataset.wz && WZ) WZ[el.dataset.wz] = el.value;
  if (el.dataset.wzb && WZ) { const [i, f] = el.dataset.wzb.split(':'); WZ.booths[i][f] = f === 'price' ? Number(el.value) : el.value; }
  if (el.dataset.wzq && WZ) WZ.questions[el.dataset.wzq].label = el.value;
});

document.addEventListener('change', (ev) => {
  const el = ev.target; const k = el.dataset.change;
  if (el.dataset.apq) AP.answers[el.dataset.apq] = el.value;
  if (el.dataset.wz && WZ) { WZ[el.dataset.wz] = el.value; }
  if (!k) return;
  if (k === 'df-when') { DF.when = el.value; updateDiscover(); }
  if (k === 'df-hood') { DF.hood = el.value; updateDiscover(); }
  if (k === 'df-free') { DF.free = el.checked; updateDiscover(); }
  if (k === 'ap-update') AP.updateProfile = el.checked;
  if (k === 'os-event') { OS.eventId = el.value; render(); }
  if (k === 'oa-event') go(`#/o/applications/${el.value}`);
  if (k === 'org-group-ev') go(`#/o/group/${el.value}`);
  if (k === 'wz-addon') { WZ.booths[el.dataset.i].addon = el.checked; render(); }
  if (k === 'wz-field') { const f = el.dataset.k; WZ.fields = el.checked ? [...WZ.fields, f] : WZ.fields.filter((x) => x !== f); }
});

/* ---------------- Forms ---------------- */
const Submits = {
  'hero-search': (f) => { DF.q = f.q.value; go('#/discover'); },
  'login': (f) => {
    Store.s.consumerUser = { name: f.name.value || 'Friend' };
    if (pendingSave && !Store.s.savedConsumer.includes(pendingSave)) Store.s.savedConsumer.push(pendingSave);
    pendingSave = null;
    closeModal(); Store.save(); toast(`Welcome, ${esc(Store.s.consumerUser.name)}! Your favourites are saved.`, 'good');
  },
  'submit-application': () => {
    const e = Store.event(AP.eventId);
    const hasBooth = Object.keys(AP.selection).some((bid) => !e.booths.find((b) => b.id === bid).addon);
    if (!hasBooth) { toast('Choose at least one booth (add-ons need a booth)', 'warn'); return; }
    const app = {
      id: 'app-' + Date.now(), eventId: e.id, vendorId: ME_VENDOR, status: 'pending', selection: { ...AP.selection },
      answers: { ...AP.answers }, message: AP.message, history: [{ status: 'pending', at: new Date().toISOString() }],
    };
    Store.s.applications.push(app);
    if (AP.updateProfile) {
      const p = Store.s.profile;
      ['description', 'category', 'social', 'previous'].forEach((k) => { if (AP[k]) p[k] = AP[k]; });
      Object.assign(p.answers, Object.fromEntries(Object.entries(AP.answers).filter(([, v]) => v)));
    }
    AP.eventId = null;
    Store.save();
    go(`#/v/applied/${app.id}`);
  },
  'save-profile': (f) => {
    const p = Store.s.profile; const d = new FormData(f);
    ['description', 'category', 'social', 'previous'].forEach((k) => { p[k] = d.get(k); });
    p.answers.era = d.get('a_era'); p.answers.price = d.get('a_price'); p.answers.notes = d.get('a_notes');
    Store.save(); toast('Profile saved — future applications will use it', 'good');
  },
  'post': (f) => {
    const text = f.text.value.trim(); if (!text) return;
    const role = f.dataset.role;
    Store.group(f.dataset.ev).posts.push({ id: 'p' + Date.now(), type: role === 'organizer' ? f.type.value : 'message', author: role === 'organizer' ? 'org' : ME_VENDOR, text, at: new Date().toISOString() });
    Store.save();
    const feed = document.getElementById('feed'); if (feed) feed.scrollTop = feed.scrollHeight;
  },
};
document.addEventListener('submit', (ev) => {
  const f = ev.target; const fn = Submits[f.dataset.submit];
  if (!fn) return;
  ev.preventDefault();
  fn(f);
});

/* ---------------- Boot ---------------- */
Store.load();
applyPalette();
if (EMBED) document.body.classList.add('embed');
Store.onChange(render);
window.addEventListener('hashchange', render);
window.addEventListener('storage', (e) => { if (e.key === STORE_KEY) { Store.load(); applyPalette(); render(); } });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
render();
