'use strict';

// Canonical "About Us" dropdown items. `vision.html` is used everywhere (the
// pre-existing dead `mvv.html` link that appeared in index.html's sticky/mobile
// nav has been normalized away — it never pointed to a real file).
const ABOUT_US_ITEMS = [
  { href: '/profile.html', label: 'Our Profile' },
  { href: '/history.html', label: 'Our History' },
  { href: '/vision.html', label: 'Vision, Mission &amp; Values' },
  { href: '/administration.html', label: 'School Administration' },
  { href: '/policies.html', label: 'School Policies' },
  { href: '/anthem.html', label: 'School Anthem' },
  { href: '/news.html', label: 'News &amp; Events' },
  { href: '/noticeboard.html', label: 'Notice Board' },
  { href: '/clubs.html', label: 'Clubs &amp; Societies' },
  { href: '/alumni.html', label: 'Notable Alumni' },
  { href: '/kcse.html', label: 'KCSE Results' },
];

// Flavor A (header-full: index/contact/gallery) preserves the pre-existing
// broken "sports.html" link exactly as it exists today — not part of this task.
const ABOUT_US_FULL = [...ABOUT_US_ITEMS];
ABOUT_US_FULL.splice(8, 0, { href: '/sports.html', label: 'Games &amp; Sports' });

// Flavor B pages already correctly link to the real games.html file.
const ABOUT_US_SIMPLE = [...ABOUT_US_ITEMS];
ABOUT_US_SIMPLE.splice(8, 0, { href: '/games.html', label: 'Games &amp; Sports' });

// Preserves the pre-existing dead "terms.html" link exactly as it exists today.
const ADMISSION_ITEMS = [
  { href: '/adm-overview.html', label: 'Overview' },
  { href: '/criteria.html', label: 'Admission Criteria' },
  { href: '/terms.html', label: 'Term Dates' },
  { href: '/fee.html', label: 'Fee Payment' },
  { href: '/apply.html', label: 'How to Apply' },
];

module.exports = { ABOUT_US_FULL, ABOUT_US_SIMPLE, ADMISSION_ITEMS };
