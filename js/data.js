/* POP/COLLECTIVE — fictional seed data for the Phase 1 prototype. */

const IMG = (id, w = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;

const PHOTOS = {
  hero: 'photo-1784288404500-f33c43993d54',
  heroAlt: 'photo-1777828630999-198c1597266e',
  tents: 'photo-1768722688414-27b8220b18d1',
  park: 'photo-1780124643271-bc7f8952e60a',
  overpass: 'photo-1787038728137-82459e2e59c5',
  crowd: 'photo-1714523479594-13c0bb72fcf3',
  flea: 'photo-1685883518161-63ccb05aef83',
  rackStreet: 'photo-1685875017918-c2ce017438a7',
  indoor: 'photo-1781358463802-219111e5e0ae',
  nightBun: 'photo-1765398631596-e38a5cb0982b',
  barista: 'photo-1768162125841-c17992473464',
  flowersBrowse: 'photo-1778046815787-6d598c9b5ba6',
  flowerAwning: 'photo-1768383236295-66f792aa32bb',
  streetMarket: 'photo-1609039064745-80287b4fb753',
  festival: 'photo-1786488219652-c312ef0215c6',
  cobble: 'photo-1767290444122-5230a7fefef7',
  camille: 'photo-1517462964-21fdcec3f25b',
};

const CATEGORIES = ['Vintage', 'Fashion', 'Handmade', 'Art', 'Design', 'Home', 'Jewelry', 'Food & Drinks', 'Wellness', 'Beauty'];

const NEIGHBOURHOODS = {
  'Mile End / Plateau': [45.5207, -73.5790],
  'Plateau-Mont-Royal': [45.5270, -73.5690],
  'Old Montreal': [45.5089, -73.5517],
  'Griffintown': [45.4906, -73.5626],
  'Little Italy': [45.5363, -73.6147],
  'Verdun': [45.4592, -73.5703],
  'Saint-Henri': [45.4801, -73.5770],
  'Rosemont': [45.5418, -73.5878],
};

const ORGANIZERS = {
  'org-camille': { id: 'org-camille', name: 'Camille Tremblay', org: 'Montreal Makers Collective', handle: '@mtlmakerscollective', photo: PHOTOS.camille },
  'org-espace': { id: 'org-espace', name: 'Julien Roy', org: 'Espace Créatif', handle: '@espacecreatif' },
  'org-studio': { id: 'org-studio', name: 'Amira B.', org: 'Studio Collectif', handle: '@studiocollectif' },
  'org-plateau': { id: 'org-plateau', name: 'Nora L.', org: 'Les Marchés du Plateau', handle: '@marchesduplateau' },
  'org-nocturne': { id: 'org-nocturne', name: 'Marco D.', org: 'Marché Nocturne MTL', handle: '@nocturnemtl' },
  'org-sud': { id: 'org-sud', name: 'Émilie G.', org: 'Sud-Ouest Collectif', handle: '@sudouestcollectif' },
};

const VENDORS = {
  'v-atelier-nord': { id: 'v-atelier-nord', name: 'Atelier Nord', category: 'Vintage / Fashion', handle: '@ateliernord', site: 'ateliernord.ca', photo: 'photo-1540221652346-e5dd6b50f3e7',
    photos: ['photo-1540221652346-e5dd6b50f3e7', 'photo-1551232864-3f0890e580d9', 'photo-1600709487035-f5d21265155d', 'photo-1573677275957-d6dbf54c0a4e'],
    bio: 'A Montreal-based curated vintage fashion brand specializing in archival and contemporary pieces. We believe in giving beautiful pieces a second life.' },
  'v-vera': { id: 'v-vera', name: 'Vera Vintage', category: 'Vintage Clothing', handle: '@veravintage', photo: 'photo-1647664856968-880b8eccd588', bio: 'Hand-picked 70s–90s womenswear sourced across Québec.' },
  'v-studio-no': { id: 'v-studio-no', name: 'Studio No', category: 'Fashion', handle: '@studiono', photo: 'photo-1643935242152-bccdddd3b816', bio: 'Small-batch garments cut and sewn in Saint-Henri.' },
  'v-kaji': { id: 'v-kaji', name: 'Kaji Officiel', category: 'Vintage Clothing', handle: '@kajiofficiel', photo: 'photo-1637228393246-c38a4b3d2011', bio: 'Curated vintage and designer pieces for everyday.' },
  'v-wildflower': { id: 'v-wildflower', name: 'Wildflower Jewelry', category: 'Jewelry', handle: '@wildflowerjewelry', photo: 'photo-1679590988898-50c20140aec0', bio: 'Hand-formed brass and silver jewelry.' },
  'v-luna': { id: 'v-luna', name: 'Les Bougies Luna', category: 'Candles', handle: '@lesbougiesluna', photo: 'photo-1643122966676-29e8597257f7', bio: 'Soy candles poured in small batches in Rosemont.' },
  'v-sunday': { id: 'v-sunday', name: 'Maison Sunday', category: 'Home Decor', handle: '@maisonsunday', photo: 'photo-1597696929736-6d13bed8e6a8', bio: 'Slow-living objects for the home.' },
  'v-lume': { id: 'v-lume', name: 'Atelier Lume', category: 'Ceramics', handle: '@atelierlume', photo: 'photo-1520408222757-6f9f95d87d5d', bio: 'Wheel-thrown ceramics inspired by nature and architecture.' },
  'v-petit': { id: 'v-petit', name: 'Le Petit Studio', category: 'Art & Prints', handle: '@lepetitstudio', photo: 'photo-1764777313307-ecfd2eb20990', bio: 'Risograph prints and illustrated goods.' },
  'v-backyard': { id: 'v-backyard', name: 'Café Backyard', category: 'Food & Drinks', handle: '@cafebackyard', photo: PHOTOS.barista, bio: 'Pour-overs and pastries on wheels.' },
  'v-bloom': { id: 'v-bloom', name: 'Bloom Atelier', category: 'Flowers', handle: '@bloomatelier', photo: 'photo-1775027488494-e0255ec83c9b', bio: 'Dried and seasonal flower arrangements.' },
  'v-north': { id: 'v-north', name: 'North of Here', category: 'Wellness', handle: '@northofhere', photo: 'photo-1613068431228-8cb6a1e92573', bio: 'Botanical body care made in Montréal.' },
};

const STANDARD_FIELDS = [
  { key: 'name', label: 'Business name', locked: true },
  { key: 'description', label: 'Business description' },
  { key: 'category', label: 'Product category' },
  { key: 'social', label: 'Website / social media' },
  { key: 'photos', label: 'Product photos (3–5)' },
  { key: 'previous', label: 'Previous events' },
];

const genericBooths = (base = 150) => [
  { id: 'b1', name: '6-ft table', price: base, qty: 30 },
  { id: 'b2', name: '10×10 tent space', price: base + 80, qty: 12 },
  { id: 'b3', name: 'Shared table (½)', price: Math.round(base * 0.55), qty: 10 },
];

const SEED_EVENTS = [
  {
    id: 'mile-end', title: 'Mile End Vintage Market', organizerId: 'org-camille', status: 'published', source: 'organizer',
    venue: 'Le Livart', address: '3980 Rue Saint-Denis, Montréal, QC', neighbourhood: 'Mile End / Plateau', lat: 45.5207, lng: -73.5790,
    date: '2027-06-07', start: '11:00', end: '17:00', categories: ['Vintage', 'Fashion', 'Handmade'],
    img: PHOTOS.rackStreet, gallery: [PHOTOS.flea, 'photo-1540221652346-e5dd6b50f3e7', PHOTOS.hero, 'photo-1647664856968-880b8eccd588'],
    desc: 'A curated vintage market inside the rooms and courtyard of Le Livart — archival fashion, denim, records and handmade goods from 60 independent Montréal sellers. Come dig, try on, and stay for the DJ set in the courtyard.',
    metro: 'Mont-Royal (Orange line) · 8 min walk', parking: 'Paid street parking on Saint-Denis & Rachel · BIXI station at the corner', access: 'Ground floor & courtyard are wheelchair accessible', pets: 'Leashed dogs welcome in the courtyard', entry: 'Free entry',
    schedule: [['11:00', 'Market opens'], ['13:00', 'Vintage styling session'], ['15:00', 'DJ set in the courtyard'], ['17:00', 'Market closes']],
    deadline: '2027-04-30', views: 3412,
    booths: [
      { id: 'b1', name: '6-ft table', price: 220, qty: 30 },
      { id: 'b2', name: 'Clothing rack (add-on)', price: 40, qty: 40, addon: true },
      { id: 'b3', name: '10×10 courtyard space', price: 280, qty: 12 },
      { id: 'b4', name: 'Shared table (½)', price: 120, qty: 10 },
    ],
    fields: ['name', 'description', 'category', 'social', 'photos', 'previous'],
    questions: [
      { key: 'era', label: 'Which era(s) does your collection focus on?' },
      { key: 'power', label: 'Do you need access to electricity?' },
      { key: 'price', label: 'What is your typical price range?' },
      { key: 'notes', label: 'Anything else the organizer should know?' },
    ],
  },
  {
    id: 'printemps', title: 'Printemps Local', organizerId: 'org-camille', status: 'published', source: 'organizer',
    venue: 'Parc La Fontaine', address: '3933 Av. du Parc-La Fontaine, Montréal, QC', neighbourhood: 'Plateau-Mont-Royal', lat: 45.5270, lng: -73.5690,
    date: '2027-05-16', start: '10:00', end: '16:00', categories: ['Food & Drinks', 'Wellness', 'Handmade'],
    img: PHOTOS.park, gallery: [PHOTOS.flowersBrowse, PHOTOS.barista, PHOTOS.tents],
    desc: 'The first outdoor market of the season: flowers, coffee, body care and handmade goods under the trees of Parc La Fontaine.',
    metro: 'Sherbrooke (Orange line) · 9 min walk', parking: 'Street parking on Rachel & Calixa-Lavallée', access: 'Paved paths, accessible washrooms', pets: 'Leashed dogs welcome', entry: 'Free entry',
    schedule: [['10:00', 'Market opens'], ['12:00', 'Live acoustic set'], ['16:00', 'Market closes']],
    deadline: '2027-03-31', views: 1180, booths: genericBooths(160), fields: ['name', 'description', 'category', 'social', 'photos'],
    questions: [{ key: 'power', label: 'Do you need access to electricity?' }, { key: 'notes', label: 'Anything else the organizer should know?' }],
  },
  {
    id: 'winter-popup', title: 'Winter Pop-Up', organizerId: 'org-camille', status: 'draft', source: 'organizer',
    venue: 'Le Livart', address: '3980 Rue Saint-Denis, Montréal, QC', neighbourhood: 'Mile End / Plateau', lat: 45.5207, lng: -73.5790,
    date: '2027-01-23', start: '12:00', end: '18:00', categories: ['Fashion', 'Art'],
    img: PHOTOS.indoor, gallery: [], desc: 'An indoor winter edition — cozy, warm, and full of makers.',
    metro: 'Mont-Royal (Orange line) · 8 min walk', parking: 'Paid street parking', access: 'Ground floor accessible', pets: 'No pets indoors', entry: 'Free entry',
    schedule: [], deadline: '2026-12-15', views: 0, booths: genericBooths(180), fields: ['name', 'description', 'category', 'photos'], questions: [],
  },
  {
    id: 'fetes', title: 'Le Marché des Fêtes', organizerId: 'org-espace', status: 'published', source: 'admin',
    venue: 'Marché Bonsecours', address: '350 Rue Saint-Paul E, Montréal, QC', neighbourhood: 'Old Montreal', lat: 45.5089, lng: -73.5517,
    date: '2026-12-05', start: '10:00', end: '18:00', categories: ['Handmade', 'Food & Drinks', 'Home'],
    img: PHOTOS.indoor, gallery: [PHOTOS.cobble, PHOTOS.nightBun], desc: 'A holiday market of creators, designers and local artisans under the dome of Marché Bonsecours.',
    metro: 'Champ-de-Mars (Orange line) · 7 min walk', parking: 'Indigo lot on Rue Saint-Paul · street parking', access: 'Elevator access to all floors', pets: 'No pets indoors', entry: 'Free entry',
    schedule: [['10:00', 'Doors open'], ['14:00', 'Choir performance'], ['18:00', 'Doors close']], deadline: '2026-10-31', views: 5120,
    booths: genericBooths(200), fields: ['name', 'description', 'category', 'photos'], questions: [],
  },
  {
    id: 'sommet', title: 'Sommet Créatif', organizerId: 'org-studio', status: 'published', source: 'admin',
    venue: 'Arsenal', address: '2020 Rue William, Montréal, QC', neighbourhood: 'Griffintown', lat: 45.4906, lng: -73.5626,
    date: '2027-08-21', start: '11:00', end: '19:00', categories: ['Design', 'Art', 'Home'],
    img: PHOTOS.overpass, gallery: [PHOTOS.festival], desc: 'Design objects, prints and furniture from Montréal studios in a former shipyard.',
    metro: 'Georges-Vanier (Orange line) · 12 min walk', parking: 'On-site paid parking', access: 'Wheelchair accessible', pets: 'Leashed dogs welcome', entry: '$5 suggested donation',
    schedule: [['11:00', 'Doors open'], ['16:00', 'Designer talk'], ['19:00', 'Close']], deadline: '2027-06-01', views: 2210,
    booths: genericBooths(190), fields: ['name', 'description', 'category', 'social', 'photos'], questions: [],
  },
  {
    id: 'plateau', title: 'Marché du Plateau', organizerId: 'org-plateau', status: 'published', source: 'admin',
    venue: 'Avenue Duluth', address: 'Av. Duluth E & Rue Saint-Hubert, Montréal, QC', neighbourhood: 'Plateau-Mont-Royal', lat: 45.5185, lng: -73.5770,
    date: '2027-07-11', start: '10:00', end: '17:00', categories: ['Art', 'Handmade', 'Jewelry'],
    img: PHOTOS.tents, gallery: [PHOTOS.streetMarket], desc: 'A pedestrian street market of illustrators, jewelers and small-batch makers.',
    metro: 'Mont-Royal (Orange line) · 10 min walk', parking: 'Street parking (limited)', access: 'Street level', pets: 'Leashed dogs welcome', entry: 'Free entry',
    schedule: [['10:00', 'Market opens'], ['17:00', 'Market closes']], deadline: '2027-05-15', views: 1890,
    booths: genericBooths(140), fields: ['name', 'description', 'category', 'photos'], questions: [],
  },
  {
    id: 'nocturne', title: 'Petite-Italie Night Market', organizerId: 'org-nocturne', status: 'published', source: 'admin',
    venue: 'Marché Jean-Talon', address: '7070 Av. Henri-Julien, Montréal, QC', neighbourhood: 'Little Italy', lat: 45.5363, lng: -73.6147,
    date: '2027-06-25', start: '17:00', end: '23:00', categories: ['Food & Drinks', 'Art'],
    img: PHOTOS.nightBun, gallery: [PHOTOS.festival], desc: 'Street food, natural wine and late-night makers under the lights of Jean-Talon.',
    metro: 'Jean-Talon (Orange & Blue) · 4 min walk', parking: 'Jean-Talon market parking', access: 'Street level', pets: 'Leashed dogs welcome', entry: 'Free entry',
    schedule: [['17:00', 'Market opens'], ['20:00', 'Live band'], ['23:00', 'Close']], deadline: '2027-05-01', views: 4020,
    booths: genericBooths(170), fields: ['name', 'description', 'category', 'photos'], questions: [],
  },
  {
    id: 'verdun', title: 'Verdun Flea on Wellington', organizerId: 'org-sud', status: 'published', source: 'admin',
    venue: 'Rue Wellington', address: 'Rue Wellington & 4e Av., Verdun, QC', neighbourhood: 'Verdun', lat: 45.4592, lng: -73.5703,
    date: '2027-07-18', start: '10:00', end: '17:00', categories: ['Vintage', 'Home'],
    img: PHOTOS.streetMarket, gallery: [PHOTOS.crowd], desc: 'A summer flea market along Wellington — furniture, records, vintage and home goods.',
    metro: "De l'Église (Green line) · 3 min walk", parking: 'Street parking on side streets', access: 'Street level', pets: 'Leashed dogs welcome', entry: 'Free entry',
    schedule: [['10:00', 'Market opens'], ['17:00', 'Market closes']], deadline: '2027-06-01', views: 1460,
    booths: genericBooths(120), fields: ['name', 'description', 'category', 'photos'], questions: [],
  },
  {
    id: 'st-henri', title: 'Saint-Henri Makers Day', organizerId: 'org-sud', status: 'published', source: 'organizer',
    venue: 'Marché Atwater', address: '138 Av. Atwater, Montréal, QC', neighbourhood: 'Saint-Henri', lat: 45.4801, lng: -73.5770,
    date: '2027-09-12', start: '10:00', end: '16:00', categories: ['Handmade', 'Food & Drinks', 'Art'],
    img: PHOTOS.flowersBrowse, gallery: [PHOTOS.flowerAwning], desc: 'Makers set up along the canal beside Marché Atwater.',
    metro: 'Lionel-Groulx (Green & Orange) · 6 min walk', parking: 'Atwater market parking', access: 'Wheelchair accessible', pets: 'Leashed dogs welcome', entry: 'Free entry',
    schedule: [['10:00', 'Market opens'], ['16:00', 'Market closes']], deadline: '2027-07-15', views: 980,
    booths: genericBooths(150), fields: ['name', 'description', 'category', 'photos'], questions: [],
  },
  {
    id: 'rosemont', title: 'Fleurs & Céramique', organizerId: 'org-plateau', status: 'published', source: 'admin',
    venue: 'Parc Molson', address: 'Rue Beaubien E & 1re Av., Montréal, QC', neighbourhood: 'Rosemont', lat: 45.5418, lng: -73.5878,
    date: '2027-04-24', start: '10:00', end: '16:00', categories: ['Home', 'Wellness', 'Art'],
    img: PHOTOS.flowerAwning, gallery: [], desc: 'Spring flowers and ceramics in Parc Molson.',
    metro: 'Beaubien (Orange line) · 5 min walk', parking: 'Street parking', access: 'Paved paths', pets: 'Leashed dogs welcome', entry: 'Free entry',
    schedule: [['10:00', 'Market opens'], ['16:00', 'Market closes']], deadline: '2027-03-01', views: 760,
    booths: genericBooths(130), fields: ['name', 'description', 'category', 'photos'], questions: [],
  },
];

const ts = (d) => new Date(d).toISOString();

const SEED_APPLICATIONS = [
  { id: 'app-nord-mileend', eventId: 'mile-end', vendorId: 'v-atelier-nord', status: 'pending', selection: { b1: 1, b2: 2 },
    answers: { era: '1970s–1990s, with some archival 60s pieces', power: 'No', price: '$25 – $180', notes: 'We bring our own mirror and a fitting screen.' },
    message: 'Hi Camille! We would love to be part of the Mile End Vintage Market — we bring a tightly curated rack of archival and 90s pieces.',
    history: [{ status: 'pending', at: ts('2026-10-02T14:20') }] },
  { id: 'app-vera', eventId: 'mile-end', vendorId: 'v-vera', status: 'accepted', selection: { b3: 1 }, answers: { era: '70s–90s', power: 'No' }, message: '', history: [{ status: 'pending', at: ts('2026-09-20T10:00') }, { status: 'accepted', at: ts('2026-09-25T09:00') }] },
  { id: 'app-studiono', eventId: 'mile-end', vendorId: 'v-studio-no', status: 'accepted', selection: { b1: 1, b2: 1 }, answers: { era: 'Contemporary', power: 'Yes' }, message: '', history: [{ status: 'pending', at: ts('2026-09-21T10:00') }, { status: 'accepted', at: ts('2026-09-26T09:00') }] },
  { id: 'app-lume', eventId: 'mile-end', vendorId: 'v-lume', status: 'accepted', selection: { b1: 1 }, answers: { power: 'No' }, message: '', history: [{ status: 'pending', at: ts('2026-09-22T10:00') }, { status: 'accepted', at: ts('2026-09-28T09:00') }] },
  { id: 'app-kaji', eventId: 'mile-end', vendorId: 'v-kaji', status: 'pending', selection: { b1: 1, b2: 1 }, answers: { era: '90s & Y2K', power: 'No' }, message: '', history: [{ status: 'pending', at: ts('2026-10-04T16:00') }] },
  { id: 'app-wild', eventId: 'mile-end', vendorId: 'v-wildflower', status: 'pending', selection: { b4: 1 }, answers: { power: 'No' }, message: '', history: [{ status: 'pending', at: ts('2026-10-06T11:00') }] },
  { id: 'app-luna', eventId: 'mile-end', vendorId: 'v-luna', status: 'waitlisted', selection: { b1: 1 }, answers: { power: 'No' }, message: '', history: [{ status: 'pending', at: ts('2026-09-29T11:00') }, { status: 'waitlisted', at: ts('2026-10-01T11:00') }] },
  { id: 'app-sunday', eventId: 'mile-end', vendorId: 'v-sunday', status: 'rejected', selection: { b3: 1 }, answers: {}, message: '', history: [{ status: 'pending', at: ts('2026-09-18T11:00') }, { status: 'rejected', at: ts('2026-09-24T11:00') }] },
  { id: 'app-north-pl', eventId: 'printemps', vendorId: 'v-north', status: 'pending', selection: { b1: 1 }, answers: {}, message: '', history: [{ status: 'pending', at: ts('2026-10-05T11:00') }] },
  { id: 'app-bloom-pl', eventId: 'printemps', vendorId: 'v-bloom', status: 'accepted', selection: { b2: 1 }, answers: {}, message: '', history: [{ status: 'pending', at: ts('2026-09-30T11:00') }, { status: 'accepted', at: ts('2026-10-03T11:00') }] },
  { id: 'app-backyard-pl', eventId: 'printemps', vendorId: 'v-backyard', status: 'pending', selection: { b2: 1 }, answers: {}, message: '', history: [{ status: 'pending', at: ts('2026-10-07T11:00') }] },
  // Atelier Nord's other applications (other organizers)
  { id: 'app-nord-fetes', eventId: 'fetes', vendorId: 'v-atelier-nord', status: 'accepted', selection: { b1: 1 }, answers: {}, message: '', history: [{ status: 'pending', at: ts('2026-09-10T11:00') }, { status: 'accepted', at: ts('2026-09-18T11:00') }] },
  { id: 'app-nord-sommet', eventId: 'sommet', vendorId: 'v-atelier-nord', status: 'waitlisted', selection: { b1: 1 }, answers: {}, message: '', history: [{ status: 'pending', at: ts('2026-09-12T11:00') }, { status: 'waitlisted', at: ts('2026-09-20T11:00') }] },
  { id: 'app-petit-fetes', eventId: 'fetes', vendorId: 'v-petit', status: 'accepted', selection: { b1: 1 }, answers: {}, message: '', history: [{ status: 'accepted', at: ts('2026-09-18T11:00') }] },
];

const SEED_GROUPS = {
  'mile-end': {
    posts: [
      { id: 'p1', type: 'announcement', author: 'org', text: 'Welcome, vendors! Load-in starts at 8:30 AM through the Rue Rachel courtyard gate. Please have your booth set up by 10:45 AM.', at: ts('2026-10-01T09:00') },
      { id: 'p2', type: 'message', author: 'v-vera', text: 'So excited for this one! Is there wifi for card readers in the courtyard?', at: ts('2026-10-03T13:10') },
      { id: 'p3', type: 'message', author: 'org', text: 'Yes — network “Livart-Vendors”, password shared on the day. 📶', at: ts('2026-10-03T14:02') },
      { id: 'p4', type: 'announcement', author: 'org', text: 'The official flyer is up in Files — please share it on your socials and tag @mtlmakerscollective!', at: ts('2026-10-08T11:30') },
    ],
    files: [
      { id: 'f1', name: 'MileEnd_Vintage_Flyer.pdf', size: '2.4 MB', kind: 'flyer' },
      { id: 'f2', name: 'Vendor_Guide_2027.pdf', size: '640 KB', kind: 'doc' },
      { id: 'f3', name: 'Floor_Plan_LeLivart.png', size: '1.1 MB', kind: 'image' },
    ],
  },
  'printemps': { posts: [{ id: 'p1', type: 'announcement', author: 'org', text: 'Booth map coming in March. Thanks for joining Printemps Local!', at: ts('2026-10-04T09:00') }], files: [] },
  'fetes': { posts: [{ id: 'p1', type: 'announcement', author: 'org', text: 'Bienvenue! Indoor tables and 2 chairs are provided for every booth.', at: ts('2026-09-20T09:00') }], files: [{ id: 'f1', name: 'Marche_des_Fetes_Poster.pdf', size: '3.1 MB', kind: 'flyer' }] },
};

const SEED_PROFILE = {
  vendorId: 'v-atelier-nord',
  description: VENDORS['v-atelier-nord'].bio,
  category: 'Vintage / Fashion',
  social: '@ateliernord · ateliernord.ca',
  previous: 'Puces POP (2025), Marché des Fêtes (2025), Souk @ SAT (2024)',
  photos: VENDORS['v-atelier-nord'].photos,
  answers: { era: '1970s–1990s, with some archival 60s pieces', power: 'No', price: '$25 – $180', notes: 'We bring our own mirror and a fitting screen.' },
};
