/* POP/COLLECTIVE team (admin): event database, review queue, listing claims. */

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
        <span class="muted">${fmtDate(e.date)}</span><span class="muted">Montreal · ${esc(e.neighbourhood)}</span><span>${srcTag(e)}</span>
        <span class="small">${esc(ORGANIZERS[e.organizerId].org)}</span><span>${pill(e.status === 'review' ? 'pending' : e.status)}</span></a>`).join('')}
    </div></section>
    <p class="tiny muted">Every event carries a <b>city</b> field — adding Toronto or Vancouver later is a filter, not a schema change.</p>`);
};
