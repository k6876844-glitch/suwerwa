'use strict';

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');

function filePath(name) {
  return path.join(DATA_DIR, `${name}.json`);
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

module.exports = { readAll, writeAll, insert, remove, nextId };
