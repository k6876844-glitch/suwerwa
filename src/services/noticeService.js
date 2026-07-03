'use strict';

const { readAll, insert, remove } = require('../shared/jsonStore');

function list() {
  return readAll('notices').sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

function create({ title, content, category, is_urgent, posted_by, expires_at }) {
  return insert('notices', {
    title,
    content,
    category,
    is_urgent: Boolean(is_urgent),
    posted_by: posted_by || 'Administration',
    expires_at: expires_at || null,
    created_at: new Date().toISOString().slice(0, 10),
  });
}

function deleteById(id) {
  return remove('notices', id);
}

module.exports = { list, create, deleteById };
