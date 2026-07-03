'use strict';

const express = require('express');
const bcrypt = require('bcryptjs');
const userStore = require('../../auth/userStore');
const requireAuth = require('../../middleware/requireAuth');
const requireRole = require('../../middleware/requireRole');

const router = express.Router();

// ---- Public within /admin (no session required) ----

router.get('/login', (req, res) => {
  if (req.session && req.session.user) return res.redirect('/admin');
  res.render('admin/pages/login', { error: null, redirect: req.query.redirect || '' });
});

router.post('/login', async (req, res, next) => {
  try {
    const { username, password, redirect } = req.body;
    const user = username ? userStore.findByUsername(username) : null;
    const ok = user && (await userStore.verifyPassword(user, password || ''));

    if (!ok) {
      return res.status(401).render('admin/pages/login', {
        error: 'Invalid username or password',
        redirect,
      });
    }
    if (user.role !== 'admin') {
      return res.status(403).render('admin/pages/login', {
        error: 'This account does not have admin access',
        redirect,
      });
    }

    req.session.regenerate((err) => {
      if (err) return next(err);
      req.session.user = { id: user.id, username: user.username, role: user.role };
      const safeRedirect = redirect && redirect.startsWith('/admin') ? redirect : '/admin';
      res.redirect(safeRedirect);
    });
  } catch (err) {
    next(err);
  }
});

router.post('/logout', (req, res, next) => {
  if (!req.session) return res.redirect('/admin/login');
  req.session.destroy((err) => {
    if (err) return next(err);
    res.clearCookie('sid');
    res.redirect('/admin/login');
  });
});

// ---- Gate: everything below requires an authenticated admin ----
router.use(requireAuth, requireRole('admin'));

router.get('/', (req, res) => {
  res.render('admin/layout/adminLayout', {
    page: '../pages/dashboard',
    user: req.session.user,
  });
});

module.exports = router;
