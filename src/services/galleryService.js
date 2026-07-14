'use strict';

const { readAll, insert, remove } = require('../shared/jsonStore');

const CATEGORIES = ['academics', 'sports', 'events', 'campus', 'scouts'];

function list() {
  return readAll('gallery');
}

function create({ url, category, caption }) {
  return insert('gallery', {
    url,
    category: CATEGORIES.includes(category) ? category : 'campus',
    caption: caption || '',
  });
}

function deleteById(id) {
  return remove('gallery', id);
}

module.exports = { list, create, deleteById, CATEGORIES };
