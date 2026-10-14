/* Guided product tours, first-visit welcome card and the brief checklist. */

const nordApp = () => Store.app('app-nord-mileend');
const mileStats = () => Store.eventStats('mile-end');

const TOURS = {
  scenario: {
    title: 'Connected scenario', mins: 2,
    prepare: () => { if (nordApp() && nordApp().status !== 'pending') { Store.reset(); applyPalette(); toast('Demo data reset so the scenario starts fresh'); } },
    steps: [
      { title: 'The connected scenario', text: () => `<b>Camille</b> (Montreal Makers Collective) runs the <b>Mile End Vintage Market</b> at Le Livart on June 7, 2027.<br/><br/><b>Atelier Nord</b> applied for a 6-foot table + 2 racks = <b>$300</b>. Let's follow what happens when Camille accepts.<br/><br/><span class="tour-hint">This is a guided walkthrough — each <b>Next</b> takes you to the right screen and highlights what to look at.</span>`, nextLabel: 'Start walkthrough' },
      { route: '#/v/application/app-nord-mileend', el: '.dash-head', title: 'Vendor view — Atelier Nord', text: () => `Atelier Nord's application is <b>${STATUS_LABEL[nordApp().status]}</b>. The vendor sees the booth selection and a status timeline.` },
      { route: '#/v/application/app-nord-mileend', el: '.group-teaser', title: 'Event group is locked', text: 'Messages, announcements and shared files unlock only once the organizer accepts the application.' },
      { route: '#/o', el: '.stat.money', title: 'Organizer view — Camille', text: () => `Estimated revenue is <b>${money(mileStats().revenue)}</b>, calculated from accepted booth selections only. No payments are processed.` },
      { route: '#/o/applications/mile-end?app=app-nord-mileend', el: '.applicant', place: 'left', title: 'Reviewing Atelier Nord', text: 'Camille sees the standardized application: brand profile, photos, answers to her custom questions and the $300 booth selection.' },
      { route: '#/o/applications/mile-end?app=app-nord-mileend', el: '.decide .btn-dark', place: 'top', title: 'Your turn — click Accept', text: 'Click <b>Accept</b> to accept Atelier Nord. The tour continues automatically.', waitFor: () => nordApp().status === 'accepted' },
      { route: '#/o/applications/mile-end?app=app-nord-mileend', el: '.totals-strip', title: 'Totals updated instantly', text: () => `Accepted is now <b>${mileStats().accepted}</b> and estimated revenue is <b>${money(mileStats().revenue)}</b> (+$300).` },
      { route: '#/v', el: '.notice', title: 'Back to the vendor', text: 'Atelier Nord gets a notification — the application is now <b>Accepted</b>.' },
      { route: '#/v/group/mile-end', el: '.group', title: 'Event group unlocked', text: 'Announcements, group messages, the shared flyer and files — everything Atelier Nord needs for market day.' },
      { route: '#/v/group/mile-end', el: '.group-side .file', place: 'left', title: 'Shared flyer & files', text: 'Click the flyer to preview it. Organizers can upload files for all accepted vendors.' },
      { route: '#/event/mile-end', el: '.vendor-grid', title: 'Consumer view', text: 'On the free public event page, Atelier Nord now appears under <b>Vendors at this event</b>. All three sides stay connected.' },
      { title: "That's the connected scenario", text: 'Every role reads from the same event database, so one decision updates every view. Try another tour, or explore freely with the role switcher in the top bar.', end: true },
    ],
  },
  consumer: {
    title: 'Consumer experience', mins: 1,
    steps: [
      { route: '#/', el: '.hero-photo', place: 'right', title: 'Public homepage', text: 'A cultural destination first: 35mm-style photography with the POP/COLLECTIVE logo set into the image. No login needed.' },
      { route: '#/', el: '.hero-search', title: 'Search', text: 'Search events, neighbourhoods and vendors. Press <b>/</b> anywhere for quick search.' },
      { route: '#/', el: '.paths', title: 'Three ways in', text: 'Consumers discover events for free; vendors and organizers join with a membership.' },
      { route: '#/discover', el: '.filters', title: 'Filters', text: 'Filter by date, category, neighbourhood and free entry.' },
      { route: '#/discover', el: '.disc-map-wrap', place: 'left', title: 'Montreal map', text: 'Click any marker to see the event card. The list and map stay in sync.' },
      { route: '#/event/mile-end', el: '.ev-head', place: 'left', title: 'Event details', text: 'Date, location, directions, add to calendar and save — with a free account.' },
      { route: '#/event/mile-end', el: '.info-grid', title: 'Practical information', text: 'Closest metro, parking, accessibility, pets and entry — everything needed to plan the visit.' },
      { title: 'That was the consumer side', text: 'Next, see how vendors apply and how organizers review.', end: true },
    ],
  },
  vendor: {
    title: 'Vendor experience', mins: 1,
    steps: [
      { route: '#/v', el: '.stats', title: 'Vendor dashboard', text: 'Applications by status at a glance — pending, accepted and waitlisted.' },
      { route: '#/v', el: '.gs', title: 'Getting started', text: 'A short checklist guides new vendors through their first steps.' },
      { route: '#/v/discover', el: '.filters', title: 'Discover events', text: 'Browse, filter and save events. Booth prices and deadlines are shown on every card.' },
      { route: '#/v/event/printemps', el: '.vev-side', place: 'left', title: 'Event details for vendors', text: 'Booth pricing, application deadline and organizer — then apply in one click.' },
      { route: '#/v/apply/printemps', el: '.apply-form .panel:nth-child(2)', title: 'Reusable profile', text: 'Answers and photos are <b>prefilled from the vendor profile</b> and can be edited before submitting.' },
      { route: '#/v/applications', el: '.table', title: 'Track every application', text: 'Status for every event in one place, with a timeline on each application.' },
      { route: '#/v/profile', el: '.prof-form', title: 'My Store Profile', text: 'Edit once, apply everywhere — the profile and saved answers power every application.' },
      { title: 'That was the vendor side', text: 'Run the connected scenario to see what happens when an organizer accepts.', end: true },
    ],
  },
  organizer: {
    title: 'Organizer experience', mins: 1,
    steps: [
      { route: '#/o', el: '.stats', title: 'Organizer dashboard', text: 'Applications, decisions and estimated revenue from accepted booth selections.' },
      { route: '#/o', el: '.hbars', place: 'left', title: 'Revenue by booth type', text: 'See which booth types drive revenue. Estimates only — no money changes hands.' },
      { route: '#/o/event/new', el: '.wz-steps', title: 'Create an event', text: 'Four steps: details, booths & pricing, application form, review & publish.' },
      { route: '#/o/event/new?step=2', el: '.booth-edit', title: 'Booth pricing', text: 'Add booth types with price and quantity. Add-ons such as racks don\'t count toward capacity.' },
      { route: '#/o/event/new?step=3', el: '.q-edit', title: 'Application form', text: 'A standardized form for every vendor, plus <b>up to four custom questions</b>.' },
      { route: '#/o/event/new?step=4', el: '.review-card', title: 'Draft or publish', text: 'Save as a draft, or publish to place the event on the public Montreal map.' },
      { route: '#/o/applications/mile-end', el: '.review', title: 'Applicant review', text: 'Accept, waitlist or reject — one at a time or in bulk.' },
      { route: '#/o/group/mile-end', el: '.composer', title: 'Event group', text: 'Post announcements and share flyers and files with all accepted vendors.' },
      { title: 'That was the organizer side', text: 'Run the connected scenario to see an acceptance flow through all three views.', end: true },
    ],
  },
  admin: {
    title: 'POP/COLLECTIVE team (admin)', mins: 1,
    steps: [
      { route: '#/a', el: '.stats', title: 'One event database', text: 'Curated events and organizer-submitted events live in the same table, powering vendor discovery and the public map.' },
      { route: '#/a', el: '.dup', place: 'left', title: 'Duplicate detection', text: 'New submissions are checked by date, location and title. Strong matches are flagged for a person to decide — never merged automatically.' },
      { route: '#/a', el: '.claim', title: 'Listing claims', text: 'Organizers can claim an event the team already listed. The same listing is kept — with its saves and map pin.' },
      { title: 'That was the admin side', text: 'This answers how duplicates and claims would work in production.', end: true },
    ],
  },
};

const Tour = {
  id: null, i: 0, timer: null, raf: null,
  start(id, i = 0) {
    closeModal();
    TOURS[id].prepare?.();
    this.id = id; this.i = i;
    sessionStorage.setItem('popco_tour', JSON.stringify({ id, i }));
    this.show();
  },
  stop() {
    this.id = null; sessionStorage.removeItem('popco_tour');
    document.getElementById('tour')?.remove();
    cancelAnimationFrame(this.raf);
  },
  step() { return this.id ? TOURS[this.id].steps[this.i] : null; },
  go(d) {
    const t = TOURS[this.id];
    this.i = Math.max(0, Math.min(t.steps.length - 1, this.i + d));
    sessionStorage.setItem('popco_tour', JSON.stringify({ id: this.id, i: this.i }));
    this.show();
  },
  show() {
    const s = this.step(); if (!s) return;
    if (s.route && location.hash !== s.route) { location.hash = s.route; return; } // afterRender() continues
    this.paint();
  },
  afterRender() { if (this.id) setTimeout(() => this.paint(), 60); },
  paint(attempt = 0) {
    const s = this.step(); if (!s) return;
    if (s.route && location.hash !== s.route) { this.paintAway(); return; }
    const target = s.el ? document.querySelector(s.el) : null;
    if (s.el && !target && attempt < 15) { clearTimeout(this.timer); this.timer = setTimeout(() => this.paint(attempt + 1), 120); return; }
    let root = document.getElementById('tour');
    if (!root) { root = document.createElement('div'); root.id = 'tour'; document.body.appendChild(root); }
    const t = TOURS[this.id];
    const waiting = s.waitFor && !s.waitFor();
    const text = typeof s.text === 'function' ? s.text() : s.text;
    const others = Object.entries(TOURS).filter(([k]) => k !== this.id);
    root.innerHTML = `<div class="tour-spot ${target ? '' : 'none'}"></div>
      <div class="tour-card ${target ? '' : 'center'}" role="dialog" aria-label="${esc(s.title)}">
        <div class="tour-top"><span class="tour-kicker">${esc(t.title)} · ${this.i + 1} of ${t.steps.length}</span><button class="tour-x" data-act="tour-stop" aria-label="Close tour">${ic('x')}</button></div>
        <h3>${esc(s.title)}</h3><p>${text}</p>
        ${waiting ? `<div class="tour-wait"><span class="pulse"></span> Waiting for you…</div>` : ''}
        ${s.end ? `<div class="tour-more">${others.map(([k, o]) => `<button class="chip" data-act="tour-start" data-id="${k}">${esc(o.title)}</button>`).join('')}</div>` : ''}
        <div class="tour-nav">
          <div class="tour-dots">${t.steps.map((_, n) => `<i class="${n === this.i ? 'on' : n < this.i ? 'done' : ''}"></i>`).join('')}</div>
          <div class="row gap-s">${this.i > 0 ? '<button class="btn sm btn-ghost" data-act="tour-back">Back</button>' : ''}
          ${s.end ? '<button class="btn sm" data-act="tour-stop">Finish</button>' : waiting ? '<button class="link-btn" data-act="tour-next">Skip</button>' : `<button class="btn sm" data-act="tour-next">${s.nextLabel || 'Next'}</button>`}</div>
        </div>
      </div>`;
    if (target) {
      target.scrollIntoView({ block: 'center', behavior: attempt ? 'auto' : 'smooth' });
      const place = () => this.place(target, s.place);
      cancelAnimationFrame(this.raf);
      const loop = () => { if (!document.body.contains(target) || this.step() !== s) return; place(); this.raf = requestAnimationFrame(loop); };
      loop();
    }
  },
  paintAway() {
    const t = TOURS[this.id];
    let root = document.getElementById('tour');
    if (!root) { root = document.createElement('div'); root.id = 'tour'; document.body.appendChild(root); }
    cancelAnimationFrame(this.raf);
    root.innerHTML = `<div class="tour-card away"><div class="tour-top"><span class="tour-kicker">${esc(t.title)} · paused at ${this.i + 1} of ${t.steps.length}</span><button class="tour-x" data-act="tour-stop" aria-label="End tour">${ic('x')}</button></div>
      <p>You're exploring on your own. Pick up the walkthrough where you left off whenever you like.</p>
      <div class="row gap-s end"><button class="btn sm btn-ghost" data-act="tour-stop">End tour</button><button class="btn sm" data-act="tour-resume">Resume tour</button></div></div>`;
  },
  place(target, pref) {
    const spot = document.querySelector('#tour .tour-spot'); const card = document.querySelector('#tour .tour-card');
    if (!spot || !card) return;
    const r = target.getBoundingClientRect(); const pad = 8;
    Object.assign(spot.style, { top: `${r.top - pad}px`, left: `${r.left - pad}px`, width: `${r.width + pad * 2}px`, height: `${r.height + pad * 2}px` });
    if (window.innerWidth < 640) return; // bottom sheet on phones (CSS)
    const cw = card.offsetWidth, ch = card.offsetHeight, vw = window.innerWidth, vh = window.innerHeight, m = 16;
    const fits = { bottom: r.bottom + ch + m * 2 < vh, top: r.top - ch - m * 2 > 56, right: r.right + cw + m * 2 < vw, left: r.left - cw - m * 2 > 0 };
    const order = [pref, 'bottom', 'top', 'right', 'left'].filter(Boolean);
    const side = order.find((o) => fits[o]);
    let top, left;
    if (side === 'bottom') { top = r.bottom + m; left = r.left + r.width / 2 - cw / 2; }
    else if (side === 'top') { top = r.top - ch - m; left = r.left + r.width / 2 - cw / 2; }
    else if (side === 'right') { top = r.top + r.height / 2 - ch / 2; left = r.right + m; }
    else if (side === 'left') { top = r.top + r.height / 2 - ch / 2; left = r.left - cw - m; }
    else { top = vh - ch - m; left = vw - cw - m; }
    card.style.top = `${Math.max(64, Math.min(vh - ch - m, top))}px`;
    card.style.left = `${Math.max(m, Math.min(vw - cw - m, left))}px`;
  },
  // Called after every store change: auto-advance steps that wait for a user action.
  check() {
    const s = this.step();
    if (s && s.waitFor && s.waitFor()) { setTimeout(() => { if (this.step() === s) this.go(1); }, 700); }
  },
};

/* ---------- Welcome card (first visit) ---------- */
function openWelcome() {
  modal(`<div class="welcome">
    ${wordmark('stacked', 'xl')}
    <h2 class="h1">Welcome to the POP/COLLECTIVE prototype</h2>
    <p class="muted">A clickable Phase 1 prototype connecting <b>consumers</b>, <b>vendors</b> and <b>organizers</b> in Montreal. Fictional data — no payments, no real accounts.</p>
    <div class="wl-options">
      <button class="wl-opt main" data-act="tour-start" data-id="scenario">${ic('play')}<div><b>Run the connected scenario</b><span>Atelier Nord → Accept → every view updates · 2 min</span></div></button>
      <button class="wl-opt" data-act="tour-start" data-id="consumer">${ic('map')}<div><b>Take the product tour</b><span>Consumer, then vendor and organizer · 1 min each</span></div></button>
      <button class="wl-opt" data-act="brief">${ic('check')}<div><b>See the brief checklist</b><span>Every Phase 1 requirement and where to find it</span></div></button>
    </div>
    <button class="link-btn wl-skip" data-act="close-modal">Explore on my own</button>
    <p class="tiny muted">Switch between Consumer, Vendor and Organizer anytime from the bar at the top.</p>
  </div>`, 'modal-welcome');
}

/* ---------- Brief checklist ---------- */
const BRIEF = [
  ['Organizer', [
    ['Event dashboard', '#/o'],
    ['Create / edit an event — draft or published', '#/o/event/new'],
    ['Booth pricing', '#/o/event/new?step=2'],
    ['Standardized application form with up to four custom questions', '#/o/event/new?step=3'],
    ['Applicant review with Accept, Waitlist, Reject', '#/o/applications/mile-end'],
    ['Estimated revenue from accepted booth selections (not payments)', '#/o'],
  ]],
  ['Vendor', [
    ['Dashboard', '#/v'],
    ['Browse, filter and save events', '#/v/discover'],
    ['View event details', '#/v/event/printemps'],
    ['Apply using a reusable profile — prefilled answers and photos, editable', '#/v/apply/printemps'],
    ['Track application status', '#/v/applications'],
    ['Event group communications after acceptance', '#/v/group/fetes'],
  ]],
  ['Consumer', [
    ['Free public event discovery', '#/discover'],
    ['Montreal map with clickable markers', '#/discover?view=map'],
    ['Filters', '#/discover'],
    ['Event detail: date, location, nearest metro and parking', '#/event/mile-end'],
    ['Optional simulated login to save events', '#/saved'],
  ]],
  ['Connected scenario', [
    ['Camille · Mile End Vintage Market · Le Livart · June 7, 2027', 'tour:scenario'],
    ['Atelier Nord pending — 6-foot table + 2 racks for $300', '#/o/applications/mile-end?app=app-nord-mileend'],
    ['Accept updates vendor view, organizer totals and estimated revenue', 'tour:scenario'],
    ['Unlocks a mock event group: messages, announcements, flyer / files', 'tour:scenario'],
  ]],
  ['Membership & visual direction', [
    ['Mock membership pages for paid Vendor and Organizer plans ($XX/month)', '#/membership'],
    ['Consumer discovery is free', '#/membership'],
    ['Realistic homepage hero with logo integrated into photography', '#/'],
    ['Both colour palettes + alternate logo treatment', '#/brand'],
    ['Responsive desktop and mobile', 'mobile'],
  ]],
];

function openBrief() {
  const total = BRIEF.reduce((n, [, items]) => n + items.length, 0);
  modal(`<div class="brief">
    <p class="eyebrow">Phase 1 assessment brief</p><h2 class="h1">Brief checklist</h2>
    <p class="muted">All ${total} requirements from the brief are included. Click any item to see it.</p>
    ${BRIEF.map(([group, items]) => `<h3>${group}</h3><div class="brief-list">${items.map(([t, to]) => `<button class="brief-item" data-act="brief-go" data-to="${to}"><span class="bi-check">${ic('check')}</span><span>${esc(t)}</span>${ic('arrow')}</button>`).join('')}</div>`).join('')}
  </div>`, 'modal-brief');
}

const TourActions = {
  'tour-start': (el) => Tour.start(el.dataset.id),
  'tour-next': () => Tour.go(1),
  'tour-back': () => Tour.go(-1),
  'tour-stop': () => Tour.stop(),
  'tour-resume': () => Tour.show(),
  'tours-menu': (el) => {
    const open = document.querySelector('.tours-menu');
    if (open) { open.remove(); return; }
    const r = el.getBoundingClientRect();
    const m = document.createElement('div');
    m.className = 'tours-menu';
    m.style.top = `${r.bottom + 6}px`; m.style.left = `${Math.min(r.left, window.innerWidth - 300)}px`;
    m.innerHTML = Object.entries(TOURS).filter(([k]) => k !== 'scenario').map(([k, t]) => `<button data-act="tour-start" data-id="${k}">${ic(k === 'scenario' ? 'play' : 'sparkle')}<div><b>${esc(t.title)}</b><span>${t.mins} min</span></div></button>`).join('')
      + `<button data-act="welcome">${ic('home')}<div><b>Welcome screen</b><span>Start options</span></div></button>`;
    document.body.appendChild(m);
  },
  'welcome': () => openWelcome(),
  'brief': () => openBrief(),
  'brief-go': (el) => {
    const to = el.dataset.to; closeModal();
    if (to.startsWith('tour:')) Tour.start(to.slice(5));
    else if (to === 'mobile') Actions.mobile();
    else go(to);
  },
};

document.addEventListener('click', (e) => { if (!e.target.closest('.tours-menu, [data-act="tours-menu"]')) document.querySelector('.tours-menu')?.remove(); });
document.addEventListener('keydown', (e) => {
  if (!Tour.id || /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName)) return;
  if (e.key === 'Escape') Tour.stop();
  if (e.key === 'ArrowRight' && !(Tour.step().waitFor && !Tour.step().waitFor())) Tour.go(1);
  if (e.key === 'ArrowLeft') Tour.go(-1);
});
window.addEventListener('resize', () => { if (Tour.id) Tour.paint(); });
