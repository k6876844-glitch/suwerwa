'use strict';

const bcrypt = require('bcryptjs');
const { readAll, insert } = require('../shared/jsonStore');

const SALT_ROUNDS = 10;

function findByUsername(username) {
  const users = readAll('users');
  return users.find((u) => u.username.toLowerCase() === String(username).toLowerCase());
}

async function verifyPassword(user, password) {
  return bcrypt.compare(password, user.passwordHash);
}

async function seedAdminUser() {
  const users = readAll('users');
  if (users.length > 0) return;

  const username = process.env.ADMIN_SEED_USERNAME || 'admin';
  const password = process.env.ADMIN_SEED_PASSWORD;
  if (!password) {
    throw new Error('ADMIN_SEED_PASSWORD must be set in .env to seed the first admin account');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  insert('users', { username, passwordHash, role: 'admin', createdAt: new Date().toISOString() });
  console.log(`Seeded initial admin user "${username}" — change ADMIN_SEED_PASSWORD after first login.`);
}

module.exports = { findByUsername, verifyPassword, seedAdminUser };
