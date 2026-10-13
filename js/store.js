/* Shared mock state — persisted in localStorage so every role (and the mobile preview iframe) sees the same data. */

const STORE_KEY = 'popco_demo_v1';
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
  };
}

const Store = {
  s: null,
  listeners: [],
  load() {
    try { this.s = JSON.parse(localStorage.getItem(STORE_KEY)); } catch (e) { this.s = null; }
    if (!this.s || !this.s.events) this.s = seedState();
  },
  save() {
    localStorage.setItem(STORE_KEY, JSON.stringify(this.s));
    this.listeners.forEach((fn) => fn());
  },
  reset() {
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
  group(eventId) {
    if (!this.s.groups[eventId]) this.s.groups[eventId] = { posts: [], files: [] };
    return this.s.groups[eventId];
  },
};
