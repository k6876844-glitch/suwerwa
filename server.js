'use strict';

require('dotenv').config();
const path = require('path');
const express = require('express');

const navData = require('./src/shared/navData');
const publicPagesRouter = require('./src/routes/publicPages');
const adminPagesRouter = require('./src/admin/routes/pages');
const adminApiRouter = require('./src/admin/routes/api');
const session = require('./src/auth/session');
const noIndex = require('./src/middleware/noIndex');
const requireAuth = require('./src/middleware/requireAuth');
const requireRole = require('./src/middleware/requireRole');
const { seedAdminUser } = require('./src/auth/userStore');
const { ensureDataFiles } = require('./src/shared/jsonStore');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src'));
app.locals.nav = navData;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// ---- Public site (no auth) ----
// Mounted at root (not /static) so existing relative hrefs like href="high.css"
// keep resolving to the same URLs they always have.
app.use(express.static(path.join(__dirname, 'src/public/static')));
app.get('/robots.txt', (req, res) => {
  res.type('text/plain').sendFile(path.join(__dirname, 'robots.txt'));
});
app.use('/', publicPagesRouter);

// ---- Admin section (/admin) ----
app.use('/admin', noIndex);
app.use('/admin', session());
app.use('/admin/static', express.static(path.join(__dirname, 'src/admin/static')));
app.use('/admin', adminPagesRouter); // exposes /admin/login, /admin/logout (public) + gated /admin, /admin/*
app.use('/admin/api', requireAuth, requireRole('admin'), adminApiRouter);

app.use((req, res) => {
  res.status(404).send('Not Found');
});

ensureDataFiles();
seedAdminUser().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});
