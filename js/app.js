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
  [/^\/makers$/, Views.makers],
  [/^\/journal$/, Views.journal],
  [/^\/journal\/([\w-]+)$/, Views.article],
  [/^\/about$/, Views.about],
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
  [/^\/a$/, Views.aHome],
  [/^\/a\/events$/, Views.aEvents],
  [/^\/join\/(vendor|organizer)$/, Views.join],
];

const EMBED = new URLSearchParams(location.search).has('embed');
let lastPath = null;
let pendingSave = null;
let pendingFollow = null;

function parseHash() {
  const raw = location.hash.replace(/^#/, '') || '/';
  const [path, qs] = raw.split('?');
  return { path, params: new URLSearchParams(qs || '') };
}
const roleOf = (path) => (path.startsWith('/v') ? 'vendor' : path.startsWith('/o') ? 'organizer' : path.startsWith('/a') ? 'admin' : 'consumer');
const go = (hash) => { location.hash = hash; };

function render() {
  const { path, params } = parseHash();
  let view = Views.home, arg;
  for (const [re, fn] of ROUTES) { const m = path.match(re); if (m) { view = fn; arg = m[1]; break; } }
  destroyMaps();
  const y = window.scrollY;
  try {
    document.getElementById('app').innerHTML = view(params, arg);
  } catch (err) {
    console.error(err);
    document.getElementById('app').innerHTML = emptyState('refresh', 'Something went wrong on this screen', 'Reset the demo data to continue.', '<button class="btn" data-act="reset">Reset demo</button>');
  }
  document.body.dataset.role = roleOf(path);
  if (path !== lastPath) window.scrollTo(0, 0); else window.scrollTo(0, y);
  lastPath = path;
  if (view.mount) view.mount(params, arg);
  const feed = document.getElementById('feed');
  if (feed) feed.scrollTop = feed.scrollHeight;
  renderDemoBar();
  Tour.afterRender();
  Tour.check();
}

/* ---------------- Demo bar ---------------- */
function renderDemoBar() {
  if (EMBED) return;
  const role = roleOf(parseHash().path);
  const r = (k, href, label, sub) => `<a href="${href}" class="${role === k ? 'on' : ''}">${label}<small>${sub}</small></a>`;
  document.getElementById('demobar').innerHTML = `<div class="demobar">
    <span class="db-tag">Prototype</span>
    <div class="db-roles"><span class="db-label">View as</span>
      ${r('consumer', '#/', 'Consumer', 'public site')}${r('vendor', '#/v', 'Vendor', 'Atelier Nord')}${r('organizer', '#/o', 'Organizer', 'Camille')}${r('admin', '#/a', 'Admin', 'POP/COLLECTIVE team')}
    </div>
    <div class="db-tools">
      <button data-act="tour-start" data-id="scenario" class="db-main">${ic('play')}<span>Scenario</span></button>
      <button data-act="tours-menu">${ic('sparkle')}<span>Tours</span></button>
      <button data-act="brief">${ic('check')}<span>Brief checklist</span></button>
      <button data-act="palette" data-p="${Store.s.palette === 'b' ? 'a' : 'b'}" title="Switch colour palette"><i class="dot-pal"></i><span>Palette ${Store.s.palette.toUpperCase()}</span></button>
      <button data-act="mobile" title="Mobile preview">${ic('phone')}<span>Mobile</span></button>
      <button data-act="reset" title="Reset demo data">${ic('refresh')}<span>Reset</span></button>
    </div>
  </div>`;
}

/* ---------------- Palette ---------------- */
function applyPalette() { document.documentElement.dataset.palette = Store.s.palette; }

/* ---------------- Click actions ---------------- */
const Actions = {
  'palette': (el) => { Store.s.palette = el.dataset.p; applyPalette(); Store.save(); toast(`Palette ${el.dataset.p.toUpperCase()} — ${el.dataset.p === 'b' ? 'Orange & Cream' : 'Chocolate & Butter'}`); },
  'mobile': () => modal(`<div class="mob-prev"><div class="phone big"><iframe src="?embed=1${location.hash}" title="Mobile preview"></iframe></div><p class="tiny muted center">Live 390px preview — fully clickable</p></div>`, 'modal-phone'),
  'reset': () => { if (confirm('Reset all demo data to the starting scenario?')) { Store.reset(); WZ = null; AP.eventId = null; applyPalette(); toast('Demo data reset'); go('#/'); render(); } },
  'close-modal': (el, ev) => { if (el.classList.contains('modal-back') && ev.target !== el) return; closeModal(); },

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
  'follow': (el) => {
    const id = el.dataset.id;
    if (!Store.s.consumerUser) { pendingFollow = id; Actions.login(); return; }
    const f = Store.s.followed; const i = f.indexOf(id);
    if (i >= 0) f.splice(i, 1); else f.push(id);
    Store.save();
    toast(i >= 0 ? `Unfollowed ${esc(VENDORS[id].name)}` : `${ic('check')} Following <b>${esc(VENDORS[id].name)}</b> — we'll tell you where they pop up next`, i >= 0 ? '' : 'good');
  },
  'search': () => openSearch(),
  'notifs': (el) => { openNotifs(el.dataset.role); if (el.dataset.role === 'vendor') { Store.s.notifications.forEach((n) => { n.read = true; }); localStorage.setItem(STORE_KEY, JSON.stringify(Store.s)); } },
  'menu': () => openMenu(),
  'close-modal-nav': () => { closeModal(); },
  'how': (el) => {
    document.querySelectorAll('[data-act="how"]').forEach((b) => b.classList.toggle('on', b === el));
    document.querySelectorAll('[data-how]').forEach((d) => d.classList.toggle('on', d.dataset.how === el.dataset.k));
  },
  'mf-cat': (el) => { MF.cat = el.dataset.cat; document.querySelectorAll('[data-act="mf-cat"]').forEach((b) => b.classList.toggle('on', b === el)); updateMakers(); },
  'vf': (el) => {
    const c = el.dataset.cat;
    document.querySelectorAll('[data-act="vf"]').forEach((b) => b.classList.toggle('on', b === el));
    document.querySelectorAll('.vendor-grid .vcard').forEach((v) => { v.style.display = c === 'All' || v.dataset.cat === c ? '' : 'none'; });
  },
  'vote': (el) => {
    const c = el.dataset.city; Store.s.cityVotes = Store.s.cityVotes[c] ? {} : { [c]: true };
    Store.save(); if (Store.s.cityVotes[c]) toast(`${ic('check')} Vote counted for ${esc(c)}`, 'good');
  },
  'interested': (el) => {
    const id = el.dataset.id; const m = Store.s.interested;
    m[id] = !m[id]; Store.save();
    if (m[id]) toast(`${ic('sparkle')} See you there! We'll remind you the day before.`, 'good');
  },
  'lightbox': (el) => {
    const e = Store.event(el.dataset.ev); const pics = [e.img, ...e.gallery];
    let i = Number(el.dataset.i);
    const show = () => {
      modal(`<div class="lightbox"><img src="${IMG(pics[i], 1600)}" alt=""/><div class="lb-bar"><button data-act="lb" data-d="-1">${ic('back')}</button><span>${i + 1} / ${pics.length} · ${esc(e.title)}</span><button data-act="lb" data-d="1">${ic('arrow')}</button></div></div>`, 'modal-lightbox');
    };
    Actions.lb = (b) => { i = (i + Number(b.dataset.d) + pics.length) % pics.length; show(); };
    show();
  },
  'choose-plan': (el) => { const [kind, plan] = el.dataset.plan.split(' '); OB.plan = plan; go(`#/join/${kind}?step=${Store.s.accounts[kind] ? 2 : 1}`); },
  'notify-me': () => toast(`${ic('bell')} We'll let you know as soon as applications open`, 'good'),
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
    Store.s.done.reviewed = true;
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

  // admin
  'adm-publish': (el) => { const e = Store.event(el.dataset.id); e.status = 'published'; Store.save(); toast(`${ic('map')} <b>${esc(e.title)}</b> verified and live on the map`, 'good'); },
  'adm-reject': (el) => { const e = Store.event(el.dataset.id); e.status = 'archived'; Store.save(); toast(`Submission declined — ${esc(ORGANIZERS[e.organizerId].org)} will be notified`); },
  'adm-merge': (el) => {
    const e = Store.event(el.dataset.id); const into = Store.event(el.dataset.into);
    e.status = 'archived'; e.mergedInto = into.id;
    Store.save();
    toast(`Merged into <b>${esc(into.title)}</b> — no duplicate listing created`, 'good');
  },
  'adm-claim': (el) => {
    const c = Store.s.claims.find((x) => x.id === el.dataset.id); c.status = el.dataset.s;
    const e = Store.event(c.eventId);
    if (c.status === 'approved') { e.organizerId = c.orgId; e.claimed = true; }
    Store.save();
    toast(c.status === 'approved' ? `<b>${esc(ORGANIZERS[c.orgId].org)}</b> now manages ${esc(e.title)} — same listing, now open to applications` : 'Claim declined', c.status === 'approved' ? 'good' : '');
  },
  'adm-new': () => go('#/o/event/new'),

  // onboarding
  'ob-yearly': (el) => { OB.yearly = el.dataset.y === '1'; render(); },
  'ob-plan': (el) => { OB.plan = el.dataset.p; render(); },

  // calendar + bulk review
  'ics': (el) => {
    const e = Store.event(el.dataset.id);
    const d = e.date.replace(/-/g, ''); const t = (x) => x.replace(':', '') + '00';
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//POP COLLECTIVE//EN', 'BEGIN:VEVENT', `UID:${e.id}@popcollective`, `DTSTART;TZID=America/Toronto:${d}T${t(e.start)}`,
      `DTEND;TZID=America/Toronto:${d}T${t(e.end)}`, `SUMMARY:${e.title}`, `LOCATION:${e.venue}, ${e.address}`, `DESCRIPTION:${e.desc.slice(0, 200)}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' })); a.download = `${e.id}.ics`; a.click();
    toast(`${ic('cal')} Added to your calendar`);
  },
  'bulk': (el) => {
    const ids = [...BULK]; const s = el.dataset.s;
    const before = Store.eventStats(Store.app(ids[0]).eventId).revenue;
    ids.forEach((id) => { const a = Store.app(id); if (a.status !== s) { a.status = s; a.history.push({ status: s, at: new Date().toISOString() }); if (s === 'accepted') Store.group(a.eventId).posts.push({ id: 'p' + Date.now() + id, type: 'system', author: 'system', text: `${VENDORS[a.vendorId].name} joined the event group.`, at: new Date().toISOString() }); if (a.vendorId === ME_VENDOR) Store.s.notifications.unshift({ id: 'n' + Date.now(), to: 'vendor', text: `${Store.event(a.eventId).title}: your application is now ${s}.`, at: new Date().toISOString(), eventId: a.eventId }); } });
    BULK.clear();
    Store.s.done.reviewed = true;
    Store.save();
    const after = Store.eventStats(Store.app(ids[0]).eventId).revenue;
    toast(`${ids.length} application${ids.length > 1 ? 's' : ''} ${STATUS_LABEL[s].toLowerCase()}${after !== before ? ` · est. revenue ${money(after)}` : ''}`, 'good');
  },
  'bulk-clear': () => { BULK.clear(); render(); },

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
        address: data.address || 'Montreal, QC', venue: data.venue || 'Venue TBD', desc: data.desc || '',
        schedule: [[data.start, 'Market opens'], [data.end, 'Market closes']],
      });
      Store.s.events.push(data);
    } else {
      const i = Store.s.events.findIndex((x) => x.id === _for);
      Store.s.events[i] = { ...Store.s.events[i], ...data };
    }
    WZ = null;
    if (status === 'published') Store.s.done.published = true;
    Store.save();
    toast(status === 'published' ? `${ic('map')} <b>${esc(data.title)}</b> is live on the public map` : `<b>${esc(data.title)}</b> saved as draft`, 'good');
    go(status === 'published' ? `#/event/${data.id}` : '#/o/events');
  },
};

document.addEventListener('click', (ev) => {
  const el = ev.target.closest('[data-act]');
  if (!el) return;
  if (el.classList.contains('modal-back') && ev.target !== el) return; // clicks inside modal content
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
  if (el.dataset.input === 'mf-q') { MF.q = el.value; updateMakers(); }
  if (el.dataset.input === 'gsearch') document.getElementById('gs-results').innerHTML = searchResults(el.value);
  if (el.dataset.ap) AP[el.dataset.ap] = el.value;
  if (el.dataset.apq) AP.answers[el.dataset.apq] = el.value;
  if (el.dataset.wz && WZ) WZ[el.dataset.wz] = el.value;
  if (el.dataset.wzb && WZ) { const [i, f] = el.dataset.wzb.split(':'); WZ.booths[i][f] = f === 'price' ? Number(el.value) : el.value; }
  if (el.dataset.wzq && WZ) { WZ.questions[el.dataset.wzq].label = el.value; const fp = document.getElementById('fp-q' + el.dataset.wzq); if (fp) fp.textContent = el.value || 'Untitled question'; }
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
  if (k === 'bulk') { if (el.checked) BULK.add(el.dataset.id); else BULK.delete(el.dataset.id); render(); }
  if (k === 'bulk-all') { document.querySelectorAll('[data-change="bulk"]').forEach((c) => { if (el.checked) BULK.add(c.dataset.id); else BULK.delete(c.dataset.id); }); render(); }
  if (k === 'wz-addon') { WZ.booths[el.dataset.i].addon = el.checked; render(); }
  if (k === 'wz-field') { const f = el.dataset.k; WZ.fields = el.checked ? [...WZ.fields, f] : WZ.fields.filter((x) => x !== f); render(); }
});

/* ---------------- Forms ---------------- */
const Submits = {
  'newsletter': () => { Store.s.newsletter = true; Store.save(); toast(`${ic('check')} Subscribed to The Weekend Edit`, 'good'); },
  'ob-next': (f) => go(f.dataset.to),
  'hero-search': (f) => { DF.q = f.q.value; go('#/discover'); },
  'login': (f) => {
    Store.s.consumerUser = { name: f.name.value || 'Friend' };
    if (pendingSave && !Store.s.savedConsumer.includes(pendingSave)) Store.s.savedConsumer.push(pendingSave);
    if (pendingFollow && !Store.s.followed.includes(pendingFollow)) Store.s.followed.push(pendingFollow);
    pendingSave = null; pendingFollow = null;
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
    Store.s.done.applied = true;
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
    Store.s.done.vendorProfile = true; Store.s.done.answers = true;
    Store.save(); toast('Profile saved — future applications will use it', 'good');
  },
  'post': (f) => {
    const text = f.text.value.trim(); if (!text) return;
    const role = f.dataset.role;
    if (role === 'organizer' && f.type.value === 'announcement') Store.s.done.announced = true;
    Store.group(f.dataset.ev).posts.push({ id: 'p' + Date.now(), type: role === 'organizer' ? f.type.value : 'message', author: role === 'organizer' ? 'org' : ME_VENDOR, text, at: new Date().toISOString() });
    Store.save();
    const feed = document.getElementById('feed'); if (feed) feed.scrollTop = feed.scrollHeight;
  },
};
Object.assign(Actions, ObActions);
Object.assign(Submits, ObSubmits);
Object.assign(Actions, TourActions);

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
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
  const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName);
  if (!typing && (e.key === '/' || ((e.ctrlKey || e.metaKey) && e.key === 'k')) && !roleOf(parseHash().path).match(/vendor|organizer|admin/)) { e.preventDefault(); openSearch(); }
});
render();

// Resume a tour across reloads, otherwise greet first-time visitors.
const savedTour = JSON.parse(sessionStorage.getItem('popco_tour') || 'null');
if (!EMBED && savedTour && TOURS[savedTour.id]) { Tour.id = savedTour.id; Tour.i = savedTour.i; Tour.show(); }
else if (!EMBED && !localStorage.getItem('popco_welcomed')) { localStorage.setItem('popco_welcomed', '1'); setTimeout(openWelcome, 400); }
