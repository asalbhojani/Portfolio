// Shared project content — used by both ProjectsDesktop and ProjectsMobile
// so the two variants never drift out of sync with each other.
export const PROJECTS = [
  {
    id: '01', title: 'Taxi Dispatch System',  cat: 'Laravel',
    tags: ['Laravel', 'MySQL', 'Maps API', 'Real-time', 'Cron Jobs'],
    thumb: { accent: 'var(--accent)' },
    desc: 'Two-sided taxi management platform with real-time dispatching, auto-assignment algorithms, and MedAnswering integration.',
  },
  {
    id: '02', title: 'Insuranest',             cat: 'Laravel',
    tags: ['Laravel', 'MySQL', 'REST API', 'Push Notifications', 'Multi-role'],
    thumb: { accent: 'var(--accent-2)' },
    desc: 'Full-featured insurance administration dashboard with policy lifecycle management, claims processing, and mobile API.',
  },
  {
    id: '03', title: 'Dryflandia',             cat: 'Laravel',
    tags: ['Laravel', 'Stripe', 'PayPal', 'Multilingual', 'Subscriptions'],
    thumb: { accent: 'var(--accent)' },
    desc: 'Multilingual game management platform with subscription billing, dual payment gateways, and regional pricing.',
  },
  {
    id: '04', title: 'Antillean Properties',   cat: 'WordPress',
    tags: ['WordPress', 'Multilingual', 'AI Chatbot', 'Booking', 'Filters'],
    thumb: { accent: 'var(--accent-2)' },
    desc: 'Caribbean real estate site with advanced property search, appointment booking, and 24/7 AI chatbot in three languages.',
  },
  {
    id: '05', title: 'Sounds (WooCommerce)',   cat: 'WordPress',
    tags: ['WordPress', 'WooCommerce', 'Stripe', 'Apple Pay', '3 Admin Roles'],
    thumb: { accent: 'var(--accent)' },
    desc: 'Motorcycle audio products store with advanced SKU filtering, bundled packages, and four payment methods.',
  },
  {
    id: '06', title: 'Jarco — AI Voice Bot',   cat: 'AI',
    tags: ['OpenAI', 'ElevenLabs', 'Voice AI', 'Video Analysis', 'PHP'],
    thumb: { accent: 'var(--accent-2)' },
    desc: 'AI voice assistant for The Sales Coach Academy — responds in natural human voice and analyses video sales roleplays.',
    link: 'https://academy.thesalescoach.eu/',
  },
  {
    id: '07', title: 'Oil Mapping System',     cat: 'Laravel',
    tags: ['Laravel', 'Google Maps', 'Radius Filter', 'Virtual Tours'],
    thumb: { accent: 'var(--accent)' },
    desc: 'Location-based web app for the oil industry with interactive map pins, proximity filtering, and virtual tours.',
  },
  {
    id: '08', title: 'Pema Property',          cat: 'WordPress',
    tags: ['WordPress', 'Multi-currency', 'Agent Portal', 'Interactive Maps'],
    thumb: { accent: 'var(--accent-2)' },
    desc: 'Thai real estate site with agent dashboards, multi-currency conversion, and interactive project maps.',
  },
]
