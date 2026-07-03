'use strict';

const fs = require('fs');
const path = require('path');
const seedData = require('./seedData');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');

function filePath(name) {
  return path.join(DATA_DIR, `${name}.json`);
}

// Bootstraps data/*.json from seedData.js for any collection that doesn't
// exist yet on disk. Needed because data/*.json is gitignored (so live admin
// edits never get committed as app code) — on a fresh clone or a fresh
// deploy on ephemeral storage (e.g. Render's free tier), these files simply
// aren't there until this runs once at server startup.
function ensureDataFiles() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  for (const name of Object.keys(seedData)) {
    if (!fs.existsSync(filePath(name))) {
      writeAll(name, seedData[name]);
    }
  }
}

function readAll(name) {
  const raw = fs.readFileSync(filePath(name), 'utf8');
  return JSON.parse(raw);
}

function writeAll(name, records) {
  fs.writeFileSync(filePath(name), JSON.stringify(records, null, 2));
}

function nextId(records) {
  return records.reduce((max, r) => Math.max(max, r.id), 0) + 1;
}

function insert(name, record) {
  const records = readAll(name);
  const withId = { id: nextId(records), ...record };
  records.push(withId);
  writeAll(name, records);
  return withId;
}

function remove(name, id) {
  const records = readAll(name);
  const filtered = records.filter((r) => r.id !== Number(id));
  const removed = filtered.length !== records.length;
  writeAll(name, filtered);
  return removed;
}

module.exports = { readAll, writeAll, insert, remove, nextId, ensureDataFiles };
