/* Public website + consumer discovery. */

const Views = {};

/* ---------------- Home ---------------- */
Views.home = () => {
  const evs = Store.publicEvents();
  const featured = evs.slice(0, 4);
  return `${publicHeader('home')}
  <section class="hero">
    <div class="hero-photo film film-hero">
      <img src="${IMG(PHOTOS.hero, 2000)}" alt="Shoppers browsing a tree-shaded outdoor market" />
      <span class="hero-stamp">'27 6 7</span>
      <span class="hero-frame">PORTRA 400 · 12A</span>
      <h1 class="hero-wordmark" aria-label="POP/COLLECTIVE"><span>POP<i>/</i></span><span>COLLECTIVE</span></h1>
    </div>
    <div class="hero-side">
      <p class="eyebrow">Montréal · Markets · Pop-ups · Makers</p>
      <h2 class="display-serif">What's happening<br/><em>in Montréal?</em></h2>
      <p class="lead">Independent brands, creative communities and the markets that bring them together — all in one place.</p>
      <form class="hero-search" data-submit="hero-search">
        ${ic('search')}<input name="q" placeholder="Search markets, neighbourhoods, makers…" />
        <button class="btn">Discover</button>
      </form>
      <div class="quick">
        <a href="#/discover?when=summer">This summer</a><a href="#/discover?cat=Vintage">Vintage</a><a href="#/discover?cat=Food%20%26%20Drinks">Food & Drinks</a><a href="#/discover?view=map">Open the map →</a>
      </div>
    </div>
  </section>

  <div class="ticker" aria-hidden="true"><div class="ticker-in">${[0, 1].map(() => evs.map((e) => `<span>${esc(e.title)}</span><i>✶</i><span class="t-date">${fmtDate(e.date, { month: 'short', day: 'numeric' })}</span><i>✶</i>`).join('')).join('')}</div></div>

  <section class="paths">
    <a href="#/discover" class="path">
      <span class="path-n">01</span><h3>Discover events</h3><p>Find markets & pop-ups near you on the map. Free, no account needed.</p><span class="path-go">${ic('arrow')}</span>
    </a>
    <a href="#/for-vendors" class="path">
      <span class="path-n">02</span><h3>For vendors</h3><p>One reusable profile. Apply to curated markets and track every application.</p><span class="path-go">${ic('arrow')}</span>
    </a>
    <a href="#/for-organizers" class="path">
      <span class="path-n">03</span><h3>For organizers</h3><p>Publish your event, set booth pricing, review applicants in one place.</p><span class="path-go">${ic('arrow')}</span>
    </a>
  </section>

  <section class="section">
    <div class="sec-head"><h2 class="display">Coming up</h2><a href="#/discover" class="link">View all ${evs.length} events →</a></div>
    <div class="grid-cards">${featured.map((e) => eventCard(e)).join('')}</div>
  </section>

  <section class="section">
    <div class="sec-head"><h2 class="display">By neighbourhood</h2><a href="#/discover?view=map" class="link">Open the map →</a></div>
    <div class="hoods">${Object.keys(NEIGHBOURHOODS).map((n) => { const list = evs.filter((e) => e.neighbourhood === n); const cover = list[0]?.img || PHOTOS.cobble;
      return `<a href="#/discover?hood=${encodeURIComponent(n)}" class="hood film"><img src="${IMG(cover, 500)}" alt="" loading="lazy"/><div><b>${esc(n)}</b><span>${list.length} event${list.length === 1 ? '' : 's'}</span></div></a>`; }).join('')}</div>
  </section>

  <section class="editorial">
    <div class="ed-photos">
      ${film('photo-1540221652346-e5dd6b50f3e7', 700, 'ed-a')}
      ${film(PHOTOS.flowersBrowse, 700, 'ed-b')}
      <span class="scribble">small brands,<br/>big communities ✶</span>
    </div>
    <div class="ed-text">
      <p class="eyebrow">The collective</p>
      <h2 class="display-serif">A cultural guide first.<br/><em>A smart platform second.</em></h2>
      <p class="lead">POP/COLLECTIVE maps every market, pop-up and maker fair in the city — and gives the people who make them happen the tools to run them.</p>
      <div class="ed-stats"><div><b>${evs.length}</b><span>upcoming events</span></div><div><b>${Object.keys(VENDORS).length * 9}+</b><span>local makers</span></div><div><b>8</b><span>neighbourhoods</span></div></div>
      <a href="#/discover?view=map" class="btn">${ic('map')} Explore the map</a>
    </div>
  </section>
  ${publicFooter()}`;
};

/* ---------------- Discover (shared by consumer + vendor) ---------------- */
const DF = { q: '', cats: [], hood: '', when: '', free: false, view: 'split', active: null };

function filterEvents() {
  return Store.publicEvents().filter((e) => {
    if (DF.q) {
      const hay = (e.title + e.venue + e.neighbourhood + e.categories.join(' ') + e.desc).toLowerCase();
      if (!hay.includes(DF.q.toLowerCase())) return false;
    }
    if (DF.cats.length && !DF.cats.some((c) => e.categories.includes(c))) return false;
    if (DF.hood && e.neighbourhood !== DF.hood) return false;
    if (DF.free && !/free/i.test(e.entry)) return false;
    if (DF.when) {
      const m = parseDate(e.date).getMonth(), y = parseDate(e.date).getFullYear();
      if (DF.when === '2026' && y !== 2026) return false;
      if (DF.when === 'spring' && !(y === 2027 && m >= 2 && m <= 4)) return false;
      if (DF.when === 'summer' && !(y === 2027 && m >= 5 && m <= 7)) return false;
      if (DF.when === 'fall' && !(y === 2027 && m >= 8)) return false;
    }
    return true;
  });
}

function discoverFilters() {
  const usedCats = CATEGORIES.filter((c) => Store.publicEvents().some((e) => e.categories.includes(c)));
  return `<div class="filters">
    <div class="f-search">${ic('search')}<input data-input="df-q" value="${esc(DF.q)}" placeholder="Search events, venues, keywords…" /></div>
    <div class="f-row">
      <select data-change="df-when">
        <option value="">Any date</option>
        <option value="2026" ${DF.when === '2026' ? 'selected' : ''}>Holidays 2026</option>
        <option value="spring" ${DF.when === 'spring' ? 'selected' : ''}>Spring 2027</option>
        <option value="summer" ${DF.when === 'summer' ? 'selected' : ''}>Summer 2027</option>
        <option value="fall" ${DF.when === 'fall' ? 'selected' : ''}>Fall 2027</option>
      </select>
      <select data-change="df-hood">
        <option value="">All neighbourhoods</option>
        ${Object.keys(NEIGHBOURHOODS).map((n) => `<option ${DF.hood === n ? 'selected' : ''}>${n}</option>`).join('')}
      </select>
      <label class="check"><input type="checkbox" data-change="df-free" ${DF.free ? 'checked' : ''}/> Free entry</label>
      <button class="link-btn" data-act="df-clear">Clear all</button>
    </div>
    <div class="chips">${usedCats.map((c) => `<button class="chip ${DF.cats.includes(c) ? 'on' : ''}" data-act="df-cat" data-cat="${esc(c)}">${esc(c)}</button>`).join('')}</div>
  </div>`;
}

function discoverBody(role) {
  return `<div class="disc disc-${DF.view}">
    <div class="disc-bar">
      <p id="disc-count" class="muted"></p>
      <div class="seg">
        <button class="${DF.view === 'split' ? 'on' : ''}" data-act="df-view" data-v="split">${ic('grid')} Split</button>
        <button class="${DF.view === 'list' ? 'on' : ''}" data-act="df-view" data-v="list">${ic('list')} List</button>
        <button class="${DF.view === 'map' ? 'on' : ''}" data-act="df-view" data-v="map">${ic('map')} Map</button>
      </div>
    </div>
    <div class="disc-grid">
      <div id="disc-results" class="disc-results"></div>
      <div class="disc-map-wrap"><div id="disc-map" class="disc-canvas"></div><div id="map-card" class="map-card"></div></div>
    </div>
  </div>`;
}

let discMarkers = {};
function mountDiscover(role) {
  const map = makeMap('disc-map', [45.515, -73.585], 12, { scroll: true });
  window.__discMap = map;
  window.__discRole = role;
  updateDiscover();
  map.on('load', () => map.resize());
  map.on('click', () => { DF.active = null; Object.values(discMarkers).forEach((m) => m.setActive(false)); document.getElementById('map-card').innerHTML = ''; });
}

// Hovering a card highlights its pin on the map.
document.addEventListener('mouseover', (ev) => {
  const card = ev.target.closest('.disc-results .ecard');
  if (!card || !window.__discMap) return;
  const id = card.querySelector('[data-id]')?.dataset.id;
  Object.entries(discMarkers).forEach(([k, m]) => m.setActive(k === id || k === DF.active));
});

function updateDiscover() {
  const role = window.__discRole || 'consumer';
  const list = filterEvents();
  const res = document.getElementById('disc-results');
  if (!res) return;
  document.getElementById('disc-count').innerHTML = `<b>${list.length}</b> event${list.length === 1 ? '' : 's'} in Montréal`;
  res.innerHTML = list.length ? `<div class="grid-cards ${DF.view === 'list' ? 'wide' : ''}">${list.map((e) => eventCard(e, role)).join('')}</div>`
    : emptyState('search', 'No events match', 'Try removing a filter or searching another neighbourhood.', '<button class="btn btn-ghost" data-act="df-clear">Clear filters</button>');
  const map = window.__discMap;
  if (!map) return;
  Object.values(discMarkers).forEach((m) => m.remove());
  discMarkers = {};
  list.forEach((e) => {
    discMarkers[e.id] = addPin(map, e.lat, e.lng, {
      active: DF.active === e.id,
      onClick: () => {
        DF.active = e.id; showMapCard(e, role);
        Object.entries(discMarkers).forEach(([id, m]) => m.setActive(id === e.id));
        map.easeTo({ center: [e.lng, e.lat], zoom: Math.max(map.getZoom(), 13), duration: 600 });
      },
    });
  });
  if (list.length > 1 && (DF.cats.length || DF.hood || DF.when || DF.q || DF.free)) {
    const b = new maplibregl.LngLatBounds();
    list.forEach((e) => b.extend([e.lng, e.lat]));
    map.fitBounds(b, { padding: 70, maxZoom: 14, duration: 600 });
  } else if (list.length === 1) map.easeTo({ center: [list[0].lng, list[0].lat], zoom: 14, duration: 600 });
  if (DF.active && list.find((e) => e.id === DF.active)) showMapCard(Store.event(DF.active), role);
  else document.getElementById('map-card').innerHTML = '';
}

function showMapCard(e, role) {
  const href = role === 'vendor' ? `#/v/event/${e.id}` : `#/event/${e.id}`;
  document.getElementById('map-card').innerHTML = `<a href="${href}" class="mapcard-in">
    <img src="${IMG(e.img, 240)}" alt="" />
    <div><h4>${esc(e.title)}</h4><p>${fmtDate(e.date, { month: 'short', day: 'numeric', year: 'numeric' })} · ${fmtTime(e.start)}–${fmtTime(e.end)}</p><p>${esc(e.venue)}, ${esc(e.neighbourhood)}</p>${tags(e.categories, 2)}</div>
    <span class="mapcard-go">${ic('arrow')}</span></a>`;
}

Views.discover = (params) => {
  applyDiscoverParams(params);
  return `${publicHeader('discover')}
  <section class="page-head"><h1 class="display">Discover</h1><p class="lead">Markets, pop-ups and maker fairs across Montréal — always free to browse.</p></section>
  <section class="section tight">${discoverFilters()}${discoverBody('consumer')}</section>
  ${publicFooter()}`;
};
Views.discover.mount = () => mountDiscover('consumer');

function applyDiscoverParams(params) {
  if (!params) return;
  if (params.get('cat')) DF.cats = [params.get('cat')];
  if (params.get('q') !== null) DF.q = params.get('q') || '';
  if (params.get('when')) DF.when = params.get('when');
  if (params.get('view')) DF.view = params.get('view');
  if (params.get('hood')) DF.hood = params.get('hood');
}

/* ---------------- Event detail (consumer) ---------------- */
Views.event = (_, id) => {
  const e = Store.event(id);
  if (!e || e.status !== 'published') return `${publicHeader()}${emptyState('cal', 'Event not found', 'This event may still be a draft.', '<a class="btn" href="#/discover">Back to discover</a>')}`;
  const org = ORGANIZERS[e.organizerId];
  const saved = Store.s.savedConsumer.includes(e.id);
  const vendors = Store.appsForEvent(e.id).filter((a) => a.status === 'accepted').map((a) => VENDORS[a.vendorId]);
  const gallery = [e.img, ...e.gallery].slice(0, 4);
  const info = [
    ['pin', 'Location', `${e.venue}<br/><span class="muted">${e.address}</span>`],
    ['metro', 'Nearest metro', e.metro],
    ['parking', 'Parking', e.parking],
    ['access', 'Accessibility', e.access],
    ['paw', 'Pets', e.pets],
    ['ticket', 'Entry', e.entry],
  ];
  return `${publicHeader('discover')}
  <div class="wrap">
    <a href="#/discover" class="back">${ic('back')} Back to events</a>
    <div class="ev-top">
      <div class="ev-gallery g${gallery.length}">${gallery.map((g, i) => film(g, i === 0 ? 1200 : 500, 'g' + i)).join('')}</div>
      <div class="ev-head">
        <div class="ev-actions">
          <button class="icon-btn lg ${saved ? 'on' : ''}" data-act="toggle-save" data-id="${e.id}" data-role="consumer" title="Save">${ic('heart')}</button>
          <button class="icon-btn lg" data-act="share" title="Share">${ic('share')}</button>
        </div>
        <span class="eyebrow">${e.organizerId === 'pc-team' ? 'Curated by POP/COLLECTIVE' : e.claimed ? 'Verified organizer · claimed listing' : e.source === 'admin' ? 'Curated by POP/COLLECTIVE' : 'Verified organizer'} · ${esc(e.neighbourhood)}</span>
        <h1 class="display-serif">${esc(e.title)}</h1>
        <p class="ev-meta">${ic('cal')} ${fmtLong(e.date)} · ${fmtTime(e.start)} – ${fmtTime(e.end)}</p>
        <p class="ev-meta">${ic('pin')} ${esc(e.venue)}, ${esc(e.address)}</p>
        <div class="row gap ev-links"><a class="btn sm" target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(e.venue + ', ' + e.address)}">${ic('pin')} Get directions</a>
          <button class="btn sm btn-ghost" data-act="ics" data-id="${e.id}">${ic('cal')} Add to calendar</button></div>
        ${tags(e.categories, 5)}
        <p class="ev-desc">${esc(e.desc)}</p>
        <div class="org-card">
          ${org.photo ? `<img src="${IMG(org.photo, 120)}" alt="" />` : `<span class="org-ph">${org.org[0]}</span>`}
          <div><span class="tiny muted">Organized by</span><strong>${esc(org.org)}</strong><span class="muted small">${esc(org.handle)}</span></div>
        </div>
      </div>
    </div>

    <h2 class="h2">Practical information</h2>
    <div class="info-grid">${info.map(([i, l, v]) => `<div class="info">${ic(i)}<span class="tiny muted">${l}</span><p>${v}</p></div>`).join('')}</div>

    <div class="ev-two">
      <div><div id="ev-map" class="ev-map"></div></div>
      <div class="schedule">
        <h3>Event schedule</h3>
        ${e.schedule.map(([t, l]) => `<div class="sched-row"><span>${fmtTime(t)}</span><span>${esc(l)}</span></div>`).join('')}
      </div>
    </div>

    <div class="sec-head"><h2 class="h2">Vendors at this event <span class="muted">(${vendors.length})</span></h2></div>
    ${vendors.length ? `<div class="vendor-grid">${vendors.map((v) => `<a href="#/maker/${v.id}" class="vcard ${v.id === ME_VENDOR ? 'just' : ''}">
      ${film(v.photo, 400)}<strong>${esc(v.name)}</strong><span class="muted small">${esc(v.category)}</span><span class="tiny muted">${esc(v.handle)}</span></a>`).join('')}</div>`
      : `<p class="muted">The vendor list will be announced soon.</p>`}
  </div>
  ${publicFooter()}`;
};
Views.event.mount = (_, id) => {
  const e = Store.event(id);
  if (!e || !document.getElementById('ev-map')) return;
  const m = makeMap('ev-map', [e.lat, e.lng], 15, { cooperative: true });
  const pin = addPin(m, e.lat, e.lng, { active: true, popup: `<b>${esc(e.venue)}</b><br/>${esc(e.metro)}` });
  m.on('load', () => pin.marker.togglePopup());
};

/* ---------------- Public vendor (maker) profile ---------------- */
Views.maker = (_, id) => {
  const v = VENDORS[id];
  if (!v) return emptyState('user', 'Maker not found', '');
  const isMe = id === ME_VENDOR;
  const p = Store.s.profile;
  const photos = isMe ? p.photos : [v.photo];
  const upcoming = Store.s.applications.filter((a) => a.vendorId === id && a.status === 'accepted').map((a) => Store.event(a.eventId)).filter((e) => e.status === 'published');
  return `${publicHeader()}
  <div class="wrap">
    <a href="javascript:history.back()" class="back">${ic('back')} Back</a>
    <div class="maker">
      <div class="maker-id">
        <img class="maker-av" src="${IMG(v.photo, 300)}" alt="" />
        <div><h1 class="display-serif">${esc(v.name)}</h1><p class="muted">${esc(isMe ? p.category : v.category)} · Montréal, QC</p><p class="small">${esc(v.handle)}${v.site ? ' · ' + esc(v.site) : ''}</p></div>
        <button class="btn sm" data-act="follow">Follow</button>
      </div>
      <div class="maker-body">
        <div><h3>About the brand</h3><p>${esc(isMe ? p.description : v.bio)}</p>
          <h3>Upcoming events</h3>
          ${upcoming.length ? upcoming.map((e) => `<a href="#/event/${e.id}" class="mini-ev"><img src="${IMG(e.img, 160)}" alt=""/><div><strong>${esc(e.title)}</strong><span class="muted small">${fmtDate(e.date)} · ${esc(e.venue)}</span></div></a>`).join('') : '<p class="muted">No upcoming events yet.</p>'}
        </div>
        <div class="maker-photos">${photos.map((ph) => film(ph, 500)).join('')}</div>
      </div>
    </div>
  </div>
  ${publicFooter()}`;
};

/* ---------------- Saved (simulated login) ---------------- */
Views.saved = () => {
  const u = Store.s.consumerUser;
  const evs = Store.s.savedConsumer.map((id) => Store.event(id)).filter(Boolean);
  return `${publicHeader('saved')}
  <section class="page-head"><h1 class="display">Saved</h1><p class="lead">${u ? `Your favourite markets, ${esc(u.name)}.` : 'Save events with a free account and get reminders before they happen.'}</p></section>
  <section class="section tight">
    ${!u ? `<div class="cta-card">${ic('bookmark')}<div><h3>Create a free account to keep your list</h3><p class="muted">Discovery is always free. An account just remembers your favourites.</p></div><button class="btn" data-act="login">Create free account</button></div>` : ''}
    ${evs.length ? `<div class="grid-cards">${evs.map((e) => eventCard(e)).join('')}</div>` : emptyState('heart', 'Nothing saved yet', 'Tap the heart on any event to save it here.', '<a class="btn" href="#/discover">Discover events</a>')}
  </section>
  ${publicFooter()}`;
};

/* ---------------- Landing pages for vendors / organizers ---------------- */
function roleLanding(kind) {
  const v = kind === 'vendor';
  const img = v ? PHOTOS.rackStreet : PHOTOS.festival;
  const scribble = v ? 'for creative people,<br/>by creative people.' : 'communities,<br/>brands, events —<br/>together ✶';
  const points = v
    ? [['store', 'One reusable profile', 'Your brand, photos and usual answers — prefilled on every application.'], ['search', 'Curated opportunities', 'Filter markets by date, neighbourhood, category and booth price.'], ['clock', 'Real-time status', 'Pending, accepted, waitlisted — always know where you stand.'], ['msg', 'Event groups', 'Once accepted, get announcements, files and the vendor chat.']]
    : [['cal', 'Publish in minutes', 'Create your event, set booth pricing, save as draft or publish.'], ['file', 'One application form', 'Standard vendor fields plus up to four custom questions.'], ['users', 'Review in one place', 'Accept, waitlist or reject — with estimated revenue updating live.'], ['megaphone', 'Talk to your vendors', 'Announcements, shared flyers and files for accepted vendors.']];
  return `${publicHeader(v ? 'vendors' : 'organizers')}
  <section class="role-hero">
    <div class="film role-hero-img"><img src="${IMG(img, 1600)}" alt="" /><span class="scribble light">${scribble}</span>
      <h1 class="role-title">${v ? 'Turn your passion<br/>into pop-ups.' : 'Create<br/>unforgettable<br/>events.'}</h1></div>
    <div class="role-copy">
      <p class="eyebrow">${v ? 'For vendors' : 'For organizers'}</p>
      <h2 class="display-serif">${v ? 'Find markets. Meet communities. <em>Grow your brand.</em>' : 'Bring people, brands and <em>culture together.</em>'}</h2>
      <div class="role-points">${points.map(([i, t, d]) => `<div>${ic(i)}<h4>${t}</h4><p class="muted">${d}</p></div>`).join('')}</div>
      <div class="row gap">
        <a class="btn" href="#/join/${kind}">${ic('sparkle')} Create an account</a>
        <a class="btn btn-ghost" href="${v ? '#/v' : '#/o'}">${v ? 'Vendor dashboard' : 'Organizer dashboard'} (demo)</a>
        <a class="link" href="#/membership?tab=${kind}">See membership plans →</a>
      </div>
    </div>
  </section>
  ${publicFooter()}`;
}
Views.forVendors = () => roleLanding('vendor');
Views.forOrganizers = () => roleLanding('organizer');

/* ---------------- Membership ---------------- */
Views.membership = (params) => {
  const tab = params?.get('tab') || 'vendor';
  const plans = tab === 'vendor'
    ? [{ n: 'Starter', p: '$XX', f: ['Apply to events', 'Reusable brand profile', 'Application tracking', 'Event groups'] },
      { n: 'Pro', p: '$XX', pop: true, f: ['Everything in Starter', 'Featured maker profile', 'Early access to curated markets', 'Application insights'] }]
    : [{ n: 'Basic', p: '$XX', f: ['Up to 3 active events', 'Booth pricing & application form', 'Applicant review', 'Event group'] },
      { n: 'Pro', p: '$XX', pop: true, f: ['Unlimited events', 'Featured on the map', 'Bulk accept & waitlist', 'Revenue estimates & analytics'] }];
  return `${publicHeader()}
  <section class="page-head center"><p class="eyebrow">Membership</p><h1 class="display">Choose your plan</h1><p class="lead">Placeholder pricing for the prototype. Consumers always browse for free.</p>
    <div class="seg center-seg">
      <a class="${tab === 'vendor' ? 'on' : ''}" href="#/membership?tab=vendor">Vendors</a>
      <a class="${tab === 'organizer' ? 'on' : ''}" href="#/membership?tab=organizer">Organizers</a>
    </div>
  </section>
  <section class="section tight plans">
    <div class="plan free"><h3>Consumer</h3><p class="price">Free<span> forever</span></p><ul><li>${ic('check')} Browse every event & the map</li><li>${ic('check')} Save favourites</li><li>${ic('check')} Follow makers</li></ul><a class="btn btn-ghost" href="#/discover">Start exploring</a></div>
    ${plans.map((pl) => `<div class="plan ${pl.pop ? 'pop' : ''}">${pl.pop ? '<span class="pop-tag">Most popular</span>' : ''}<h3>${tab === 'vendor' ? 'Vendor' : 'Organizer'} ${pl.n}</h3><p class="price">${pl.p}<span> / month</span></p>
      <ul>${pl.f.map((f) => `<li>${ic('check')} ${f}</li>`).join('')}</ul>
      <button class="btn ${pl.pop ? '' : 'btn-ghost'}" data-act="choose-plan" data-plan="${tab} ${pl.n}">Get started</button></div>`).join('')}
  </section>
  <p class="center muted small">No payment is processed in this prototype.</p>
  ${publicFooter()}`;
};

/* ---------------- Brand board ---------------- */
Views.brand = () => {
  const sw = (n, h, light) => `<div class="sw" style="background:${h};color:${light ? '#3D2D2E' : '#FCF8EC'}"><b>${n}</b><span>${h}</span></div>`;
  return `${publicHeader('brand')}
  <section class="page-head"><p class="eyebrow">Brand / UI direction</p><h1 class="display">Nostalgic in feeling.<br/>Contemporary in function.</h1></section>
  <section class="section tight">
    <h2 class="h2">Logo treatments</h2>
    <div class="logo-grid">
      <div class="logo-tile cream">${wordmark('inline', 'xl')}<span class="tiny muted">Primary · inline</span></div>
      <div class="logo-tile brand">${wordmark('stacked', 'xl')}<span class="tiny">Alternate · stacked “POP//”</span></div>
      <div class="logo-tile photo film"><img src="${IMG(PHOTOS.tents, 900)}" alt="" />${wordmark('stacked', 'xl')}<span class="tiny">Over photography</span></div>
      <div class="logo-tile cream"><span class="wm-mono">P/C</span><span class="tiny muted">Monogram · app icon & stamps</span></div>
    </div>

    <h2 class="h2">Colour palettes</h2>
    <div class="pal-grid">
      <div class="pal"><div class="pal-head"><h3>Palette B — Orange & Cream</h3><button class="btn sm" data-act="palette" data-p="b">${Store.s.palette === 'b' ? 'Active' : 'Apply'}</button></div>
        <div class="sws">${sw('Burnt orange', '#D45B32')}${sw('Soft orange', '#E8A67E', 1)}${sw('Pale yellow', '#F6EEC9', 1)}${sw('Warm cream', '#FCF8EC', 1)}</div></div>
      <div class="pal"><div class="pal-head"><h3>Palette A — Chocolate & Butter</h3><button class="btn sm btn-ghost" data-act="palette" data-p="a">${Store.s.palette === 'a' ? 'Active' : 'Apply'}</button></div>
        <div class="sws">${sw('Chocolate', '#3D2D2E')}${sw('Light brown', '#BDAA95', 1)}${sw('Butter yellow', '#F1E7A6', 1)}${sw('Cream', '#F8F4E8', 1)}</div></div>
    </div>

    <h2 class="h2">Typography</h2>
    <div class="type-grid">
      <div><span class="tiny muted">Display · Bricolage Grotesque</span><p class="t-display">Small brands.<br/>Big communities.</p></div>
      <div><span class="tiny muted">Editorial · Fraunces</span><p class="t-serif">What's happening <em>in Montréal?</em></p></div>
      <div><span class="tiny muted">Interface · Inter</span><p class="t-ui">Applications · Booth pricing · Accept · Waitlist · Reject</p><span class="tiny muted">Accent · Caveat</span><p class="scribble static">good people, great events ✶</p></div>
    </div>

    <h2 class="h2">Responsive — mobile</h2>
    <p class="muted">Live, fully clickable phone previews of the same prototype.</p>
    <div class="phones">
      <div class="phone"><iframe src="?embed=1#/" title="Mobile home"></iframe></div>
      <div class="phone"><iframe src="?embed=1#/event/mile-end" title="Mobile event"></iframe></div>
      <div class="phone"><iframe src="?embed=1#/v/applications" title="Mobile vendor"></iframe></div>
    </div>
  </section>
  ${publicFooter()}`;
};
