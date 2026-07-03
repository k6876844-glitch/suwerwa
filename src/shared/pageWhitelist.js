'use strict';

const fs = require('fs');

function buildPageWhitelist(pagesDir) {
  return new Set(
    fs
      .readdirSync(pagesDir)
      .filter((f) => f.endsWith('.ejs'))
      .map((f) => f.slice(0, -4))
  );
}

module.exports = { buildPageWhitelist };
