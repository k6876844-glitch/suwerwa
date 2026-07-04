'use strict';

const path = require('path');
const express = require('express');
const { buildPageWhitelist } = require('../shared/pageWhitelist');
const searchIndex = require('../shared/searchIndex');

const router = express.Router();
const pagesDir = path.join(__dirname, '..', 'public', 'pages');
const whitelist = buildPageWhitelist(pagesDir);
const searchEntries = searchIndex.buildIndex(pagesDir);

// Per-page "active" nav item, used by the header partials to highlight the
// current section. Anything not listed here simply renders with no active item.
const NAV_ACTIVE = {
  index: 'home',
  gallery: 'gallery',
  contact: 'contact',
  profile: 'aboutUs',
  history: 'aboutUs',
  vision: 'aboutUs',
  administration: 'aboutUs',
  staff: 'aboutUs',
  policies: 'aboutUs',
  anthem: 'aboutUs',
  news: 'aboutUs',
  noticeboard: 'aboutUs',
  clubs: 'aboutUs',
  departmetent: 'aboutUs',
  alumni: 'aboutUs',
  kcse: 'aboutUs',
  facilities: 'aboutUs',
  information: 'aboutUs',
  leadership: 'aboutUs',
  games: 'aboutUs',
  'adm-overview': 'admission',
  criteria: 'admission',
  terms: 'admission',
  fee: 'admission',
  apply: 'admission',
};

router.get('/', (req, res) => {
  res.render('public/pages/index', { navActive: 'home' });
});

router.get('/api/search', (req, res) => {
  const query = typeof req.query.q === 'string' ? req.query.q.trim() : '';
  const results = query ? searchIndex.search(searchEntries, query, 8) : [];
  res.json({ results });
});

router.get(/^\/([a-z0-9-]+)\.html$/i, (req, res, next) => {
  const slug = req.params[0].toLowerCase();
  if (!whitelist.has(slug)) return next();
  res.render(`public/pages/${slug}`, { navActive: NAV_ACTIVE[slug] || null });
});

module.exports = router;
