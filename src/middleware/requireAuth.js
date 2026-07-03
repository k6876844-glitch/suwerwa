'use strict';

module.exports = function requireAuth(req, res, next) {
  if (req.session && req.session.user) return next();

  if (req.originalUrl.startsWith('/admin/api')) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  return res.redirect(`/admin/login?redirect=${encodeURIComponent(req.originalUrl)}`);
};
