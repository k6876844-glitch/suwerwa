'use strict';

const { readAll, insert, remove } = require('../shared/jsonStore');

function list() {
  return readAll('news').sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

function create({ title, content, category, author, image_emoji }) {
  return insert('news', {
    title,
    content,
    category,
    author: author || 'Administration',
    image_emoji: image_emoji || '📰',
    created_at: new Date().toISOString().slice(0, 10),
  });
}

function deleteById(id) {
  return remove('news', id);
}

module.exports = { list, create, deleteById };
