'use strict';

module.exports = function noIndex(req, res, next) {
  res.set('X-Robots-Tag', 'noindex, nofollow');
  next();
};
