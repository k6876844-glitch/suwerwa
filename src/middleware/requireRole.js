'use strict';

module.exports = function requireRole(role) {
  return function (req, res, next) {
    if (req.session && req.session.user && req.session.user.role === role) return next();

    if (req.originalUrl.startsWith('/admin/api')) {
      return res.status(403).json({ error: `Forbidden: ${role} role required` });
    }
    return res.status(403).render('admin/pages/forbidden', {
      user: (req.session && req.session.user) || null,
    });
  };
};
