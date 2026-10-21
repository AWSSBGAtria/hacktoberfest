/**
 * The judging panel for Hack Day Bengaluru 2026, in the organizers' order.
 *
 * Structured fields only - name, role, other positions, organisation and
 * credentials. Everything here came from the organizers' judge sheet; where
 * the sheet names no employer, `company` is simply absent rather than
 * guessed. Optional fields render only when present, so a judge with one
 * line of metadata gets a one-line card instead of an empty block.
 *
 * `accent` drives the index stamp; `accentInk` is the text colour that keeps
 * that stamp readable. Accents are assigned by grid position so no two
 * neighbours in a row carry the same colour.
 */
export const JUDGES = [
  {
    id: 'shefali-arora',
    name: 'Shefali Arora',
    photo: '/judges/shefali-arora.webp',
    accent: '#f5b726',
    accentInk: '#10201d',
    role: 'Cloud & Generative AI Consultant',
    positions: ['AWS Community Builder in AI Engineering'],
  },
  {
    id: 'sudha-subramaniam',
    name: 'Sudha Subramaniam',
    photo: '/judges/sudha-subramaniam.webp',
    accent: '#5146d9',
    accentInk: '#f7f7f2',
    role: 'Application and Migration Architect',
    company: 'IBM',
    positions: ['AWS Community Builder in AI Engineering'],
  },
  {
    id: 'bharath-ganesh',
    name: 'Bharath Ganesh',
    photo: '/judges/bharath-ganesh.webp',
    accent: '#8bb2de',
    accentInk: '#10201d',
    role: 'Senior DevOps Engineer & Cloud Architect',
    credentials: [
      'Google Cloud Professional Cloud Architect',
      'Microsoft Solutions Architect',
    ],
  },
  {
    id: 'jayachandra-reddy',
    name: 'Jayachandra Reddy',
    photo: '/judges/jayachandra-reddy.webp',
    accent: '#e97b77',
    accentInk: '#10201d',
    role: 'Senior Cloud Platform Engineer',
  },
  {
    id: 'sunil-kumar',
    name: 'Sunil Kumar',
    photo: '/judges/sunil-kumar.webp',
    accent: '#aebcff',
    accentInk: '#10201d',
    role: 'Technical Instructor & Consultant',
    company: 'Independent',
    credentials: ['Multi-cloud certified'],
  },
  {
    id: 'dhruv-verma',
    name: 'Dhruv Verma',
    photo: '/judges/dhruv-verma.webp',
    accent: '#e53927',
    accentInk: '#f7f7f2',
    role: 'Founding Engineer',
    company: 'SDLC.works',
    positions: ['Software Engineer, US-based startup'],
  },
];
