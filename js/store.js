/* Shared mock state — persisted in localStorage so every role (and the mobile preview iframe) sees the same data. */

const STORE_KEY = 'popco_demo_v2';
const ME_VENDOR = 'v-atelier-nord';
const ME_ORG = 'org-camille';

const clone = (o) => JSON.parse(JSON.stringify(o));

function seedState() {
  return {
    palette: 'b',
    consumerUser: null,
    savedConsumer: ['mile-end'],
    savedVendor: ['plateau'],
    events: clone(SEED_EVENTS),
    applications: clone(SEED_APPLICATIONS),
    groups: clone(SEED_GROUPS),
    profile: clone(SEED_PROFILE),
    notifications: [],
    claims: clone(SEED_CLAIMS),
  };
}

const Store = {
  s: null,
  listeners: [],
  load() {
    try { this.s = JSON.parse(localStorage.getItem(STORE_KEY)); } catch (e) { this.s = null; }
    if (!this.s || !this.s.events) this.s = seedState();
    this.s = { followed: [], interested: {}, cityVotes: {}, newsletter: false, plans: { vendor: 'Pro', organizer: 'Pro' }, accounts: {}, orgProfile: null, interests: { cats: [], hoods: [] }, done: {}, ...this.s };
    if (this.s.orgProfile) Object.assign(ORGANIZERS[ME_ORG], { org: this.s.orgProfile.name, handle: this.s.orgProfile.instagram || ORGANIZERS[ME_ORG].handle });
  },
  save() {
    localStorage.setItem(STORE_KEY, JSON.stringify(this.s));
    this.listeners.forEach((fn) => fn());
  },
  reset() {
    Object.assign(ORGANIZERS[ME_ORG], { org: 'Montreal Makers Collective', handle: '@mtlmakerscollective' });
    this.s = seedState();
    this.save();
  },
  onChange(fn) { this.listeners.push(fn); },

  event(id) { return this.s.events.find((e) => e.id === id); },
  publicEvents() { return this.s.events.filter((e) => e.status === 'published').sort((a, b) => a.date.localeCompare(b.date)); },
  orgEvents(orgId = ME_ORG) { return this.s.events.filter((e) => e.organizerId === orgId); },
  appsForEvent(eventId) { return this.s.applications.filter((a) => a.eventId === eventId); },
  appsForVendor(vendorId = ME_VENDOR) { return this.s.applications.filter((a) => a.vendorId === vendorId); },
  app(id) { return this.s.applications.find((a) => a.id === id); },
  myAppFor(eventId) { return this.s.applications.find((a) => a.eventId === eventId && a.vendorId === ME_VENDOR); },

  appTotal(app) {
    const ev = this.event(app.eventId);
    return Object.entries(app.selection || {}).reduce((sum, [bid, q]) => {
      const b = ev.booths.find((x) => x.id === bid);
      return sum + (b ? b.price * q : 0);
    }, 0);
  },
  eventStats(eventId) {
    const apps = this.appsForEvent(eventId);
    const by = (st) => apps.filter((a) => a.status === st);
    const accepted = by('accepted');
    const ev = this.event(eventId);
    const capacity = ev.booths.filter((b) => !b.addon).reduce((s, b) => s + Number(b.qty || 0), 0);
    const filled = accepted.reduce((s, a) => s + Object.entries(a.selection).reduce((n, [bid, q]) => {
      const b = ev.booths.find((x) => x.id === bid);
      return n + (b && !b.addon ? q : 0);
    }, 0), 0);
    return {
      total: apps.length, pending: by('pending').length, accepted: accepted.length,
      waitlisted: by('waitlisted').length, rejected: by('rejected').length,
      revenue: accepted.reduce((s, a) => s + this.appTotal(a), 0),
      pipeline: by('pending').reduce((s, a) => s + this.appTotal(a), 0),
      capacity, filled,
    };
  },

  setStatus(appId, status) {
    const a = this.app(appId);
    if (!a || a.status === status) return;
    a.status = status;
    a.history.push({ status, at: new Date().toISOString() });
    const ev = this.event(a.eventId);
    if (a.vendorId === ME_VENDOR) {
      this.s.notifications.unshift({ id: 'n' + Date.now(), to: 'vendor', text: `${ev.title}: your application is now ${status}.`, at: new Date().toISOString(), eventId: ev.id });
    }
    if (status === 'accepted') {
      const g = this.group(a.eventId);
      g.posts.push({ id: 'p' + Date.now(), type: 'system', author: 'system', text: `${VENDORS[a.vendorId].name} joined the event group.`, at: new Date().toISOString() });
    }
    this.save();
  },
  // Deterministic duplicate check: same date, ~same location, similar normalized title.
  duplicatesOf(ev) {
    const norm = (t) => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter((w) => w.length > 2 && !['the', 'market', 'marche', 'des', 'les'].includes(w));
    const km = (a, b) => { const R = 6371, r = Math.PI / 180, dLa = (b.lat - a.lat) * r, dLo = (b.lng - a.lng) * r; const x = Math.sin(dLa / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLo / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(x)); };
    const A = new Set(norm(ev.title));
    return this.s.events.filter((o) => o.id !== ev.id && ['published', 'review'].includes(o.status)).map((o) => {
      const B = new Set(norm(o.title));
      const inter = [...A].filter((w) => B.has(w)).length;
      const jac = inter / (new Set([...A, ...B]).size || 1);
      const dist = km(ev, o);
      const reasons = [];
      let score = 0;
      if (o.date === ev.date) { score += 40; reasons.push('same date'); }
      if (dist < 0.3) { score += 35; reasons.push(`${Math.round(dist * 1000)} m apart`); }
      if (jac > 0) { score += Math.round(jac * 25); reasons.push(`title ${Math.round(jac * 100)}% similar`); }
      return { event: o, score, reasons };
    }).filter((d) => d.score >= 60).sort((a, b) => b.score - a.score);
  },

  group(eventId) {
    if (!this.s.groups[eventId]) this.s.groups[eventId] = { posts: [], files: [] };
    return this.s.groups[eventId];
  },
};
