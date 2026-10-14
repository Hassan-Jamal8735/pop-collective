/* Vendor dashboard — Atelier Nord. */

const AP = { eventId: null }; // in-progress application draft

Views.vHome = () => {
  const apps = Store.appsForVendor();
  const by = (s) => apps.filter((a) => a.status === s).length;
  const notes = Store.s.notifications.filter((n) => n.to === 'vendor').slice(0, 3);
  const accepted = apps.filter((a) => a.status === 'accepted').map((a) => Store.event(a.eventId));
  const applied = new Set(apps.map((a) => a.eventId));
  const recs = Store.publicEvents().filter((e) => !applied.has(e.id) && e.categories.some((c) => ['Vintage', 'Fashion', 'Handmade', 'Home'].includes(c))).slice(0, 3);
  return dashLayout('vendor', 'home', `
    <div class="dash-head"><div><p class="eyebrow">Vendor dashboard</p><h1 class="h1">Welcome back, Atelier Nord</h1></div><a href="#/v/discover" class="btn">${ic('search')} Find events</a></div>
    ${gettingStarted('vendor')}
    ${notes.map((n) => `<a href="#/v/group/${n.eventId}" class="notice ${/accepted/.test(n.text) ? 'good' : ''}" data-act="read-notes">${ic('bell')}<span>${esc(n.text)}${/accepted/.test(n.text) ? ' <b>Event group unlocked →</b>' : ''}</span></a>`).join('')}
    <div class="stats">
      <a href="#/v/applications" class="stat"><span>Applications</span><b>${apps.length}</b></a>
      <a href="#/v/applications?s=pending" class="stat"><span>Pending</span><b>${by('pending')}</b></a>
      <a href="#/v/applications?s=accepted" class="stat good"><span>Accepted</span><b>${by('accepted')}</b></a>
      <a href="#/v/applications?s=waitlisted" class="stat"><span>Waitlisted</span><b>${by('waitlisted')}</b></a>
    </div>
    <div class="dash-two">
      <section class="panel">
        <div class="panel-head"><h2>My applications</h2><a class="link" href="#/v/applications">View all</a></div>
        ${appTable(apps)}
      </section>
      <section class="panel">
        <div class="panel-head"><h2>Upcoming bookings</h2></div>
        ${accepted.length ? accepted.map((e) => `<div class="booking"><img src="${IMG(e.img, 160)}" alt=""/><div><strong>${esc(e.title)}</strong><span class="muted small">${fmtDate(e.date)} · ${esc(e.venue)}</span></div><a class="btn sm btn-ghost" href="#/v/group/${e.id}">${ic('msg')} Group</a></div>`).join('') : '<p class="muted">No confirmed bookings yet.</p>'}
      </section>
    </div>
    <section class="panel"><div class="panel-head"><h2>Recommended for Atelier Nord</h2><a class="link" href="#/v/discover">Browse all</a></div>
      <div class="grid-cards">${recs.map((e) => eventCard(e, 'vendor')).join('')}</div></section>
  `);
};

function appTable(apps, link = true) {
  if (!apps.length) return emptyState('file', 'No applications here', 'Browse events and apply with your saved profile.', '<a class="btn" href="#/v/discover">Discover events</a>');
  return `<div class="table">
    <div class="tr th"><span>Event</span><span>Date</span><span>Booth</span><span>Status</span><span></span></div>
    ${apps.map((a) => { const e = Store.event(a.eventId); return `<a href="#/v/application/${a.id}" class="tr">
      <span class="t-ev"><img src="${IMG(e.img, 100)}" alt=""/><b>${esc(e.title)}</b></span>
      <span class="muted">${fmtDate(e.date)}</span><span>${money(Store.appTotal(a))}</span><span>${pill(a.status)}</span><span class="muted">${ic('arrow')}</span></a>`; }).join('')}
  </div>`;
}

Views.vDiscover = (params) => {
  applyDiscoverParams(params);
  return dashLayout('vendor', 'discover', `
    <div class="dash-head"><div><p class="eyebrow">Opportunities</p><h1 class="h1">Discover events</h1></div></div>
    ${discoverFilters()}${discoverBody('vendor')}`);
};
Views.vDiscover.mount = () => mountDiscover('vendor');

Views.vEvent = (_, id) => {
  const e = Store.event(id);
  const org = ORGANIZERS[e.organizerId];
  const my = Store.myAppFor(id);
  const saved = Store.s.savedVendor.includes(id);
  const fields = STANDARD_FIELDS.filter((f) => e.fields.includes(f.key));
  return dashLayout('vendor', 'discover', `
    <a href="#/v/discover" class="back">${ic('back')} Back to events</a>
    <div class="vev">
      <div class="vev-main">
        ${film(e.img, 1200, 'vev-cover')}
        <h1 class="h1">${esc(e.title)}</h1>
        <p class="ev-meta">${ic('cal')} ${fmtLong(e.date)} · ${fmtTime(e.start)} – ${fmtTime(e.end)}</p>
        <p class="ev-meta">${ic('pin')} ${esc(e.venue)}, ${esc(e.address)}</p>
        ${tags(e.categories, 5)}
        <p>${esc(e.desc)}</p>
        <h3>Booth options</h3>
        <div class="booths-list">${e.booths.map((b) => `<div class="booth-row"><span>${esc(b.name)}${b.addon ? ' <span class="tag">add-on</span>' : ''}</span><span class="muted">${b.qty} available</span><b>${money(b.price)}</b></div>`).join('')}</div>
        <h3>The application asks for</h3>
        <ul class="asks">${fields.map((f) => `<li>${ic('check')} ${f.label}</li>`).join('')}${e.questions.map((q) => `<li>${ic('edit')} ${esc(q.label)}</li>`).join('')}</ul>
        <p class="muted small">${ic('sparkle')} Most answers will be prefilled from your brand profile.</p>
      </div>
      <aside class="vev-side panel">
        <div class="kv"><span>Booth price</span><b>${money(Math.min(...e.booths.filter((b) => !b.addon).map((b) => b.price)))} – ${money(Math.max(...e.booths.map((b) => b.price)))}</b></div>
        <div class="kv"><span>Application deadline</span><b>${fmtDate(e.deadline)}</b></div>
        <div class="kv"><span>Organizer</span><b>${esc(org.org)}</b></div>
        <div class="kv"><span>Expected attendance</span><b>${(e.views * 0.8).toFixed(0)}+</b></div>
        ${my ? `<div class="my-status">Your application ${pill(my.status)}</div><a class="btn block" href="#/v/application/${my.id}">View my application</a>
          ${my.status === 'accepted' ? `<a class="btn btn-ghost block" href="#/v/group/${e.id}">${ic('msg')} Open event group</a>` : ''}`
        : e.organizerId === 'pc-team'
          ? `<div class="curated-note">${ic('sparkle')}<div><b>Curated listing</b><span class="small muted">POP/COLLECTIVE added this event; its organizer hasn't joined yet. Applications open once they claim the listing.</span></div></div><button class="btn block" data-act="notify-me">${ic('bell')} Notify me when applications open</button>`
          : `<a class="btn block" href="#/v/apply/${e.id}">Apply to this event</a>`}
        <button class="btn btn-ghost block" data-act="toggle-save" data-id="${e.id}" data-role="vendor">${ic('bookmark')} ${saved ? 'Saved' : 'Save to favourites'}</button>
        <a class="link small" href="#/event/${e.id}">See public event page →</a>
      </aside>
    </div>`);
};

/* ---------- Apply flow ---------- */
function startApply(e) {
  const p = Store.s.profile;
  Object.assign(AP, {
    eventId: e.id,
    selection: e.id === 'mile-end' ? { b1: 1, b2: 2 } : { [e.booths[0].id]: 1 },
    description: p.description, category: p.category, social: p.social, previous: p.previous,
    photos: p.photos.slice(0, 3),
    answers: Object.fromEntries(e.questions.map((q) => [q.key, p.answers[q.key] || ''])),
    message: '', updateProfile: true,
  });
}
const apTotal = (e) => Object.entries(AP.selection).reduce((s, [bid, q]) => s + (e.booths.find((b) => b.id === bid)?.price || 0) * q, 0);

Views.vApply = (_, id) => {
  const e = Store.event(id);
  if (Store.myAppFor(id)) { location.hash = `#/v/application/${Store.myAppFor(id).id}`; return ''; }
  if (AP.eventId !== id) startApply(e);
  const has = (k) => e.fields.includes(k);
  const prefill = '<span class="prefill">' + ic('sparkle') + ' from profile</span>';
  return dashLayout('vendor', 'discover', `
    <a href="#/v/event/${id}" class="back">${ic('back')} ${esc(e.title)}</a>
    <div class="dash-head"><div><p class="eyebrow">Application</p><h1 class="h1">Apply to ${esc(e.title)}</h1><p class="muted">${fmtLong(e.date)} · ${esc(e.venue)}</p></div></div>
    <div class="apply">
      <form class="apply-form" data-submit="submit-application">
        <section class="panel">
          <h2>1. Choose your booth</h2>
          ${e.booths.map((b) => { const q = AP.selection[b.id] || 0; return `<div class="booth-pick ${q ? 'on' : ''}">
            <div><b>${esc(b.name)}</b>${b.addon ? ' <span class="tag">add-on</span>' : ''}<span class="muted small">${b.qty} available</span></div>
            <b class="price">${money(b.price)}</b>
            <div class="stepper"><button type="button" data-act="ap-qty" data-b="${b.id}" data-d="-1">${ic('minus')}</button><span>${q}</span><button type="button" data-act="ap-qty" data-b="${b.id}" data-d="1">${ic('plus')}</button></div>
          </div>`; }).join('')}
          <div class="total-row"><span>Booth total <span class="muted small">(no payment now — paid only if accepted)</span></span><b id="ap-total">${money(apTotal(e))}</b></div>
        </section>

        <section class="panel">
          <h2>2. Your brand <span class="muted small">— prefilled from your reusable profile, edit freely</span></h2>
          <label class="field"><span>Business name ${prefill}</span><input value="Atelier Nord" disabled /></label>
          ${has('description') ? `<label class="field"><span>Business description ${prefill}</span><textarea data-ap="description" rows="3">${esc(AP.description)}</textarea></label>` : ''}
          ${has('category') ? `<label class="field"><span>Product category ${prefill}</span><input data-ap="category" value="${esc(AP.category)}" /></label>` : ''}
          ${has('social') ? `<label class="field"><span>Website / social ${prefill}</span><input data-ap="social" value="${esc(AP.social)}" /></label>` : ''}
          ${has('previous') ? `<label class="field"><span>Previous events ${prefill}</span><input data-ap="previous" value="${esc(AP.previous)}" /></label>` : ''}
          ${has('photos') ? `<div class="field"><span>Product photos (select 3–5) ${prefill}</span>
            <div class="photo-pick">${Store.s.profile.photos.map((ph) => `<button type="button" class="ph ${AP.photos.includes(ph) ? 'on' : ''}" data-act="ap-photo" data-ph="${ph}"><img src="${IMG(ph, 300)}" alt=""/><span>${ic('check')}</span></button>`).join('')}
            <button type="button" class="ph add" data-act="fake-upload">${ic('upload')}<span class="tiny">Upload</span></button></div></div>` : ''}
        </section>

        ${e.questions.length ? `<section class="panel"><h2>3. Questions from ${esc(ORGANIZERS[e.organizerId].org)}</h2>
          ${e.questions.map((q) => `<label class="field"><span>${esc(q.label)} ${AP.answers[q.key] ? prefill : ''}</span>
            ${q.key === 'power' ? `<select data-apq="${q.key}"><option ${AP.answers[q.key] === 'No' ? 'selected' : ''}>No</option><option ${AP.answers[q.key] === 'Yes' ? 'selected' : ''}>Yes</option></select>`
              : `<input data-apq="${q.key}" value="${esc(AP.answers[q.key])}" placeholder="Your answer" />`}</label>`).join('')}
        </section>` : ''}

        <section class="panel">
          <h2>${e.questions.length ? 4 : 3}. Message to the organizer <span class="muted small">(optional)</span></h2>
          <textarea data-ap="message" rows="3" placeholder="Say hello, share what makes your booth special…">${esc(AP.message)}</textarea>
          <label class="check"><input type="checkbox" data-change="ap-update" ${AP.updateProfile ? 'checked' : ''}/> Save these answers to my profile for next time</label>
        </section>
        <div class="apply-submit"><a class="btn btn-ghost" href="#/v/event/${id}">Cancel</a><button class="btn">Submit application</button></div>
      </form>
      <aside class="apply-side panel">
        ${film(e.img, 500)}
        <h3>${esc(e.title)}</h3><p class="muted small">${fmtDate(e.date)} · ${esc(e.venue)}</p>
        <div id="ap-summary">${apSummary(e)}</div>
      </aside>
    </div>`);
};

function apSummary(e) {
  const rows = Object.entries(AP.selection).filter(([, q]) => q > 0).map(([bid, q]) => { const b = e.booths.find((x) => x.id === bid); return `<div class="kv"><span>${q} × ${esc(b.name)}</span><b>${money(b.price * q)}</b></div>`; });
  return `${rows.join('') || '<p class="muted small">Select a booth.</p>'}<div class="kv total"><span>Total</span><b>${money(apTotal(e))}</b></div>`;
}

Views.vApplied = (_, appId) => {
  const a = Store.app(appId); const e = Store.event(a.eventId);
  return dashLayout('vendor', 'applications', `
    <div class="success">
      <div class="burst">${ic('check')}</div>
      <h1 class="h1">Application submitted!</h1>
      <p class="muted">Your application for <b>${esc(e.title)}</b> (${money(Store.appTotal(a))}) has been sent to ${esc(ORGANIZERS[e.organizerId].org)}. You'll be notified when the status changes.</p>
      <div class="row gap center"><a class="btn" href="#/v/application/${a.id}">View my application</a><a class="btn btn-ghost" href="#/v/discover">Browse more events</a></div>
      ${e.organizerId === ME_ORG ? `<p class="hint">${ic('sparkle')} Demo tip: switch to <b>Organizer</b> in the top bar to review this application as Camille.</p>` : ''}
    </div>`);
};

/* ---------- Applications ---------- */
Views.vApplications = (params) => {
  const s = params?.get('s') || 'all';
  const all = Store.appsForVendor();
  const apps = s === 'all' ? all : all.filter((a) => a.status === s);
  const tab = (k, l) => `<a href="#/v/applications${k === 'all' ? '' : '?s=' + k}" class="${s === k ? 'on' : ''}">${l} (${k === 'all' ? all.length : all.filter((a) => a.status === k).length})</a>`;
  return dashLayout('vendor', 'applications', `
    <div class="dash-head"><div><p class="eyebrow">Tracking</p><h1 class="h1">My applications</h1></div><a href="#/v/discover" class="btn">${ic('plus')} New application</a></div>
    <div class="tabs">${tab('all', 'All')}${tab('pending', 'Pending')}${tab('accepted', 'Accepted')}${tab('waitlisted', 'Waitlisted')}${tab('rejected', 'Rejected')}</div>
    <section class="panel">${appTable(apps)}</section>`);
};

Views.vApplication = (_, id) => {
  const a = Store.app(id); const e = Store.event(a.eventId);
  const steps = ['pending', a.status === 'pending' ? 'decision' : a.status];
  return dashLayout('vendor', 'applications', `
    <a href="#/v/applications" class="back">${ic('back')} My applications</a>
    <div class="dash-head"><div><p class="eyebrow">Application</p><h1 class="h1">${esc(e.title)} ${pill(a.status)}</h1><p class="muted">${fmtLong(e.date)} · ${esc(e.venue)} · ${esc(ORGANIZERS[e.organizerId].org)}</p></div></div>
    <div class="dash-two">
      <section class="panel">
        <h2>Status</h2>
        <div class="timeline">
          ${a.history.map((h) => `<div class="tl ${h.status}"><span class="dot"></span><div><b>${STATUS_LABEL[h.status]}</b><span class="muted small">${fmtStamp(h.at)}</span></div></div>`).join('')}
          ${a.status === 'pending' ? '<div class="tl next"><span class="dot"></span><div><b>Organizer decision</b><span class="muted small">Accept · Waitlist · Reject</span></div></div>' : ''}
        </div>
        <h2>Booth selection</h2>
        ${Object.entries(a.selection).map(([bid, q]) => { const b = e.booths.find((x) => x.id === bid); return `<div class="kv"><span>${q} × ${esc(b.name)}</span><b>${money(b.price * q)}</b></div>`; }).join('')}
        <div class="kv total"><span>Total ${a.status === 'accepted' ? '(due to organizer)' : '(if accepted)'}</span><b>${money(Store.appTotal(a))}</b></div>
        ${Object.keys(a.answers).length ? `<h2>Your answers</h2>${e.questions.filter((q) => a.answers[q.key]).map((q) => `<div class="qa"><span class="muted small">${esc(q.label)}</span><p>${esc(a.answers[q.key])}</p></div>`).join('')}` : ''}
        ${a.status === 'pending' ? `<button class="btn btn-ghost sm" data-act="withdraw" data-id="${a.id}">Withdraw application</button>` : ''}
      </section>
      <section class="panel ${a.status === 'accepted' ? 'group-teaser on' : 'group-teaser'}">
        ${a.status === 'accepted'
          ? `<div class="unlock">${ic('msg')}</div><h2>Event group unlocked</h2><p class="muted">Announcements, the vendor chat and shared files (flyer, vendor guide, floor plan) for ${esc(e.title)}.</p><a class="btn" href="#/v/group/${e.id}">Open event group</a>`
          : `<div class="unlock locked">${ic('lock')}</div><h2>Event group</h2><p class="muted">Unlocks once ${esc(ORGANIZERS[e.organizerId].org)} accepts your application. You'll get announcements, files and the vendor chat.</p>`}
      </section>
    </div>`);
};

Views.vGroups = () => {
  const apps = Store.appsForVendor().filter((a) => a.status !== 'rejected');
  return dashLayout('vendor', 'groups', `
    <div class="dash-head"><div><p class="eyebrow">Communications</p><h1 class="h1">Event groups</h1></div></div>
    <div class="group-list">${apps.map((a) => { const e = Store.event(a.eventId); const open = a.status === 'accepted'; const g = Store.group(e.id);
      return `<a ${open ? `href="#/v/group/${e.id}"` : ''} class="group-item ${open ? '' : 'locked'}">
        <img src="${IMG(e.img, 160)}" alt=""/><div><strong>${esc(e.title)}</strong><span class="muted small">${open ? `${g.posts.length} posts · ${g.files.length} files` : 'Unlocks when accepted'}</span></div>
        ${open ? ic('arrow') : `${pill(a.status)} ${ic('lock')}`}</a>`; }).join('')}</div>`);
};

Views.vGroup = (_, eventId) => {
  const a = Store.myAppFor(eventId);
  const e = Store.event(eventId);
  if (!a || a.status !== 'accepted') {
    return dashLayout('vendor', 'groups', `<a href="#/v/groups" class="back">${ic('back')} Event groups</a>
      <div class="locked-big">${ic('lock')}<h2 class="h1">${esc(e.title)} — event group</h2><p class="muted">This space unlocks when the organizer accepts your application.${a ? ` Current status: ${pill(a.status)}` : ''}</p>${a ? `<a class="btn btn-ghost" href="#/v/application/${a.id}">View application</a>` : ''}</div>`);
  }
  if (!Store.s.done.openedGroup) { Store.s.done.openedGroup = true; localStorage.setItem(STORE_KEY, JSON.stringify(Store.s)); }
  return dashLayout('vendor', 'groups', groupView('vendor', eventId));
};

Views.vSaved = () => {
  const evs = Store.s.savedVendor.map((id) => Store.event(id)).filter(Boolean);
  return dashLayout('vendor', 'saved', `<div class="dash-head"><div><p class="eyebrow">Shortlist</p><h1 class="h1">Saved events</h1></div></div>
    ${evs.length ? `<div class="grid-cards">${evs.map((e) => eventCard(e, 'vendor')).join('')}</div>` : emptyState('bookmark', 'No saved events', 'Bookmark events to compare later.', '<a class="btn" href="#/v/discover">Discover</a>')}`);
};

Views.vProfile = () => {
  const p = Store.s.profile;
  return dashLayout('vendor', 'profile', `
    <div class="dash-head"><div><p class="eyebrow">Reusable profile</p><h1 class="h1">Brand profile</h1><p class="muted">Used to prefill every application. Edit once, apply everywhere.</p></div><a class="btn btn-ghost" href="#/maker/${ME_VENDOR}">View public profile</a></div>
    <form class="panel prof-form" data-submit="save-profile">
      <div class="prof-top"><img src="${IMG(VENDORS[ME_VENDOR].photo, 200)}" alt=""/><div><b>Atelier Nord</b><span class="muted small">@ateliernord · Montreal, QC</span></div></div>
      <label class="field"><span>Business description</span><textarea name="description" rows="3">${esc(p.description)}</textarea></label>
      <div class="two"><label class="field"><span>Product category</span><input name="category" value="${esc(p.category)}"/></label>
      <label class="field"><span>Website / social</span><input name="social" value="${esc(p.social)}"/></label></div>
      <label class="field"><span>Previous events</span><input name="previous" value="${esc(p.previous)}"/></label>
      <div class="field"><span>Product photos</span><div class="photo-pick">${p.photos.map((ph) => `<div class="ph on"><img src="${IMG(ph, 300)}" alt=""/></div>`).join('')}<button type="button" class="ph add" data-act="fake-upload">${ic('upload')}<span class="tiny">Upload</span></button></div></div>
      <h3>Saved answers</h3><p class="muted small">Reused when an organizer asks a similar question.</p>
      <label class="field"><span>Which era(s) does your collection focus on?</span><input name="a_era" value="${esc(p.answers.era || '')}"/></label>
      <label class="field"><span>Typical price range</span><input name="a_price" value="${esc(p.answers.price || '')}"/></label>
      <label class="field"><span>Notes for organizers</span><input name="a_notes" value="${esc(p.answers.notes || '')}"/></label>
      <div class="row end"><button class="btn">Save profile</button></div>
    </form>`);
};

/* ---------- Event group (shared by vendor + organizer) ---------- */
function groupView(role, eventId) {
  const e = Store.event(eventId);
  const g = Store.group(eventId);
  const members = Store.appsForEvent(eventId).filter((a) => a.status === 'accepted').map((a) => VENDORS[a.vendorId]);
  const org = ORGANIZERS[e.organizerId];
  const author = (id) => id === 'org' ? { n: org.name.split(' ')[0] + ' · Organizer', img: org.photo } : VENDORS[id] ? { n: VENDORS[id].name, img: VENDORS[id].photo } : { n: id };
  const mine = (p) => (role === 'organizer' && p.author === 'org') || (role === 'vendor' && p.author === ME_VENDOR);
  const anns = g.posts.filter((p) => p.type === 'announcement');
  const orgEvents = Store.orgEvents().filter((x) => x.status === 'published');
  return `
    <a href="${role === 'vendor' ? '#/v/groups' : '#/o'}" class="back">${ic('back')} ${role === 'vendor' ? 'Event groups' : 'Dashboard'}</a>
    <div class="dash-head"><div><p class="eyebrow">Event group · ${members.length} vendors</p><h1 class="h1">${esc(e.title)}</h1><p class="muted">${fmtLong(e.date)} · ${esc(e.venue)}</p></div>
      ${role === 'organizer' ? `<select data-change="org-group-ev">${orgEvents.map((x) => `<option value="${x.id}" ${x.id === eventId ? 'selected' : ''}>${esc(x.title)}</option>`).join('')}</select>` : ''}</div>
    ${anns.length ? `<div class="ann-pinned">${ic('megaphone')}<div><span class="tiny">Latest announcement</span><p>${esc(anns[anns.length - 1].text)}</p></div></div>` : ''}
    <div class="group">
      <section class="panel feed">
        <div class="feed-list" id="feed">
          ${g.posts.map((p) => p.type === 'system' ? `<div class="sys">${esc(p.text)}</div>`
            : `<div class="post ${p.type} ${mine(p) ? 'mine' : ''}">
              ${author(p.author).img ? `<img src="${IMG(author(p.author).img, 80)}" alt=""/>` : '<span class="av"></span>'}
              <div class="bubble">${p.type === 'announcement' ? `<span class="ann-tag">${ic('megaphone')} Announcement</span>` : ''}<b>${esc(author(p.author).n)}</b><p>${esc(p.text)}</p><span class="tiny muted">${fmtStamp(p.at)}</span></div></div>`).join('')}
        </div>
        <form class="composer" data-submit="post" data-ev="${eventId}" data-role="${role}">
          ${role === 'organizer' ? `<select name="type"><option value="announcement">Announcement</option><option value="message">Message</option></select>` : ''}
          <input name="text" placeholder="${role === 'organizer' ? 'Write to all accepted vendors…' : 'Message the group…'}" autocomplete="off"/>
          <button class="btn sm">${ic('send')}</button>
        </form>
      </section>
      <aside class="group-side">
        <section class="panel"><div class="panel-head"><h3>Shared files</h3>${role === 'organizer' ? `<button class="link-btn" data-act="add-file" data-ev="${eventId}">${ic('upload')} Upload</button>` : ''}</div>
          ${g.files.length ? g.files.map((f) => `<button class="file" data-act="open-file" data-name="${esc(f.name)}" data-ev="${eventId}">${f.kind === 'flyer' ? `<img src="${IMG(e.img, 120)}" alt=""/>` : `<span class="file-ic">${ic('file')}</span>`}<div><b>${esc(f.name)}</b><span class="tiny muted">${f.size}</span></div>${ic('download')}</button>`).join('') : '<p class="muted small">No files yet.</p>'}
        </section>
        <section class="panel"><h3>Vendors (${members.length})</h3>
          <div class="members">${members.map((v) => `<div class="member ${v.id === ME_VENDOR ? 'me' : ''}"><img src="${IMG(v.photo, 80)}" alt=""/><span>${esc(v.name)}</span></div>`).join('')}</div>
        </section>
      </aside>
    </div>`;
}
