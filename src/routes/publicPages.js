'use strict';

const path = require('path');
const express = require('express');
const { buildPageWhitelist } = require('../shared/pageWhitelist');
const searchIndex = require('../shared/searchIndex');
const newsService = require('../services/newsService');
const noticeService = require('../services/noticeService');
const galleryService = require('../services/galleryService');
const eventService = require('../services/eventService');

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

// Slugs whose page needs data from the admin-managed JSON store, not just
// static markup. Keeps the generic render below simple for every other page.
const DYNAMIC_DATA = {
  news: () => ({ news: newsService.list(), events: eventService.list(), photos: galleryService.list() }),
  noticeboard: () => ({ notices: noticeService.list() }),
  gallery: () => ({ photos: galleryService.list() }),
};

router.get(/^\/([a-z0-9-]+)\.html$/i, (req, res, next) => {
  const slug = req.params[0].toLowerCase();
  if (!whitelist.has(slug)) return next();
  const extra = DYNAMIC_DATA[slug] ? DYNAMIC_DATA[slug]() : {};
  res.render(`public/pages/${slug}`, { navActive: NAV_ACTIVE[slug] || null, ...extra });
});

module.exports = router;
