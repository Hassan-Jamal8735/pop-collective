/* POP/COLLECTIVE team (admin) + vendor/organizer onboarding. */

const srcTag = (e) => e.organizerId === 'pc-team'
  ? '<span class="src src-curated">Curated · unclaimed</span>'
  : e.source === 'admin' ? '<span class="src src-curated">Curated</span>' : '<span class="src src-org">Organizer</span>';

Views.aHome = () => {
  const queue = Store.s.events.filter((e) => e.status === 'review');
  const claims = Store.s.claims.filter((c) => c.status === 'pending');
  const all = Store.s.events.filter((e) => e.status !== 'archived');
  const pub = all.filter((e) => e.status === 'published');
  return dashLayout('admin', 'home', `
    <div class="dash-head"><div><p class="eyebrow">POP/COLLECTIVE team</p><h1 class="h1">Event database</h1><p class="muted">One source of truth for vendor discovery and the public map — curated and organizer-submitted events live in the same table.</p></div>
      <a class="btn btn-ghost" href="#/a/events">${ic('list')} All events</a></div>
    <div class="stats">
      <div class="stat"><span>Published events</span><b>${pub.length}</b></div>
      <div class="stat"><span>Curated by team</span><b>${pub.filter((e) => e.source === 'admin').length}</b></div>
      <div class="stat"><span>Organizer listings</span><b>${pub.filter((e) => e.source === 'organizer').length}</b></div>
      <a href="#/a" class="stat ${queue.length ? 'warn' : ''}"><span>Awaiting review</span><b>${queue.length}</b></a>
      <a href="#/a" class="stat ${claims.length ? 'warn' : ''}"><span>Listing claims</span><b>${claims.length}</b></a>
    </div>

    <section class="panel">
      <div class="panel-head"><h2>${ic('file')} Review queue <span class="muted small">organizer submissions before they go public</span></h2></div>
      ${queue.length ? queue.map((e) => {
        const dups = Store.duplicatesOf(e);
        const org = ORGANIZERS[e.organizerId];
        return `<div class="queue-item ${dups.length ? 'has-dup' : ''}">
          <div class="qi-main">
            <img src="${IMG(e.img, 200)}" alt=""/>
            <div><b>${esc(e.title)}</b><span class="muted small">${esc(org.org)} · submitted ${fmtStamp(e.submittedAt)}</span>
              <span class="small">${fmtDate(e.date)} · ${esc(e.venue)}, ${esc(e.neighbourhood)}</span>${tags(e.categories)}</div>
          </div>
          ${dups.length ? `<div class="dup">
            <div class="dup-head">${ic('sparkle')} <b>Possible duplicate</b> — match score ${dups[0].score}/100</div>
            ${dups.slice(0, 1).map((d) => `<a href="#/event/${d.event.id}" class="dup-match"><img src="${IMG(d.event.img, 120)}" alt=""/><div><b>${esc(d.event.title)}</b><span class="muted small">${srcTag(d.event)} ${fmtDate(d.event.date)} · ${esc(d.event.venue)}</span></div></a>
              <div class="reasons">${d.reasons.map((r) => `<span>${ic('check')} ${r}</span>`).join('')}</div>`).join('')}
            <p class="tiny muted">Strong matches are flagged for a human decision — never auto-merged.</p>
          </div>` : `<div class="dup ok">${ic('check')} No duplicates found (checked date, location within 300 m and normalized title).</div>`}
          <div class="qi-actions">
            ${dups.length ? `<button class="btn sm btn-dark" data-act="adm-merge" data-id="${e.id}" data-into="${dups[0].event.id}">Merge into existing</button><button class="btn sm btn-ghost" data-act="adm-publish" data-id="${e.id}">Not a duplicate — publish</button>`
              : `<button class="btn sm" data-act="adm-publish" data-id="${e.id}">${ic('check')} Verify & publish</button>`}
            <button class="btn sm btn-ghost" data-act="adm-reject" data-id="${e.id}">Decline</button>
          </div>
        </div>`;
      }).join('') : emptyState('check', 'Queue is clear', 'New organizer submissions will appear here before going public.')}
    </section>

    <section class="panel">
      <div class="panel-head"><h2>${ic('users')} Listing claims <span class="muted small">organizers taking over curated listings</span></h2></div>
      ${Store.s.claims.length ? Store.s.claims.map((c) => {
        const e = Store.event(c.eventId); const org = ORGANIZERS[c.orgId];
        return `<div class="claim">
          <img src="${IMG(e.img, 160)}" alt=""/>
          <div class="claim-main"><b>${esc(org.org)}</b> wants to claim <a class="link" href="#/event/${e.id}">${esc(e.title)}</a>
            <span class="muted small">${fmtDate(e.date)} · ${esc(e.venue)} · requested ${fmtStamp(c.at)}</span>
            <blockquote>${esc(c.note)}</blockquote>
            <p class="tiny muted">On approval the existing record is kept (same URL, saves and map pin) and ownership moves to the organizer — no second listing is created.</p></div>
          <div class="claim-actions">${c.status === 'pending'
            ? `<button class="btn sm" data-act="adm-claim" data-id="${c.id}" data-s="approved">${ic('check')} Approve</button><button class="btn sm btn-ghost" data-act="adm-claim" data-id="${c.id}" data-s="declined">Decline</button>`
            : pill(c.status === 'approved' ? 'accepted' : 'rejected')}</div>
        </div>`;
      }).join('') : emptyState('users', 'No claims', '')}
    </section>`);
};

Views.aEvents = (params) => {
  const src = params?.get('src') || 'all';
  const evs = Store.s.events.filter((e) => e.status !== 'archived').filter((e) => src === 'all' || (src === 'curated' ? e.source === 'admin' : e.source === 'organizer'))
    .sort((a, b) => a.date.localeCompare(b.date));
  const t = (k, l) => `<a href="#/a/events${k === 'all' ? '' : '?src=' + k}" class="${src === k ? 'on' : ''}">${l}</a>`;
  return dashLayout('admin', 'events', `
    <div class="dash-head"><div><p class="eyebrow">POP/COLLECTIVE team</p><h1 class="h1">All events</h1></div><button class="btn" data-act="adm-new">${ic('plus')} Add curated event</button></div>
    <div class="tabs">${t('all', 'All')}${t('curated', 'Curated')}${t('organizer', 'Organizer-submitted')}</div>
    <section class="panel"><div class="table adm-table">
      <div class="tr th"><span>Event</span><span>Date</span><span>City · area</span><span>Source</span><span>Organizer</span><span>Status</span></div>
      ${evs.map((e) => `<a class="tr" href="${e.status === 'published' ? '#/event/' + e.id : '#/a'}"><span class="t-ev"><img src="${IMG(e.img, 100)}" alt=""/><b>${esc(e.title)}</b></span>
        <span class="muted">${fmtDate(e.date)}</span><span class="muted">Montréal · ${esc(e.neighbourhood)}</span><span>${srcTag(e)}</span>
        <span class="small">${esc(ORGANIZERS[e.organizerId].org)}</span><span>${pill(e.status === 'review' ? 'pending' : e.status)}</span></a>`).join('')}
    </div></section>
    <p class="tiny muted">Every event carries a <b>city</b> field — adding Toronto or Vancouver later is a filter, not a schema change.</p>`);
};

/* ---------------- Onboarding (vendor + organizer) ---------------- */
const OB = { yearly: false, plan: 'Pro' };

Views.join = (params, kind) => {
  const v = kind === 'vendor';
  const step = Number(params?.get('step') || 1);
  const go = (n) => `#/join/${kind}?step=${n}`;
  const img = v ? PHOTOS.rackStreet : PHOTOS.festival;
  const scribble = v ? 'for creative people,<br/>by creative people.' : 'communities,<br/>brands, events —<br/>together ✶';
  const steps = ['Account', 'Plan', 'Profile', 'Done'];
  let body = '';
  if (step === 1) {
    body = `<h1 class="h1">Create your ${v ? 'vendor' : 'organizer'} account</h1>
      <p class="muted">${v ? 'Join a community of independent brands and creative entrepreneurs.' : "Let's get your event space on the map."}</p>
      <form data-submit="ob-next" data-to="${go(2)}">
        <label class="field"><span>Full name</span><input required value="${v ? 'Inès Laurent' : 'Camille Tremblay'}"/></label>
        <label class="field"><span>Email address</span><input type="email" required value="${v ? 'hello@ateliernord.ca' : 'camille@mtlmakers.ca'}"/></label>
        <label class="field"><span>Password</span><input type="password" required value="demo-password"/></label>
        <button class="btn block">Create account</button>
      </form><p class="small muted center">Already have an account? <a class="link" href="${v ? '#/v' : '#/o'}">Log in</a></p>`;
  } else if (step === 2) {
    const plans = v
      ? [['Starter', ['Apply to events', 'Track applications', 'Event groups', 'Basic profile']], ['Pro', ['Everything in Starter', 'Priority application alerts', 'Featured maker profile', 'Application insights']]]
      : [['Basic', ['Up to 3 active events', 'Standard listing', 'Applicant review', 'Event group']], ['Pro', ['Unlimited events', 'Featured on the map', 'Bulk accept & waitlist', 'Revenue estimates']]];
    body = `<h1 class="h1">Choose your plan</h1><p class="muted">Placeholder pricing — no payment in the prototype.</p>
      <div class="seg ob-seg"><button class="${OB.yearly ? '' : 'on'}" data-act="ob-yearly" data-y="0">Monthly</button><button class="${OB.yearly ? 'on' : ''}" data-act="ob-yearly" data-y="1">Yearly · save 20%</button></div>
      <div class="ob-plans">${plans.map(([n, f]) => `<button class="ob-plan ${OB.plan === n ? 'on' : ''}" data-act="ob-plan" data-p="${n}">
        ${n === 'Pro' ? '<span class="pop-tag">Most popular</span>' : ''}<h3>${n}</h3><p class="price">$XX<span> / ${OB.yearly ? 'year' : 'month'}</span></p>
        <ul>${f.map((x) => `<li>${ic('check')} ${x}</li>`).join('')}</ul></button>`).join('')}</div>
      <a class="btn block" href="${go(3)}">Continue with ${OB.plan}</a>`;
  } else if (step === 3) {
    body = `<h1 class="h1">Complete your profile</h1><p class="muted">Help ${v ? 'organizers' : 'vendors and visitors'} learn about you.</p>
      <form data-submit="ob-next" data-to="${go(4)}">
        <div class="ob-photo"><img src="${IMG(v ? VENDORS[ME_VENDOR].photo : PHOTOS.camille, 200)}" alt=""/><button type="button" class="btn sm btn-ghost" data-act="fake-upload">${ic('upload')} Change photo</button></div>
        <label class="field"><span>${v ? 'Business name' : 'Organization / venue name'}</span><input value="${v ? 'Atelier Nord' : 'Montreal Makers Collective'}"/></label>
        <div class="two"><label class="field"><span>${v ? 'Category' : 'Event types'}</span><input value="${v ? 'Vintage clothing' : 'Vintage & maker markets'}"/></label>
        <label class="field"><span>City</span><select><option>Montréal, QC</option><option disabled>Toronto — coming soon</option><option disabled>Vancouver — coming soon</option></select></label></div>
        <label class="field"><span>Short description</span><textarea rows="3" maxlength="200" data-act-count>${v ? 'Curated vintage and designer pieces for everyday. Inspired by style, culture and community.' : 'Curated markets celebrating independent Montréal makers.'}</textarea></label>
        <button class="btn block">Save & continue</button>
      </form>`;
  } else {
    body = `<div class="ob-done"><span class="burst">${ic('check')}</span><h1 class="h1">You're all set!</h1>
      <p class="muted">Your ${v ? 'vendor profile' : 'organizer account'} is ready. ${v ? 'Your answers will prefill every application.' : 'Create your first event and start receiving applications.'}</p>
      <a class="btn block" href="${v ? '#/v/discover' : '#/o/event/new'}">${v ? 'Explore events' : 'Create your first event'}</a>
      <a class="btn btn-ghost block" href="${v ? '#/v' : '#/o'}">Go to dashboard</a>
      <span class="scribble">${v ? 'small brands,<br/>big communities ✶' : 'good people,<br/>great events ✶'}</span></div>`;
  }
  return `<div class="ob">
    <div class="ob-art film"><img src="${IMG(img, 1400)}" alt=""/><a href="#/" class="ob-logo">${wordmark('stacked')}</a>
      <span class="scribble light">${scribble}</span>
      <h2 class="role-title">${v ? 'Turn your passion<br/>into pop-ups.' : 'Create<br/>unforgettable<br/>events.'}</h2></div>
    <div class="ob-form">
      <div class="ob-steps">${steps.map((s, i) => `<span class="${step === i + 1 ? 'on' : step > i + 1 ? 'done' : ''}">${step > i + 1 ? ic('check') : i + 1}<em>${s}</em></span>`).join('')}</div>
      <div class="ob-body">${body}</div>
    </div>
  </div>`;
};
