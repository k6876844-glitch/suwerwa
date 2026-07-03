'use strict';

const { readAll, insert, remove } = require('../shared/jsonStore');

function list() {
  return readAll('events').sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
}

function create({ title, description, event_date, venue, event_type }) {
  return insert('events', {
    title,
    description: description || '',
    event_date,
    venue: venue || 'School Grounds',
    event_type,
  });
}

function deleteById(id) {
  return remove('events', id);
}

module.exports = { list, create, deleteById };
