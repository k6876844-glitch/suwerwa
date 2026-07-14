'use strict';

const { readAll, insert, remove } = require('../shared/jsonStore');

const CATEGORIES = ['academics', 'sports', 'events', 'campus', 'scouts'];

function list() {
  return readAll('gallery');
}

function create({ url, category, caption, event_id }) {
  return insert('gallery', {
    url,
    category: CATEGORIES.includes(category) ? category : 'campus',
    caption: caption || '',
    event_id: event_id ? Number(event_id) : null,
  });
}

function listByEvent(eventId) {
  return readAll('gallery').filter((p) => p.event_id === Number(eventId));
}

function deleteById(id) {
  return remove('gallery', id);
}

module.exports = { list, listByEvent, create, deleteById, CATEGORIES };
