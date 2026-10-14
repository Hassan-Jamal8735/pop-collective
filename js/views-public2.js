/* Public experience v3 — makers directory, journal, about, global search, home sections, event extras. */

const JOURNAL = [
  {
    id: 'mile-end-saturday', kind: 'Neighbourhood guide', title: 'A Saturday in Mile End: the vintage lover’s route', mins: 6, date: '2026-10-08', img: PHOTOS.rackStreet,
    dek: 'Bagels, bookshops and one very good courtyard market — how to spend a whole day digging through the best vintage in the city.',
    body: [
      ['p', 'Mile End rewards the slow walker. Start early on Saint-Viateur with a sesame bagel still warm from the oven, then drift south — the neighbourhood’s best finds are rarely on the main streets.'],
      ['h', '10:00 — Coffee and a plan'],
      ['p', 'Grab a cortado and mark your map. On market weekends the crowd builds after noon, so the serious diggers arrive the moment the doors open.'],
      ['event', 'mile-end'],
      ['h', '11:00 — Into the courtyard'],
      ['p', 'Le Livart’s courtyard becomes a maze of racks and tables: archival denim, 70s suede, records and ceramics. Talk to the sellers — every piece has a story, and most of them love telling it.'],
      ['q', 'We bring one rack, but every piece on it has been mended, cleaned and loved before it gets there.', 'Atelier Nord'],
      ['maker', 'v-atelier-nord'],
      ['h', '15:00 — Stay for the DJ set'],
      ['p', 'By mid-afternoon the market turns into a block party. Find a spot on the steps, show off your haul, and let the city do the rest.'],
    ],
  },
  {
    id: 'meet-atelier-nord', kind: 'Vendor spotlight', title: 'Atelier Nord on giving clothes a second life', mins: 4, date: '2026-09-30', img: 'photo-1551232864-3f0890e580d9',
    dek: 'We sat down with the duo behind one of Montreal’s most tightly curated vintage racks.',
    body: [
      ['p', 'Atelier Nord started as a weekend habit: two friends trading finds from estate sales across Québec. Three years later, their rack is one of the first to sell out at any market they join.'],
      ['q', 'Curating is mostly saying no. We’d rather bring twenty perfect pieces than two hundred okay ones.', 'Atelier Nord'],
      ['h', 'Why markets, not a shop?'],
      ['p', 'Markets let them meet the people who wear their pieces. “Online you sell a jacket. At a market you watch someone fall in love with it.”'],
      ['maker', 'v-atelier-nord'],
      ['event', 'mile-end'],
    ],
  },
  {
    id: 'flea-like-a-local', kind: 'How to', title: 'How to shop a flea market like a local', mins: 3, date: '2026-09-18', img: PHOTOS.streetMarket,
    dek: 'Cash, a tote and the courage to ask “what’s the story?” — six small habits that make a big difference.',
    body: [
      ['p', 'Montreal’s markets are friendly, but a few habits will make your day smoother — and help the small brands behind every table.'],
      ['tips', ['Arrive early for the best pieces, late for the best deals.', 'Bring a tote — many vendors are plastic-free.', 'Carry a little cash, even though most take cards.', 'Ask about the story behind a piece. Vendors love to tell it.', 'Follow your favourite vendors to find their next market.', 'Check the event page for metro and parking before you go.']],
      ['event', 'verdun'],
    ],
  },
  {
    id: 'night-markets', kind: 'Culture', title: 'After dark: the rise of Montreal’s night markets', mins: 5, date: '2026-09-05', img: PHOTOS.nightBun,
    dek: 'String lights, natural wine and late-night vendors — why the city’s best markets are moving into the evening.',
    body: [
      ['p', 'Summer evenings in Montreal are long and loud, and markets are following the crowd. Night markets mix food stalls with vendors, DJs and a slower, social pace.'],
      ['q', 'People don’t come to shop and leave. They come to stay — the market is the night out.', 'Marché Nocturne MTL'],
      ['event', 'nocturne'],
    ],
  },
];

const QUOTES = [
  ['I used to find markets through ten different Instagram accounts. Now it’s one map.', 'Léa, Rosemont', 'Consumer'],
  ['One profile, and every application fills itself in. I applied to four markets in an evening.', 'Atelier Nord', 'Vendor'],
  ['Accepting vendors and knowing my booth revenue at a glance changed how I plan.', 'Camille, Montreal Makers Collective', 'Organizer'],
];

const HOW = {
  consumers: [['search', 'Discover', 'Browse every market on one map — filter by date, neighbourhood and vibe.'], ['heart', 'Save & follow', 'Keep a list of favourites and follow the vendors you love.'], ['pin', 'Go', 'Metro, parking and accessibility on every event page.']],
  vendors: [['store', 'Build one profile', 'Your brand, photos and usual answers — saved once.'], ['file', 'Apply in minutes', 'Pick a booth; your profile prefills the application.'], ['msg', 'Get accepted', 'Track status and join the event group for day-of details.']],
  organizers: [['cal', 'Publish', 'Create your event, booth pricing and application form.'], ['users', 'Review', 'Accept, waitlist or reject — revenue updates live.'], ['megaphone', 'Run the day', 'Announcements, flyers and files for every accepted vendor.']],
};

const CITY_VOTES = { 'Québec City': 312, Toronto: 486, Ottawa: 201, Vancouver: 264 };

const isFollowing = (id) => (Store.s.followed || []).includes(id);
const followBtn = (id, cls = 'sm') => `<button class="btn ${cls} ${isFollowing(id) ? 'btn-ghost' : ''}" data-act="follow" data-id="${id}">${isFollowing(id) ? `${ic('check')} Following` : 'Follow'}</button>`;
const upcomingFor = (vid) => Store.s.applications.filter((a) => a.vendorId === vid && a.status === 'accepted').map((a) => Store.event(a.eventId)).filter((e) => e && e.status === 'published');

function makerCard(v) {
  const n = upcomingFor(v.id).length;
  return `<article class="mcard">
    <a href="#/maker/${v.id}" class="mcard-img">${film(v.photo, 500, '', v.name)}</a>
    <div class="mcard-body"><a href="#/maker/${v.id}"><h3>${esc(v.name)}</h3><p class="muted small">${esc(v.category)} · ${n ? `${n} upcoming market${n > 1 ? 's' : ''}` : 'Montreal'}</p></a>${followBtn(v.id)}</div>
  </article>`;
}

function articleCard(a, big = false) {
  return `<a href="#/journal/${a.id}" class="acard ${big ? 'big' : ''}">${film(a.img, big ? 1100 : 600)}
    <div><span class="eyebrow">${esc(a.kind)} · ${a.mins} min read</span><h3>${esc(a.title)}</h3>${big ? `<p class="muted">${esc(a.dek)}</p>` : ''}</div></a>`;
}

/* ---------- Home sections (inserted into Views.home) ---------- */
function homeExtras() {
  const makers = Object.values(VENDORS).slice(0, 8);
  return `
  <section class="section">
    <div class="sec-head"><div><p class="eyebrow">Small brands</p><h2 class="display">Meet the vendors</h2></div><a href="#/makers" class="link">All vendors →</a></div>
    <div class="hscroll">${makers.map(makerCard).join('')}</div>
  </section>

  <section class="section">
    <div class="how">
      <div class="how-head"><p class="eyebrow">How it works</p><h2 class="display-serif">One platform,<br/><em>three ways in.</em></h2>
        <div class="seg how-seg">${['consumers', 'vendors', 'organizers'].map((k, i) => `<button class="${i === 0 ? 'on' : ''}" data-act="how" data-k="${k}">For ${k}</button>`).join('')}</div></div>
      ${Object.entries(HOW).map(([k, steps], i) => `<div class="how-steps ${i === 0 ? 'on' : ''}" data-how="${k}">${steps.map(([icn, t, d], n) => `<div class="how-step"><span class="how-n">0${n + 1}</span>${ic(icn)}<h3>${t}</h3><p class="muted">${d}</p></div>`).join('')}
        <a class="btn" href="${k === 'consumers' ? '#/discover' : `#/join/${k.slice(0, -1)}`}">${k === 'consumers' ? 'Start exploring' : `Join as ${k.slice(0, -1)}`} ${ic('arrow')}</a></div>`).join('')}
    </div>
  </section>`;
}

function homeExtras2() {
  return `
  <section class="section">
    <div class="sec-head"><div><p class="eyebrow">The journal</p><h2 class="display">Stories from the markets</h2></div><a href="#/journal" class="link">Read the journal →</a></div>
    <div class="journal-grid">${articleCard(JOURNAL[0], true)}<div class="journal-side">${JOURNAL.slice(1, 4).map((a) => articleCard(a)).join('')}</div></div>
  </section>

  <section class="section">
    <div class="quotes">${QUOTES.map(([q, who, role]) => `<figure class="quote"><blockquote>“${esc(q)}”</blockquote><figcaption><b>${esc(who)}</b><span class="tag">${role}</span></figcaption></figure>`).join('')}</div>
  </section>

  ${newsletterBlock()}`;
}

function newsletterBlock() {
  const done = Store.s.newsletter;
  return `<section class="section"><div class="newsletter film">
    <img src="${IMG(PHOTOS.festival, 1600)}" alt="" loading="lazy"/>
    <div class="nl-in">
      <p class="eyebrow light">Every Thursday</p>
      <h2 class="display">The Weekend Edit</h2>
      <p>The best markets and pop-ups in Montreal this weekend — hand-picked, in your inbox. No spam, just good plans.</p>
      ${done ? `<p class="nl-done">${ic('check')} You're on the list — see you Thursday.</p>`
        : `<form class="nl-form" data-submit="newsletter"><input name="email" type="email" required placeholder="you@email.com"/><button class="btn">Subscribe</button></form>`}
      <span class="scribble light">see you<br/>at the market ✶</span>
    </div>
  </div></section>`;
}

/* ---------- Makers directory ---------- */
const MF = { q: '', cat: '' };
Views.makers = () => {
  const cats = [...new Set(Object.values(VENDORS).map((v) => v.category.split(' / ')[0]))];
  return `${publicHeader('makers')}
  <section class="page-head"><p class="eyebrow">Small brands, big communities</p><h1 class="display">Vendors</h1><p class="lead">The independent brands behind Montreal’s markets. Follow them to know where they pop up next.</p></section>
  <section class="section tight">
    <div class="filters"><div class="f-search">${ic('search')}<input data-input="mf-q" value="${esc(MF.q)}" placeholder="Search vendors…"/></div>
      <div class="chips"><button class="chip ${MF.cat ? '' : 'on'}" data-act="mf-cat" data-cat="">All</button>${cats.map((c) => `<button class="chip ${MF.cat === c ? 'on' : ''}" data-act="mf-cat" data-cat="${esc(c)}">${esc(c)}</button>`).join('')}</div></div>
    <div id="makers-grid"></div>
  </section>
  ${publicFooter()}`;
};
Views.makers.mount = () => updateMakers();
function updateMakers() {
  const el = document.getElementById('makers-grid'); if (!el) return;
  const list = Object.values(VENDORS).filter((v) => (!MF.cat || v.category.startsWith(MF.cat)) && (!MF.q || (v.name + v.category + v.bio).toLowerCase().includes(MF.q.toLowerCase())));
  el.innerHTML = list.length ? `<div class="maker-grid">${list.map(makerCard).join('')}</div>` : emptyState('search', 'No vendors found', 'Try another search.');
}

/* ---------- Journal ---------- */
Views.journal = () => `${publicHeader('journal')}
  <section class="page-head"><p class="eyebrow">The journal</p><h1 class="display">Stories from<br/>the markets</h1><p class="lead">Neighbourhood guides, vendor spotlights and the culture behind Montreal’s pop-up scene.</p></section>
  <section class="section tight">
    ${articleCard(JOURNAL[0], true)}
    <div class="grid-cards journal-list">${JOURNAL.slice(1).map((a) => articleCard(a)).join('')}</div>
  </section>
  ${newsletterBlock()}
  ${publicFooter()}`;

Views.article = (_, id) => {
  const a = JOURNAL.find((x) => x.id === id);
  if (!a) return `${publicHeader('journal')}${emptyState('file', 'Story not found', '', '<a class="btn" href="#/journal">Back to the journal</a>')}`;
  const block = ([type, val, who]) => {
    if (type === 'p') return `<p>${esc(val)}</p>`;
    if (type === 'h') return `<h2>${esc(val)}</h2>`;
    if (type === 'q') return `<blockquote class="pull">“${esc(val)}”<cite>— ${esc(who)}</cite></blockquote>`;
    if (type === 'tips') return `<ol class="tips">${val.map((t) => `<li>${esc(t)}</li>`).join('')}</ol>`;
    if (type === 'event') { const e = Store.event(val); return e && e.status === 'published' ? `<a href="#/event/${e.id}" class="inline-ev"><img src="${IMG(e.img, 300)}" alt=""/><div><span class="eyebrow">Featured event</span><b>${esc(e.title)}</b><span class="muted small">${fmtLong(e.date)} · ${esc(e.venue)}</span></div>${ic('arrow')}</a>` : ''; }
    if (type === 'maker') { const v = VENDORS[val]; return `<div class="inline-maker"><img src="${IMG(v.photo, 200)}" alt=""/><div><span class="eyebrow">Vendor</span><b>${esc(v.name)}</b><span class="muted small">${esc(v.category)}</span></div>${followBtn(v.id)}</div>`; }
    return '';
  };
  const more = JOURNAL.filter((x) => x.id !== id).slice(0, 3);
  return `${publicHeader('journal')}
  <article class="article">
    <a href="#/journal" class="back">${ic('back')} The journal</a>
    <header class="art-head"><span class="eyebrow">${esc(a.kind)} · ${a.mins} min read · ${fmtDate(a.date)}</span><h1 class="display-serif">${esc(a.title)}</h1><p class="lead">${esc(a.dek)}</p></header>
    ${film(a.img, 1600, 'art-hero')}
    <div class="art-body">${a.body.map(block).join('')}
      <div class="art-share"><span class="muted small">Share this story</span><button class="btn sm btn-ghost" data-act="share">${ic('share')} Copy link</button></div>
    </div>
  </article>
  <section class="section"><h2 class="h2">Keep reading</h2><div class="grid-cards">${more.map((x) => articleCard(x)).join('')}</div></section>
  ${publicFooter()}`;
};

/* ---------- About ---------- */
Views.about = () => {
  const votes = Store.s.cityVotes || {};
  const total = Object.entries(CITY_VOTES).reduce((s, [c, n]) => s + n + (votes[c] ? 1 : 0), 0);
  const faqs = [
    ['Is POP/COLLECTIVE free for consumers?', 'Yes — discovering events, using the map and saving favourites is always free.'],
    ['How do vendors apply to markets?', 'Vendors build one reusable brand profile. Applying to any market prefills from it, and every application is tracked in one dashboard.'],
    ['Do payments go through the platform?', 'Not in this first phase. Organizers see estimated booth revenue; vendors pay organizers directly, as they do today.'],
    ['I organize a market that is already listed. Can I manage it?', 'Yes. Request to claim the listing — after a quick verification, you manage the same event page, with its saves and map pin intact.'],
    ['Which cities are you in?', 'Montreal first. Vote below for where we should pop up next.'],
  ];
  return `${publicHeader('about')}
  <section class="about-hero">
    <div><p class="eyebrow">About</p><h1 class="display">A cultural guide first.<br/>A smart platform second.</h1>
      <p class="lead">POP/COLLECTIVE started in Montreal with a simple frustration: the city’s best markets were scattered across flyers, group chats and a hundred Instagram accounts. We’re bringing them — and the people who make them — into one place.</p></div>
    ${film(PHOTOS.crowd, 1200, 'about-img')}
  </section>
  <section class="section">
    <div class="values">
      ${[['Independent first', 'We exist for small brands and the organizers who give them a stage.'], ['Culture, not commerce', 'Markets are where neighbourhoods meet. We design for the day out, not just the transaction.'], ['Montreal-made', 'Built locally, neighbourhood by neighbourhood — then city by city.']].map(([t, d], i) => `<div class="value"><span class="how-n">0${i + 1}</span><h3>${t}</h3><p class="muted">${d}</p></div>`).join('')}
    </div>
  </section>
  <section class="section">
    <div class="vote">
      <div><p class="eyebrow">Next stop</p><h2 class="display-serif">Where should we<br/><em>pop up next?</em></h2><p class="muted">Every event in our database already carries a city — expanding is a switch, not a rebuild.</p></div>
      <div class="vote-list">${Object.entries(CITY_VOTES).map(([c, n]) => { const mine = !!votes[c]; const v = n + (mine ? 1 : 0); return `<button class="vote-row ${mine ? 'on' : ''}" data-act="vote" data-city="${c}"><span>${c}</span><div class="vbar"><i style="width:${Math.round((v / total) * 100 * 2.2)}%"></i></div><b>${v}</b>${mine ? ic('check') : ''}</button>`; }).join('')}</div>
    </div>
  </section>
  <section class="section">
    <h2 class="h2">Questions</h2>
    <div class="faq">${faqs.map(([q, a], i) => `<details ${i === 0 ? 'open' : ''}><summary>${esc(q)}${ic('plus')}</summary><p>${esc(a)}</p></details>`).join('')}</div>
  </section>
  ${newsletterBlock()}
  ${publicFooter()}`;
};

/* ---------- Global search ---------- */
function openSearch() {
  modal(`<div class="gsearch"><div class="f-search">${ic('search')}<input id="gs-input" data-input="gsearch" placeholder="Search events, vendors, neighbourhoods, stories…" autocomplete="off"/><kbd>esc</kbd></div><div id="gs-results">${searchResults('')}</div></div>`, 'modal-search');
  setTimeout(() => document.getElementById('gs-input')?.focus(), 30);
}
function searchResults(q) {
  const t = q.trim().toLowerCase();
  const hit = (s) => !t || s.toLowerCase().includes(t);
  const evs = Store.publicEvents().filter((e) => hit(e.title + e.venue + e.neighbourhood + e.categories.join(' '))).slice(0, 5);
  const mk = Object.values(VENDORS).filter((v) => hit(v.name + v.category)).slice(0, 4);
  const hoods = Object.keys(NEIGHBOURHOODS).filter(hit).slice(0, 4);
  const arts = JOURNAL.filter((a) => hit(a.title + a.kind)).slice(0, 3);
  if (!evs.length && !mk.length && !hoods.length && !arts.length) return `<p class="muted gs-empty">No results for “${esc(q)}”.</p>`;
  const group = (title, items) => items ? `<div class="gs-group"><span class="tiny muted">${title}</span>${items}</div>` : '';
  return group(t ? 'Events' : 'Upcoming events', evs.map((e) => `<a href="#/event/${e.id}" data-act="close-modal-nav" class="gs-item"><img src="${IMG(e.img, 120)}" alt=""/><div><b>${esc(e.title)}</b><span class="muted small">${fmtDate(e.date)} · ${esc(e.neighbourhood)}</span></div></a>`).join(''))
    + group('Vendors', mk.map((v) => `<a href="#/maker/${v.id}" data-act="close-modal-nav" class="gs-item"><img class="round" src="${IMG(v.photo, 120)}" alt=""/><div><b>${esc(v.name)}</b><span class="muted small">${esc(v.category)}</span></div></a>`).join(''))
    + (hoods.length ? group('Neighbourhoods', `<div class="chips">${hoods.map((h) => `<a class="chip" data-act="close-modal-nav" href="#/discover?hood=${encodeURIComponent(h)}">${esc(h)}</a>`).join('')}</div>`) : '')
    + group('Journal', arts.map((a) => `<a href="#/journal/${a.id}" data-act="close-modal-nav" class="gs-item"><img src="${IMG(a.img, 120)}" alt=""/><div><b>${esc(a.title)}</b><span class="muted small">${esc(a.kind)}</span></div></a>`).join(''));
}

/* ---------- Mobile menu ---------- */
function openMenu() {
  modal(`<nav class="mmenu">${wordmark('stacked')}
    ${[['#/discover', 'Discover'], ['#/makers', 'Vendors'], ['#/journal', 'Journal'], ['#/about', 'About'], ['#/for-vendors', 'For vendors'], ['#/for-organizers', 'For organizers'], ['#/saved', 'Saved']].map(([h, l]) => `<a href="${h}" data-act="close-modal-nav">${l}${ic('arrow')}</a>`).join('')}
  </nav>`, 'modal-menu');
}

/* ---------- Event page extras ---------- */
function daysUntil(d) { return Math.ceil((parseDate(d) - new Date()) / 86400000); }
function distKm(a, b) { const R = 6371, r = Math.PI / 180; const x = Math.sin(((b.lat - a.lat) * r) / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(((b.lng - a.lng) * r) / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(x)); }
function interestedCount(e) { return Math.round(e.views / 14) + ((Store.s.interested || {})[e.id] ? 1 : 0); }

function eventNearby(e) {
  const near = Store.publicEvents().filter((o) => o.id !== e.id).map((o) => ({ o, d: distKm(e, o) })).sort((a, b) => a.d - b.d).slice(0, 4);
  return `<div class="sec-head"><h2 class="h2">More markets nearby</h2><a class="link" href="#/discover?view=map">Open the map →</a></div>
    <div class="grid-cards">${near.map(({ o, d }) => eventCard(o).replace('<div class="tags">', `<p class="dist">${ic('pin')} ${d < 1 ? Math.round(d * 1000) + ' m' : d.toFixed(1) + ' km'} away</p><div class="tags">`)).join('')}</div>`;
}
