'use strict';

const express = require('express');
const newsService = require('../../services/newsService');
const noticeService = require('../../services/noticeService');
const eventService = require('../../services/eventService');
const statsService = require('../../services/statsService');

const router = express.Router();

router.get('/stats', (req, res) => {
  res.json({ stats: statsService.getStats() });
});

router.get('/analytics', (req, res) => {
  res.json({ analytics: statsService.getAnalytics() });
});

router.get('/news', (req, res) => {
  res.json({ news: newsService.list() });
});

router.post('/news', (req, res) => {
  const { title, content, category, author, image_emoji } = req.body;
  if (!title || !content || !category) {
    return res.status(400).json({ error: 'title, content and category are required' });
  }
  res.status(201).json({ news: newsService.create({ title, content, category, author, image_emoji }) });
});

router.delete('/news/:id', (req, res) => {
  const ok = newsService.deleteById(req.params.id);
  if (!ok) return res.status(404).json({ error: 'News item not found' });
  res.json({ ok: true });
});

router.get('/notices', (req, res) => {
  res.json({ notices: noticeService.list() });
});

router.post('/notices', (req, res) => {
  const { title, content, category, is_urgent, posted_by, expires_at } = req.body;
  if (!title || !content || !category) {
    return res.status(400).json({ error: 'title, content and category are required' });
  }
  res.status(201).json({ notice: noticeService.create({ title, content, category, is_urgent, posted_by, expires_at }) });
});

router.delete('/notices/:id', (req, res) => {
  const ok = noticeService.deleteById(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Notice not found' });
  res.json({ ok: true });
});

router.get('/events', (req, res) => {
  res.json({ events: eventService.list() });
});

router.post('/events', (req, res) => {
  const { title, description, event_date, venue, event_type } = req.body;
  if (!title || !event_date || !event_type) {
    return res.status(400).json({ error: 'title, event_date and event_type are required' });
  }
  res.status(201).json({ event: eventService.create({ title, description, event_date, venue, event_type }) });
});

router.delete('/events/:id', (req, res) => {
  const ok = eventService.deleteById(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Event not found' });
  res.json({ ok: true });
});

module.exports = router;
