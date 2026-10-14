/* Onboarding: vendor + organizer sign-up flows, consumer account & interests, "Getting started" checklists. */

const OB = { yearly: false, plan: 'Pro', photos: null, cats: null, hoods: null, showPw: false };

/* ---------- Form validation ---------- */
function validateForm(form) {
  form.querySelectorAll('.err').forEach((e) => e.remove());
  form.querySelectorAll('.invalid').forEach((e) => e.classList.remove('invalid'));
  let ok = true;
  const fail = (el, msg) => {
    ok = false;
    el.classList.add('invalid');
    const holder = el.closest('.field') || el.parentElement;
    holder.insertAdjacentHTML('beforeend', `<span class="err">${msg}</span>`);
  };
  form.querySelectorAll('input, textarea, select').forEach((el) => {
    const v = (el.type === 'checkbox' ? el.checked : el.value.trim());
    if (el.required && !v) return fail(el, el.type === 'checkbox' ? 'Please accept to continue.' : 'This field is required.');
    if (el.type === 'email' && v && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) return fail(el, 'Enter a valid email address.');
    if (el.dataset.min && v.length < Number(el.dataset.min)) return fail(el, `Please write at least ${el.dataset.min} characters.`);
  });
  const first = form.querySelector('.invalid');
  if (first) first.focus();
  return ok;
}

const pwField = (val = '') => `<label class="field"><span>Password</span><div class="pw"><input name="password" type="${OB.showPw ? 'text' : 'password'}" required data-min="8" value="${esc(val)}" autocomplete="new-password"/><button type="button" class="pw-toggle" data-act="pw-toggle">${OB.showPw ? 'Hide' : 'Show'}</button></div><span class="hint-sm">At least 8 characters.</span></label>`;
const socialBtns = (act) => `<div class="social-row"><button type="button" class="btn btn-ghost block" data-act="${act}" data-p="Google"><b class="g">G</b> Continue with Google</button><button type="button" class="btn btn-ghost block" data-act="${act}" data-p="Apple"><b></b> Continue with Apple</button></div><div class="or"><span>or with email</span></div>`;

/* ---------- Vendor / organizer sign-up ---------- */
const OB_STEPS = { vendor: ['Account', 'Plan', 'Store profile', 'Saved answers', 'Done'], organizer: ['Account', 'Plan', 'Organization', 'Done'] };

Views.join = (params, kind) => {
  const v = kind === 'vendor';
  const steps = OB_STEPS[kind];
  const step = Math.min(Math.max(Number(params?.get('step') || 1), 1), steps.length);
  const name = steps[step - 1];
  const to = (n) => `#/join/${kind}?step=${n}`;
  const back = step > 1 ? `<a class="ob-back" href="${to(step - 1)}">${ic('back')} Back</a>` : `<a class="ob-back" href="#/for-${kind}s">${ic('back')} ${v ? 'For Vendors' : 'For Organizers'}</a>`;
  const acc = Store.s.accounts[kind] || {};
  const p = Store.s.profile;
  const org = Store.s.orgProfile || { name: 'Montreal Makers Collective', neighbourhood: 'Mile End / Plateau', website: 'mtlmakers.ca', instagram: '@mtlmakerscollective', description: 'Curated markets celebrating independent Montreal brands, from vintage to handmade.' };
  if (!OB.photos) OB.photos = p.photos.slice();
  let body = '';

  if (name === 'Account') {
    body = `<h1 class="h1">Create your ${v ? 'vendor' : 'organizer'} account</h1>
      <p class="muted">${v ? 'Join a community of independent brands and creative entrepreneurs.' : "Let's get your event space on the map."}</p>
      ${socialBtns('ob-social')}
      <form data-submit="ob-account" data-kind="${kind}" novalidate>
        <label class="field"><span>Full name</span><input name="name" required value="${esc(acc.name || (v ? 'Inès Laurent' : 'Camille Tremblay'))}" autocomplete="name"/></label>
        <label class="field"><span>Email address</span><input name="email" type="email" required value="${esc(acc.email || (v ? 'hello@ateliernord.ca' : 'camille@mtlmakers.ca'))}" autocomplete="email"/></label>
        ${pwField(acc.password || '')}
        <label class="check terms"><input type="checkbox" name="terms" required ${acc.email ? 'checked' : ''}/> I agree to the Terms of Service and Privacy Policy</label>
        <button class="btn block">Create account</button>
      </form><p class="small muted center">Already have an account? <a class="link" href="${v ? '#/v' : '#/o'}">Log in</a></p>`;
  } else if (name === 'Plan') {
    const plans = v
      ? [['Starter', ['Apply to events', 'Track applications', 'Event notifications', 'Basic profile', 'Community access']], ['Pro', ['Everything in Starter', 'Priority application alerts', 'Advanced search filters', 'Analytics & insights', 'Featured profile listing']]]
      : [['Basic', ['Up to 3 active events', 'Standard event listing', 'Manage applications', 'Basic analytics']], ['Pro', ['Unlimited events', 'Featured event listing', 'Advanced application tools', 'Bulk acceptance', 'Detailed analytics', 'Priority support']]];
    body = `<h1 class="h1">Choose your plan</h1><p class="muted">${v ? 'Get access to curated events, application tools and a community of organizers.' : 'Select the plan that fits your event goals.'} <span class="tiny">Prices are placeholders — no payment in the prototype.</span></p>
      <div class="seg ob-seg"><button class="${OB.yearly ? '' : 'on'}" data-act="ob-yearly" data-y="0">Monthly</button><button class="${OB.yearly ? 'on' : ''}" data-act="ob-yearly" data-y="1">Yearly (save 20%)</button></div>
      <div class="ob-plans">${plans.map(([n, f]) => `<button class="ob-plan ${OB.plan === n ? 'on' : ''}" data-act="ob-plan" data-p="${n}">
        ${n === 'Pro' ? '<span class="pop-tag">Most popular</span>' : ''}<h3>${n}</h3><p class="price">$XX<span> / ${OB.yearly ? 'year' : 'month'}</span></p>
        <ul>${f.map((x) => `<li>${ic('check')} ${x}</li>`).join('')}</ul><span class="ob-radio">${OB.plan === n ? ic('check') : ''}</span></button>`).join('')}</div>
      <button class="btn block" data-act="ob-plan-continue" data-kind="${kind}" data-to="${to(step + 1)}">Continue with ${OB.plan}</button>`;
  } else if (name === 'Store profile') {
    body = `<h1 class="h1">Complete your profile</h1><p class="muted">Help organizers learn more about your brand. This becomes your reusable profile — it prefills every application.</p>
      <form data-submit="ob-profile" data-to="${to(step + 1)}" novalidate>
        <div class="two"><label class="field"><span>Business name</span><input name="bname" required value="Atelier Nord"/></label>
        <label class="field"><span>Category</span><select name="category">${['Vintage / Fashion', 'Fashion', 'Handmade', 'Jewelry', 'Art & Prints', 'Home Decor', 'Food & Drinks', 'Wellness', 'Beauty'].map((c) => `<option ${p.category === c ? 'selected' : ''}>${c}</option>`).join('')}</select></label></div>
        <div class="two"><label class="field"><span>Location</span><select name="city"><option>Montreal, QC</option><option disabled>Toronto — coming soon</option><option disabled>Vancouver — coming soon</option></select></label>
        <label class="field"><span>Website / social media</span><input name="social" value="${esc(p.social)}"/></label></div>
        <label class="field"><span>Short description</span><textarea name="description" rows="3" maxlength="200" required data-min="20" data-count="ob-count">${esc(p.description)}</textarea><span class="hint-sm right" id="ob-count">${p.description.length}/200</span></label>
        <div class="field"><span>Product photos <span class="muted">(select 3–5)</span></span>
          <div class="photo-pick">${VENDORS[ME_VENDOR].photos.map((ph) => `<button type="button" class="ph ${OB.photos.includes(ph) ? 'on' : ''}" data-act="ob-photo" data-ph="${ph}"><img src="${IMG(ph, 300)}" alt=""/><span>${ic('check')}</span></button>`).join('')}
          <button type="button" class="ph add" data-act="fake-upload">${ic('upload')}<span class="tiny">Upload</span></button></div><span class="hint-sm" id="ob-photo-count">${OB.photos.length} selected</span></div>
        <button class="btn block">Save & continue</button>
      </form>`;
  } else if (name === 'Saved answers') {
    const a = p.answers;
    body = `<h1 class="h1">Save your usual answers</h1><p class="muted">Organizers often ask the same questions. Answer once — we'll prefill them on every application, and you can still edit before submitting.</p>
      <form data-submit="ob-answers" data-to="${to(step + 1)}" novalidate>
        <label class="field"><span>Do you need access to electricity?</span><select name="power"><option ${a.power === 'No' ? 'selected' : ''}>No</option><option ${a.power === 'Yes' ? 'selected' : ''}>Yes</option></select></label>
        <label class="field"><span>What is your typical price range?</span><input name="price" value="${esc(a.price || '')}" placeholder="$25 – $180"/></label>
        <label class="field"><span>Which era(s) does your collection focus on?</span><input name="era" value="${esc(a.era || '')}" placeholder="e.g. 1970s–1990s"/></label>
        <label class="field"><span>Previous events</span><input name="previous" value="${esc(p.previous)}"/></label>
        <label class="field"><span>Anything organizers should know?</span><input name="notes" value="${esc(a.notes || '')}"/></label>
        <button class="btn block">Save & continue</button>
      </form>`;
  } else if (name === 'Organization') {
    body = `<h1 class="h1">Complete your profile</h1><p class="muted">Help vendors and attendees learn more about you. This appears on every event you publish.</p>
      <form data-submit="ob-org" data-to="${to(step + 1)}" novalidate>
        <div class="ob-photo"><img src="${IMG(PHOTOS.camille, 200)}" alt=""/><button type="button" class="btn sm btn-ghost" data-act="fake-upload">${ic('upload')} Change photo</button></div>
        <label class="field"><span>Organization / venue name</span><input name="name" required value="${esc(org.name)}"/></label>
        <div class="two"><label class="field"><span>Location</span><select name="neighbourhood">${Object.keys(NEIGHBOURHOODS).map((n) => `<option ${org.neighbourhood === n ? 'selected' : ''}>${n}</option>`).join('')}</select></label>
        <label class="field"><span>Instagram</span><input name="instagram" value="${esc(org.instagram)}"/></label></div>
        <label class="field"><span>Website <span class="muted">(optional)</span></span><input name="website" value="${esc(org.website)}" placeholder="https://"/></label>
        <label class="field"><span>Short description</span><textarea name="description" rows="3" maxlength="200" required data-min="20" data-count="ob-count">${esc(org.description)}</textarea><span class="hint-sm right" id="ob-count">${org.description.length}/200</span></label>
        <button class="btn block">Save & continue</button>
      </form>`;
  } else {
    const plan = Store.s.plans[kind];
    body = v
      ? `<div class="ob-done"><span class="burst">${ic('check')}</span><h1 class="h1">You're all set!</h1><p class="muted">Your vendor profile is ready — it will prefill every application.</p>
          <div class="ob-preview"><img class="pv-av" src="${IMG(VENDORS[ME_VENDOR].photo, 120)}" alt=""/><div><b>Atelier Nord</b><span class="muted small">${esc(p.category)} · Montreal, QC · ${esc(plan)} plan</span><p class="small">${esc(p.description)}</p><div class="pv-photos">${p.photos.slice(0, 4).map((ph) => `<img src="${IMG(ph, 120)}" alt=""/>`).join('')}</div></div></div>
          <a class="btn block" href="#/v/discover">Explore events</a><a class="btn btn-ghost block" href="#/v">Go to dashboard</a>
          <span class="scribble">small brands,<br/>big communities ✶</span></div>`
      : `<div class="ob-done"><span class="burst">${ic('check')}</span><h1 class="h1">You're all set!</h1><p class="muted">Your organizer account is ready.</p>
          <div class="ob-preview"><img class="pv-av" src="${IMG(PHOTOS.camille, 120)}" alt=""/><div><b>${esc(org.name)}</b><span class="muted small">${esc(org.neighbourhood)} · ${esc(org.instagram)} · ${esc(plan)} plan</span><p class="small">${esc(org.description)}</p></div></div>
          <a class="btn block" href="#/o/event/new">Create your first event</a><a class="btn btn-ghost block" href="#/o">Go to dashboard</a>
          <span class="scribble">good people,<br/>great events ✶</span></div>`;
  }

  const img = v ? PHOTOS.rackStreet : PHOTOS.festival;
  return `<div class="ob">
    <div class="ob-art film"><img src="${IMG(img, 1400)}" alt=""/><a href="#/" class="ob-logo">${wordmark('stacked')}</a>
      <span class="scribble light">${v ? 'for creative people,<br/>by creative people.' : 'communities,<br/>brands, events —<br/>together ✶'}</span>
      <h2 class="role-title">${v ? 'Turn your passion<br/>into pop-ups.' : 'Create<br/>unforgettable<br/>events.'}</h2></div>
    <div class="ob-form">
      <div class="ob-top">${back}<span class="tiny muted">Step ${step} of ${steps.length}</span></div>
      <div class="ob-steps">${steps.map((s, i) => `<span class="${step === i + 1 ? 'on' : step > i + 1 ? 'done' : ''}">${step > i + 1 ? ic('check') : i + 1}<em>${s}</em></span>`).join('')}</div>
      <div class="ob-body">${body}</div>
    </div>
  </div>`;
};

/* ---------- Consumer account (simulated) + interests ---------- */
function openAuth(mode = 'signup') {
  modal(`<div class="login">${wordmark('stacked')}
    <div class="seg auth-seg"><button class="${mode === 'signup' ? 'on' : ''}" data-act="auth-mode" data-m="signup">Create account</button><button class="${mode === 'login' ? 'on' : ''}" data-act="auth-mode" data-m="login">Log in</button></div>
    <h2 class="h1">${mode === 'signup' ? 'Save your favourite events' : 'Welcome back'}</h2>
    <p class="muted">${mode === 'signup' ? 'Create a free account to save events and follow vendors. Discovery is always free.' : 'Log in to see your saved events.'}</p>
    ${socialBtns('auth-social')}
    <form data-submit="auth" data-mode="${mode}" novalidate>
      ${mode === 'signup' ? '<label class="field"><span>First name</span><input name="name" required value="Léa" autocomplete="given-name"/></label>' : ''}
      <label class="field"><span>Email</span><input name="email" type="email" required value="lea@example.com" autocomplete="email"/></label>
      ${pwField('popcollective')}
      <button class="btn block">${mode === 'signup' ? 'Create free account' : 'Log in'}</button>
    </form>
    ${mode === 'login' ? '<p class="tiny center"><a class="link" data-act="fake-reset" href="#">Forgot password?</a></p>' : ''}
    <p class="tiny muted center">Simulated account — nothing is sent anywhere.</p></div>`, 'modal-auth');
}

function openInterests() {
  if (!OB.cats) OB.cats = Store.s.interests.cats.slice();
  if (!OB.hoods) OB.hoods = Store.s.interests.hoods.slice();
  modal(`<div class="interests">
    <p class="eyebrow">Personalize</p><h2 class="h1">What are you into?</h2>
    <p class="muted">We'll show events that match on your home page. You can change this anytime.</p>
    <h3>Categories</h3><div class="chips">${CATEGORIES.map((c) => `<button class="chip ${OB.cats.includes(c) ? 'on' : ''}" data-act="int-toggle" data-t="cats" data-v="${esc(c)}">${esc(c)}</button>`).join('')}</div>
    <h3>Neighbourhoods</h3><div class="chips">${Object.keys(NEIGHBOURHOODS).map((n) => `<button class="chip ${OB.hoods.includes(n) ? 'on' : ''}" data-act="int-toggle" data-t="hoods" data-v="${esc(n)}">${esc(n)}</button>`).join('')}</div>
    <div class="row gap end int-actions"><button class="btn btn-ghost" data-act="int-skip">Skip for now</button><button class="btn" data-act="int-save">Show my events</button></div>
  </div>`, 'modal-interests');
}

function finishLogin(name) {
  Store.s.consumerUser = { name };
  if (pendingSave && !Store.s.savedConsumer.includes(pendingSave)) Store.s.savedConsumer.push(pendingSave);
  if (pendingFollow && !Store.s.followed.includes(pendingFollow)) Store.s.followed.push(pendingFollow);
  pendingSave = null; pendingFollow = null;
}

function forYouRow() {
  const u = Store.s.consumerUser; const it = Store.s.interests;
  if (!u || (!it.cats.length && !it.hoods.length)) return '';
  const evs = Store.publicEvents().filter((e) => e.categories.some((c) => it.cats.includes(c)) || it.hoods.includes(e.neighbourhood)).slice(0, 4);
  return `<section class="section foryou">
    <div class="sec-head"><div><p class="eyebrow">Picked for you</p><h2 class="display">For you, ${esc(u.name)}</h2>
      <div class="chips mini">${[...it.cats, ...it.hoods].map((x) => `<span class="tag">${esc(x)}</span>`).join('')}<button class="link-btn" data-act="interests">${ic('edit')} Edit interests</button></div></div></div>
    ${evs.length ? `<div class="grid-cards">${evs.map((e) => eventCard(e)).join('')}</div>` : '<p class="muted">No upcoming events match yet — try adding a neighbourhood.</p>'}
  </section>`;
}

/* ---------- "Getting started" checklist on dashboards ---------- */
function gettingStarted(role) {
  const d = Store.s.done;
  if (d['hide-' + role]) return '';
  const items = role === 'vendor'
    ? [['Complete your store profile', '#/join/vendor?step=3', d.vendorProfile], ['Save your usual answers', '#/join/vendor?step=4', d.answers], ['Apply to an event', '#/v/discover', d.applied], ['Open an event group', '#/v/groups', Store.appsForVendor().some((a) => a.status === 'accepted') && d.openedGroup]]
    : [['Complete your organization profile', '#/join/organizer?step=3', d.orgProfile], ['Publish an event', '#/o/event/new', d.published], ['Review an application', '#/o/applications/mile-end', d.reviewed], ['Post an announcement', '#/o/group/mile-end', d.announced]];
  const n = items.filter((i) => i[2]).length;
  return `<section class="panel gs">
    <div class="gs-head"><div><h2>Getting started</h2><span class="muted small">${n} of ${items.length} done</span></div>
      <div class="gs-bar"><i style="width:${(n / items.length) * 100}%"></i></div>
      <button class="icon-btn" data-act="gs-hide" data-role="${role}" title="Hide">${ic('x')}</button></div>
    <div class="gs-items">${items.map(([t, h, ok]) => `<a href="${h}" class="gs-item ${ok ? 'ok' : ''}"><span class="gs-dot">${ok ? ic('check') : ''}</span>${t}${ok ? '' : ic('arrow')}</a>`).join('')}</div>
  </section>`;
}

/* ---------- Actions & submits (merged into app.js registries) ---------- */
const ObActions = {
  'login': () => openAuth('signup'),
  'auth-mode': (el) => openAuth(el.dataset.m),
  'auth-social': (el) => { finishLogin('Léa'); Store.save(); toast(`Signed in with ${el.dataset.p} (simulated)`, 'good'); openInterests(); },
  'fake-reset': () => toast('Password reset link sent (simulated)'),
  'interests': () => { OB.cats = null; OB.hoods = null; openInterests(); },
  'int-toggle': (el) => { const list = OB[el.dataset.t]; const v = el.dataset.v; const i = list.indexOf(v); if (i >= 0) list.splice(i, 1); else list.push(v); el.classList.toggle('on'); },
  'int-save': () => { Store.s.interests = { cats: OB.cats.slice(), hoods: OB.hoods.slice() }; OB.cats = null; OB.hoods = null; closeModal(); Store.save(); toast(`${ic('sparkle')} Your home page is now personalized`, 'good'); },
  'int-skip': () => { closeModal(); Store.save(); },
  'pw-toggle': (el) => { OB.showPw = !OB.showPw; const input = el.previousElementSibling; input.type = OB.showPw ? 'text' : 'password'; el.textContent = OB.showPw ? 'Hide' : 'Show'; },
  'ob-social': (el) => {
    const kind = parseHash().path.split('/')[2];
    Store.s.accounts[kind] = { name: kind === 'vendor' ? 'Inès Laurent' : 'Camille Tremblay', email: kind === 'vendor' ? 'hello@ateliernord.ca' : 'camille@mtlmakers.ca', via: el.dataset.p };
    Store.save(); toast(`Signed up with ${el.dataset.p} (simulated)`, 'good'); go(`#/join/${kind}?step=2`);
  },
  'ob-yearly': (el) => { OB.yearly = el.dataset.y === '1'; render(); },
  'ob-plan': (el) => { OB.plan = el.dataset.p; render(); },
  'ob-plan-continue': (el) => { Store.s.plans[el.dataset.kind] = OB.plan + (OB.yearly ? ' (yearly)' : ''); Store.save(); go(el.dataset.to); },
  'ob-photo': (el) => {
    const ph = el.dataset.ph; OB.photos = OB.photos.includes(ph) ? OB.photos.filter((x) => x !== ph) : [...OB.photos, ph];
    el.classList.toggle('on'); const c = document.getElementById('ob-photo-count'); if (c) c.textContent = `${OB.photos.length} selected`;
  },
  'gs-hide': (el) => { Store.s.done['hide-' + el.dataset.role] = true; Store.save(); },
};

const ObSubmits = {
  'ob-account': (f) => {
    if (!validateForm(f)) return;
    Store.s.accounts[f.dataset.kind] = { name: f.name.value.trim(), email: f.email.value.trim() };
    Store.save(); go(`#/join/${f.dataset.kind}?step=2`);
  },
  'ob-profile': (f) => {
    if (!validateForm(f)) return;
    if (OB.photos.length < 3) { toast('Please select at least 3 product photos', 'warn'); return; }
    const p = Store.s.profile;
    Object.assign(p, { description: f.description.value.trim(), category: f.category.value, social: f.social.value.trim(), photos: OB.photos.slice(0, 5) });
    Store.s.done.vendorProfile = true; Store.save(); go(f.dataset.to);
  },
  'ob-answers': (f) => {
    const p = Store.s.profile;
    Object.assign(p.answers, { power: f.power.value, price: f.price.value.trim(), era: f.era.value.trim(), notes: f.notes.value.trim() });
    p.previous = f.previous.value.trim();
    Store.s.done.answers = true; Store.save(); go(f.dataset.to);
  },
  'ob-org': (f) => {
    if (!validateForm(f)) return;
    Store.s.orgProfile = { name: f.name.value.trim(), neighbourhood: f.neighbourhood.value, instagram: f.instagram.value.trim(), website: f.website.value.trim(), description: f.description.value.trim() };
    Object.assign(ORGANIZERS[ME_ORG], { org: Store.s.orgProfile.name, handle: Store.s.orgProfile.instagram || ORGANIZERS[ME_ORG].handle });
    Store.s.done.orgProfile = true; Store.save(); go(f.dataset.to);
  },
  'auth': (f) => {
    if (!validateForm(f)) return;
    const name = f.name ? f.name.value.trim() : f.email.value.split('@')[0].replace(/^\w/, (c) => c.toUpperCase());
    finishLogin(name); Store.save();
    if (f.dataset.mode === 'signup') { toast(`Welcome, ${esc(name)}!`, 'good'); openInterests(); } else { closeModal(); toast(`Welcome back, ${esc(name)}`, 'good'); }
  },
};

// Live character counters for textareas with data-count.
document.addEventListener('input', (e) => {
  const t = e.target;
  if (t.dataset && t.dataset.count) { const c = document.getElementById(t.dataset.count); if (c) c.textContent = `${t.value.length}/${t.maxLength}`; }
  if (t.classList && t.classList.contains('invalid')) { t.classList.remove('invalid'); t.closest('.field')?.querySelector('.err')?.remove(); }
});
