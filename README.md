# pop-collective

**POP/COLLECTIVE — Phase 1 interactive prototype.**
A clickable prototype using fictional data that connects the three sides of the platform: **Consumers**, **Vendors** and **Organizers**. There is no backend, real authentication or payments. Everything is mock data stored in the browser.

## Walkthrough: the connected scenario (≈2 minutes)

Use the dark **demo bar** at the top to switch roles at any time. **▶ Scenario** opens a guided checklist with live status, and **Reset** restores the starting data.

1. **Vendor: Atelier Nord.** Open *My Applications → Mile End Vintage Market*. The status is **Pending** with a 6-ft table + 2 racks = **$300**. The event group is **locked**.
2. **Organizer: Camille, Montreal Makers Collective.** Open *Applications* and select Atelier Nord. Review the answers, photos and booth selection, then click **Accept**.
3. The organizer's totals update right away: **Accepted 3 → 4** and **estimated revenue $760 → $1,060** (counted from accepted booth selections only; no money changes hands).
4. **Vendor.** Status is now **Accepted**, a notification appears on the dashboard, and the **Event Group** unlocks with announcements, a vendor chat and shared files (flyer, vendor guide, floor plan).
5. **Consumer.** Atelier Nord now appears under *Vendors at this event* on the public Mile End Vintage Market page.

## What's included

| Role | Screens |
|---|---|
| **Consumer** (free) | Editorial homepage with the wordmark set into the 35mm-style hero photo · Discover with list/map split, clickable Montréal map markers and filters (date, category, neighbourhood, free entry) · Event page with date, location, **nearest metro, parking**, accessibility, schedule and vendors · Public maker profile · Simulated login to save events |
| **Vendor** | Dashboard · Browse/filter/save events · Vendor event view (booth pricing, what the form asks) · **Apply** with a reusable profile (prefilled answers and photos, all editable, optionally saved back to the profile) · Application tracking with status timeline · Event groups unlocked after acceptance · Brand profile editor |
| **Organizer** | Dashboard with totals and estimated revenue · My events (published / drafts) · **Create/edit event** in 4 steps: details → booth pricing → standardized application form with **up to 4 custom questions** → save as draft or publish (published events go live on the public map) · Applicant review with **Accept / Waitlist / Reject** · Event group with announcements and file sharing |
| **Membership** | Vendor and Organizer plans with `$XX/month` placeholders; Consumer is free |
| **Brand** | Primary and alternate (stacked `POP//`) logo treatments, **Palette B (default) and Palette A** (switch live from the demo bar), type system, and live mobile previews |

Every screen is responsive. The **Mobile** button in the demo bar opens the current page in a 390px phone frame.

## Tools used

- Hand-written **HTML, CSS and vanilla JavaScript** with no framework or build step, so it deploys as a static site on Vercel.
- **Leaflet** + **OpenStreetMap** tiles for the map (no API key needed).
- **Google Fonts** as free stand-ins for the brand references: *Bricolage Grotesque* (display / wordmark), *Fraunces* (editorial serif), *Inter* (dashboards) and *Caveat* (handwritten accents).
- **Unsplash** photography with a CSS 35mm treatment (warm tone, grain, vignette, date stamp).
- Shared state in `localStorage`, so every role and the mobile preview see the same data.
- AI-assisted development (Claude Code) for scaffolding and QA, plus Playwright for automated click-through testing.

## Suggestions for simplifying Phase 1

1. **Keep payments out of Phase 1.** Show booth selection and *estimated* revenue only, and let vendors pay organizers the way they do today. Stripe Connect, refunds and payouts can come in Phase 2, once the core loop (publish → apply → accept → communicate) has been validated with real Montréal markets.
2. **Make event groups one-way plus one thread per event.** Organizer announcements and shared files, plus a single simple group thread, are enough. Skip DMs, read receipts and real-time typing. This removes most of the messaging complexity while covering what organizers actually need on event day.
3. *(Bonus)* **Launch Montréal-only with a `city` field from day one**, and have the POP/COLLECTIVE team curate listings first. Organizer "claim this listing" can follow once organizers start joining.

## Run locally

Open `index.html` through any static server, for example `npx serve .` or `python -m http.server`.
