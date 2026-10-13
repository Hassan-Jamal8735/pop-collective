/* Organizer dashboard — Camille, Montreal Makers Collective. */

const OS = { eventId: 'mile-end' }; // selected event on overview
let WZ = null; // create/edit event wizard draft

Views.oHome = () => {
  const evs = Store.orgEvents();
  const pub = evs.filter((e) => e.status === 'published');
  if (!pub.find((e) => e.id === OS.eventId)) OS.eventId = pub[0]?.id;
  const e = Store.event(OS.eventId);
  const st = Store.eventStats(e.id);
  const apps = Store.appsForEvent(e.id);
  const pending = apps.filter((a) => a.status === 'pending');
  const pct = st.capacity ? Math.round((st.filled / st.capacity) * 100) : 0;
  return dashLayout('organizer', 'home', `
    <div class="dash-head"><div><p class="eyebrow">Organizer dashboard</p><h1 class="h1">Bonjour, Camille</h1></div>
      <div class="row gap"><select data-change="os-event">${pub.map((x) => `<option value="${x.id}" ${x.id === e.id ? 'selected' : ''}>${esc(x.title)}</option>`).join('')}</select><a href="#/o/event/new" class="btn">${ic('plus')} Create event</a></div></div>
    <div class="stats">
      <a href="#/o/applications/${e.id}" class="stat"><span>Applications</span><b id="st-total">${st.total}</b></a>
      <a href="#/o/applications/${e.id}?s=pending" class="stat"><span>Pending review</span><b>${st.pending}</b></a>
      <a href="#/o/applications/${e.id}?s=accepted" class="stat good"><span>Accepted</span><b>${st.accepted}</b></a>
      <a href="#/o/applications/${e.id}?s=waitlisted" class="stat"><span>Waitlisted</span><b>${st.waitlisted}</b></a>
      <div class="stat money"><span>Estimated revenue</span><b>${money(st.revenue)}</b><em>from accepted booth selections · no payments processed</em></div>
    </div>
    <div class="dash-two">
      <section class="panel">
        <div class="panel-head"><h2>Needs your review</h2><a class="link" href="#/o/applications/${e.id}">All applications</a></div>
        ${pending.length ? pending.map((a) => { const v = VENDORS[a.vendorId]; return `<div class="review-row">
          <img src="${IMG(v.photo, 100)}" alt=""/><div><b>${esc(v.name)}</b><span class="muted small">${esc(v.category)} · ${boothSummary(a)} · ${money(Store.appTotal(a))}</span></div>
          <div class="row gap-s"><a class="btn sm btn-ghost" href="#/o/applications/${e.id}?app=${a.id}">Review</a><button class="btn sm" data-act="set-status" data-id="${a.id}" data-s="accepted">Accept</button></div></div>`; }).join('')
          : '<p class="muted">You\'re all caught up ✶</p>'}
      </section>
      <section class="panel">
        <div class="panel-head"><h2>${esc(e.title)}</h2>${pill(e.status)}</div>
        ${film(e.img, 700, 'panel-cover')}
        <div class="kv"><span>Date</span><b>${fmtDate(e.date)}</b></div>
        <div class="kv"><span>Booths filled</span><b>${st.filled} / ${st.capacity}</b></div>
        <div class="bar"><span style="width:${pct}%"></span></div>
        <div class="kv"><span>Pending pipeline</span><b>${money(st.pipeline)}</b></div>
        <div class="kv"><span>Event page views</span><b>${e.views.toLocaleString()}</b></div>
        <div class="row gap"><a class="btn sm btn-ghost" href="#/o/event/${e.id}/edit">${ic('edit')} Edit</a><a class="btn sm btn-ghost" href="#/o/group/${e.id}">${ic('msg')} Event group</a><a class="btn sm btn-ghost" href="#/event/${e.id}">Public page</a></div>
      </section>
    </div>
    <section class="panel"><div class="panel-head"><h2>My events</h2><a class="link" href="#/o/events">Manage</a></div>${orgEventRows(evs)}</section>
  `);
};

function boothSummary(a) {
  const ev = Store.event(a.eventId);
  return Object.entries(a.selection).map(([bid, q]) => `${q}× ${ev.booths.find((b) => b.id === bid)?.name || bid}`).join(' + ');
}

function orgEventRows(evs) {
  return `<div class="ev-rows">${evs.map((e) => { const st = Store.eventStats(e.id); return `<div class="ev-row">
    <img src="${IMG(e.img, 160)}" alt=""/>
    <div class="ev-row-main"><b>${esc(e.title)}</b><span class="muted small">${fmtDate(e.date)} · ${esc(e.neighbourhood)}</span></div>
    ${pill(e.status)}
    <div class="ev-row-stat"><b>${st.filled}/${st.capacity}</b><span class="tiny muted">booths</span></div>
    <div class="ev-row-stat"><b>${st.total}</b><span class="tiny muted">applications</span></div>
    <div class="ev-row-stat"><b>${money(st.revenue)}</b><span class="tiny muted">est. revenue</span></div>
    <div class="row gap-s"><a class="btn sm btn-ghost" href="#/o/event/${e.id}/edit">Edit</a>${e.status === 'published' ? `<a class="btn sm" href="#/o/applications/${e.id}">Applicants</a>` : ''}</div>
  </div>`; }).join('')}</div>`;
}

Views.oEvents = (params) => {
  const f = params?.get('f') || 'all';
  const all = Store.orgEvents();
  const evs = f === 'all' ? all : all.filter((e) => e.status === f);
  return dashLayout('organizer', 'events', `
    <div class="dash-head"><div><p class="eyebrow">Events</p><h1 class="h1">My events</h1></div><a href="#/o/event/new" class="btn">${ic('plus')} Create event</a></div>
    <div class="tabs"><a href="#/o/events" class="${f === 'all' ? 'on' : ''}">All (${all.length})</a><a href="#/o/events?f=published" class="${f === 'published' ? 'on' : ''}">Published</a><a href="#/o/events?f=draft" class="${f === 'draft' ? 'on' : ''}">Drafts</a></div>
    <section class="panel">${evs.length ? orgEventRows(evs) : emptyState('cal', 'Nothing here', 'Create your first event.')}</section>`);
};

/* ---------- Applicant review ---------- */
Views.oApplications = (params, eventId) => {
  const e = Store.event(eventId);
  const s = params?.get('s') || 'all';
  const all = Store.appsForEvent(eventId);
  const list = s === 'all' ? all : all.filter((a) => a.status === s);
  const sel = Store.app(params?.get('app')) || list.find((a) => a.vendorId === ME_VENDOR) || list[0];
  const st = Store.eventStats(eventId);
  const pub = Store.orgEvents().filter((x) => x.status === 'published');
  const q = (k) => `${eventId}?${new URLSearchParams({ ...(k !== 'all' ? { s: k } : {}) })}`;
  const tab = (k, l) => `<a href="#/o/applications/${q(k)}" class="${s === k ? 'on' : ''}">${l} (${k === 'all' ? all.length : all.filter((a) => a.status === k).length})</a>`;
  return dashLayout('organizer', 'applications', `
    <div class="dash-head"><div><p class="eyebrow">Applicant review</p><h1 class="h1">Applications</h1></div>
      <select data-change="oa-event">${pub.map((x) => `<option value="${x.id}" ${x.id === eventId ? 'selected' : ''}>${esc(x.title)}</option>`).join('')}</select></div>
    <div class="totals-strip">
      <div><span>Accepted</span><b>${st.accepted}</b></div><div><span>Pending</span><b>${st.pending}</b></div><div><span>Waitlisted</span><b>${st.waitlisted}</b></div><div><span>Rejected</span><b>${st.rejected}</b></div>
      <div><span>Booths filled</span><b>${st.filled}/${st.capacity}</b></div><div class="rev"><span>Estimated revenue</span><b>${money(st.revenue)}</b></div>
    </div>
    <div class="tabs">${tab('all', 'All')}${tab('pending', 'Pending')}${tab('accepted', 'Accepted')}${tab('waitlisted', 'Waitlisted')}${tab('rejected', 'Rejected')}</div>
    <div class="review">
      <section class="panel review-list">
        ${list.length ? list.map((a) => { const v = VENDORS[a.vendorId]; return `<a href="#/o/applications/${eventId}?${new URLSearchParams({ ...(s !== 'all' ? { s } : {}), app: a.id })}" class="rl ${sel && sel.id === a.id ? 'on' : ''}">
          <img src="${IMG(v.photo, 100)}" alt=""/><div><b>${esc(v.name)}</b><span class="muted small">${esc(v.category)}</span></div>
          <span class="rl-amt">${money(Store.appTotal(a))}</span>${pill(a.status)}</a>`; }).join('') : '<p class="muted">No applications with this status.</p>'}
      </section>
      ${sel ? applicantDetail(sel) : ''}
    </div>`);
};

function applicantDetail(a) {
  const v = VENDORS[a.vendorId];
  const e = Store.event(a.eventId);
  const isNord = a.vendorId === ME_VENDOR;
  const p = Store.s.profile;
  const photos = isNord ? p.photos : [v.photo];
  return `<section class="panel applicant">
    <div class="app-hero">${film(photos[0], 700)}</div>
    <div class="app-id"><div><h2 class="h1">${esc(v.name)}</h2>${tags(v.category.split(' / '))}</div>${pill(a.status)}</div>
    <p>${esc(isNord ? p.description : v.bio)}</p>
    <div class="kv"><span>Social</span><b>${esc(isNord ? p.social : v.handle)}</b></div>
    ${isNord ? `<div class="kv"><span>Previous events</span><b>${esc(p.previous)}</b></div>` : ''}
    <h3>Booth selection</h3>
    ${Object.entries(a.selection).map(([bid, q]) => { const b = e.booths.find((x) => x.id === bid); return `<div class="kv"><span>${q} × ${esc(b.name)} @ ${money(b.price)}</span><b>${money(b.price * q)}</b></div>`; }).join('')}
    <div class="kv total"><span>Booth total</span><b>${money(Store.appTotal(a))}</b></div>
    ${e.questions.some((q) => a.answers[q.key]) ? `<h3>Answers</h3>${e.questions.filter((q) => a.answers[q.key]).map((q) => `<div class="qa"><span class="muted small">${esc(q.label)}</span><p>${esc(a.answers[q.key])}</p></div>`).join('')}` : ''}
    ${a.message ? `<h3>Message</h3><blockquote>${esc(a.message)}</blockquote>` : ''}
    ${photos.length > 1 ? `<div class="app-photos">${photos.slice(1).map((ph) => `<img src="${IMG(ph, 300)}" alt=""/>`).join('')}</div>` : ''}
    <p class="tiny muted">Submitted ${fmtStamp(a.history[0].at)}</p>
    <div class="decide">
      <button class="btn btn-ghost ${a.status === 'rejected' ? 'cur' : ''}" data-act="set-status" data-id="${a.id}" data-s="rejected">${ic('x')} Reject</button>
      <button class="btn btn-ghost ${a.status === 'waitlisted' ? 'cur' : ''}" data-act="set-status" data-id="${a.id}" data-s="waitlisted">${ic('clock')} Waitlist</button>
      <button class="btn btn-dark ${a.status === 'accepted' ? 'cur' : ''}" data-act="set-status" data-id="${a.id}" data-s="accepted">${ic('check')} Accept</button>
    </div>
  </section>`;
}

/* ---------- Create / edit event wizard ---------- */
const COVER_CHOICES = [PHOTOS.tents, PHOTOS.park, PHOTOS.indoor, PHOTOS.flea, PHOTOS.flowerAwning, PHOTOS.overpass];
const WZ_STEPS = ['Details', 'Booths & pricing', 'Application form', 'Review & publish'];

function wizardFor(id) {
  if (WZ && WZ._for === id) return WZ;
  if (id === 'new') {
    WZ = { _for: 'new', id: null, title: '', desc: '', date: '2027-08-08', start: '11:00', end: '17:00', venue: '', address: '', neighbourhood: 'Mile End / Plateau',
      categories: ['Vintage'], img: COVER_CHOICES[0], metro: '', parking: '', deadline: '2027-06-30',
      booths: [{ id: 'b1', name: '6-ft table', price: 180, qty: 20 }, { id: 'b2', name: 'Clothing rack (add-on)', price: 40, qty: 20, addon: true }],
      fields: ['name', 'description', 'category', 'photos'], questions: [{ key: 'power', label: 'Do you need access to electricity?' }], status: 'draft' };
  } else {
    WZ = { _for: id, ...clone(Store.event(id)) };
  }
  return WZ;
}

Views.oWizard = (params, id) => {
  const w = wizardFor(id);
  const step = Number(params?.get('step') || 1);
  const stepper = `<div class="wz-steps">${WZ_STEPS.map((l, i) => `<a href="#/o/event/${id}${id === 'new' ? '' : '/edit'}?step=${i + 1}" class="${step === i + 1 ? 'on' : step > i + 1 ? 'done' : ''}"><span>${step > i + 1 ? ic('check') : i + 1}</span>${l}</a>`).join('')}</div>`;
  const next = step < 4 ? `<a class="btn" href="#/o/event/${id}${id === 'new' ? '' : '/edit'}?step=${step + 1}">Save & continue</a>` : '';
  const prev = step > 1 ? `<a class="btn btn-ghost" href="#/o/event/${id}${id === 'new' ? '' : '/edit'}?step=${step - 1}">Back</a>` : `<a class="btn btn-ghost" href="#/o/events">Cancel</a>`;
  let body = '';
  if (step === 1) {
    body = `<div class="two"><label class="field"><span>Event title</span><input data-wz="title" value="${esc(w.title)}" placeholder="e.g. Mile End Vintage Market"/></label>
      <label class="field"><span>Neighbourhood</span><select data-wz="neighbourhood">${Object.keys(NEIGHBOURHOODS).map((n) => `<option ${w.neighbourhood === n ? 'selected' : ''}>${n}</option>`).join('')}</select></label></div>
      <label class="field"><span>Description</span><textarea data-wz="desc" rows="3" placeholder="What makes this market special?">${esc(w.desc)}</textarea></label>
      <div class="three"><label class="field"><span>Date</span><input type="date" data-wz="date" value="${w.date}"/></label>
      <label class="field"><span>Starts</span><input type="time" data-wz="start" value="${w.start}"/></label>
      <label class="field"><span>Ends</span><input type="time" data-wz="end" value="${w.end}"/></label></div>
      <div class="two"><label class="field"><span>Venue</span><input data-wz="venue" value="${esc(w.venue)}" placeholder="Le Livart"/></label>
      <label class="field"><span>Address</span><input data-wz="address" value="${esc(w.address)}" placeholder="3980 Rue Saint-Denis, Montréal"/></label></div>
      <div class="two"><label class="field"><span>Nearest metro</span><input data-wz="metro" value="${esc(w.metro)}" placeholder="Mont-Royal · 8 min walk"/></label>
      <label class="field"><span>Parking</span><input data-wz="parking" value="${esc(w.parking)}" placeholder="Street parking…"/></label></div>
      <div class="field"><span>Categories</span><div class="chips">${CATEGORIES.map((c) => `<button type="button" class="chip ${w.categories.includes(c) ? 'on' : ''}" data-act="wz-cat" data-cat="${esc(c)}">${esc(c)}</button>`).join('')}</div></div>
      <div class="field"><span>Cover photo</span><div class="photo-pick">${COVER_CHOICES.map((ph) => `<button type="button" class="ph ${w.img === ph ? 'on' : ''}" data-act="wz-cover" data-ph="${ph}"><img src="${IMG(ph, 300)}" alt=""/><span>${ic('check')}</span></button>`).join('')}</div></div>`;
  } else if (step === 2) {
    const cap = w.booths.filter((b) => !b.addon).reduce((s, b) => s + Number(b.qty), 0);
    const max = w.booths.filter((b) => !b.addon).reduce((s, b) => s + b.price * b.qty, 0);
    body = `<p class="muted">Set the booth types vendors can choose from. Add-ons (like racks) don't count toward capacity.</p>
      <div class="booth-edit">${w.booths.map((b, i) => `<div class="be-row">
        <input data-wzb="${i}:name" value="${esc(b.name)}" placeholder="Booth name"/>
        <label class="money-in">$<input type="number" min="0" data-wzb="${i}:price" value="${b.price}"/></label>
        <div class="stepper"><button type="button" data-act="wz-bqty" data-i="${i}" data-d="-1">${ic('minus')}</button><span>${b.qty}</span><button type="button" data-act="wz-bqty" data-i="${i}" data-d="1">${ic('plus')}</button></div>
        <label class="check"><input type="checkbox" data-change="wz-addon" data-i="${i}" ${b.addon ? 'checked' : ''}/> add-on</label>
        <button type="button" class="icon-btn" data-act="wz-brm" data-i="${i}" title="Remove">${ic('x')}</button></div>`).join('')}</div>
      <button type="button" class="add-row" data-act="wz-badd">${ic('plus')} Add booth type</button>
      <div class="totals-strip sm"><div><span>Capacity</span><b>${cap} booths</b></div><div class="rev"><span>Max booth revenue (sold out)</span><b>${money(max)}</b></div></div>`;
  } else if (step === 3) {
    body = `<p class="muted">Every vendor fills the same standardized form — plus up to four questions of your own.</p>
      <h3>Standard fields</h3>
      <div class="toggles">${STANDARD_FIELDS.map((f) => `<label class="toggle-row"><span>${f.label}${f.locked ? ' <span class="tag">always on</span>' : ''}</span>
        <input type="checkbox" class="switch" data-change="wz-field" data-k="${f.key}" ${w.fields.includes(f.key) || f.locked ? 'checked' : ''} ${f.locked ? 'disabled' : ''}/></label>`).join('')}</div>
      <h3>Custom questions <span class="muted small">(${w.questions.length}/4)</span></h3>
      <div class="q-edit">${w.questions.map((q, i) => `<div class="q-row"><span class="q-n">Q${i + 1}</span><input data-wzq="${i}" value="${esc(q.label)}" placeholder="Your question"/><button type="button" class="icon-btn" data-act="wz-qrm" data-i="${i}">${ic('x')}</button></div>`).join('')}</div>
      <button type="button" class="add-row" data-act="wz-qadd" ${w.questions.length >= 4 ? 'disabled' : ''}>${ic('plus')} ${w.questions.length >= 4 ? 'Maximum of 4 custom questions' : 'Add custom question'}</button>`;
  } else {
    const range = w.booths.length ? `${money(Math.min(...w.booths.map((b) => b.price)))} – ${money(Math.max(...w.booths.map((b) => b.price)))}` : '—';
    body = `<div class="review-card">
      ${film(w.img, 900)}
      <div class="rc-body"><h2 class="h1">${esc(w.title || 'Untitled event')}</h2>
        <p class="ev-meta">${ic('cal')} ${fmtLong(w.date)} · ${fmtTime(w.start)} – ${fmtTime(w.end)}</p>
        <p class="ev-meta">${ic('pin')} ${esc(w.venue || 'Venue TBD')}${w.address ? ', ' + esc(w.address) : ''} · ${esc(w.neighbourhood)}</p>
        ${tags(w.categories, 5)}<p class="muted">${esc(w.desc)}</p>
        <div class="kvs"><div><span class="tiny muted">Booth types</span><b>${w.booths.length}</b></div><div><span class="tiny muted">Price range</span><b>${range}</b></div><div><span class="tiny muted">Custom questions</span><b>${w.questions.length}/4</b></div><div><span class="tiny muted">Apply by</span><b><input type="date" data-wz="deadline" value="${w.deadline}"/></b></div></div>
      </div></div>
      <p class="muted small">${ic('map')} Publishing places this event on the public Montréal map and opens vendor applications.</p>
      <div class="row gap end"><button class="btn btn-ghost" data-act="wz-save" data-s="draft">Save as draft</button><button class="btn" data-act="wz-save" data-s="published">${w.status === 'published' ? 'Update published event' : 'Publish event'}</button></div>`;
  }
  return dashLayout('organizer', 'events', `
    <a href="#/o/events" class="back">${ic('back')} My events</a>
    <div class="dash-head"><div><p class="eyebrow">${id === 'new' ? 'New event' : 'Editing'} ${w.status === 'published' ? pill('published') : pill('draft')}</p><h1 class="h1">${id === 'new' ? 'Create event' : esc(w.title)}</h1></div></div>
    ${stepper}
    <section class="panel wz">${body}${step < 4 ? `<div class="row gap end wz-nav">${prev}${next}</div>` : `<div class="row wz-nav">${prev}</div>`}</section>`);
};

Views.oGroup = (_, eventId) => dashLayout('organizer', 'groups', groupView('organizer', eventId));
