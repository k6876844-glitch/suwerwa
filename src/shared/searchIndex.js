'use strict';

// Builds an in-memory full-text index over every public page (.ejs file) so
// the site search can actually match against real page content instead of
// just redirecting to a non-existent results page. Built once at startup —
// same pattern as buildPageWhitelist — since the page files themselves only
// change on a deploy, not per-request.

const fs = require('fs');
const path = require('path');

function stripEjsTags(html) {
  return html.replace(/<%[-=]?[\s\S]*?%>/g, ' ');
}

function stripElement(html, tag) {
  const re = new RegExp(`<${tag}[^>]*>[\\s\\S]*?<\\/${tag}>`, 'gi');
  return html.replace(re, ' ');
}

function decodeEntities(str) {
  return str
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&mdash;/gi, ' ')
    .replace(/&ndash;/gi, '-')
    .replace(/&#\d+;/g, ' ')
    .replace(/&[a-z]+;/gi, ' ');
}

function htmlToText(html) {
  let out = stripEjsTags(html);
  out = stripElement(out, 'script');
  out = stripElement(out, 'style');
  out = out.replace(/<!--[\s\S]*?-->/g, ' ');
  out = out.replace(/<[^>]+>/g, ' ');
  out = decodeEntities(out);
  return out.replace(/\s+/g, ' ').trim();
}

function extractTitle(html, fallback) {
  const match = html.match(/<title>([\s\S]*?)<\/title>/i);
  if (!match) return fallback;
  const title = htmlToText(match[1]).replace(/\s*St Francis Girls Suwerwa\s*$/i, '').trim();
  return title || fallback;
}

function buildIndex(pagesDir) {
  const entries = [];
  for (const file of fs.readdirSync(pagesDir)) {
    if (!file.endsWith('.ejs')) continue;
    const slug = file.slice(0, -4);

    const raw = fs.readFileSync(path.join(pagesDir, file), 'utf8');
    const title = extractTitle(raw, slug);
    const text = htmlToText(raw);

    entries.push({
      slug,
      url: `/${slug}.html`,
      title,
      text,
      titleLower: title.toLowerCase(),
      textLower: text.toLowerCase(),
    });
  }
  return entries;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildExcerpt(entry, queryLower, radius) {
  radius = radius || 90;
  const idx = entry.textLower.indexOf(queryLower);
  if (idx === -1) {
    return entry.text.slice(0, radius * 2).trim();
  }
  const start = Math.max(0, idx - radius);
  const end = Math.min(entry.text.length, idx + queryLower.length + radius);
  let snippet = entry.text.slice(start, end).trim();
  if (start > 0) snippet = ' ' + snippet;
  if (end < entry.text.length) snippet = snippet + ' ';
  return snippet;
}

function highlight(snippet, query) {
  const escaped = escapeHtml(snippet);
  if (!query) return escaped;
  const re = new RegExp(`(${escapeRegExp(query)})`, 'ig');
  return escaped.replace(re, '<mark>$1</mark>');
}

function countOccurrences(haystack, needle) {
  if (!needle) return 0;
  return haystack.split(needle).length - 1;
}

function search(index, rawQuery, limit) {
  limit = limit || 20;
  const query = (rawQuery || '').trim();
  if (!query) return [];

  const queryLower = query.toLowerCase();
  const words = queryLower.split(/\s+/).filter(Boolean);

  const scored = [];
  for (const entry of index) {
    let score = 0;
    if (entry.titleLower.includes(queryLower)) score += 50;
    if (entry.textLower.includes(queryLower)) score += 10;
    for (const word of words) {
      if (entry.titleLower.includes(word)) score += 8;
      score += countOccurrences(entry.textLower, word) * 2;
    }
    if (score > 0) scored.push({ entry, score });
  }

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(({ entry }) => ({
    title: entry.title,
    url: entry.url,
    excerptHtml: highlight(buildExcerpt(entry, queryLower), query),
  }));
}

module.exports = { buildIndex, search };
