const pg = require('pg');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const client = new pg.Client(process.env.DATABASE_URL || 'postgres://eazy@localhost/gamesdb');
const JWT_SECRET = process.env.JWT_SECRET || 'eazy_secret';

// Create user
const createUser = async (user) => {
  if (!user.username.trim() || !user.password.trim()) {
    throw Error('Must provide username and password');
  }

  const hashed = await bcrypt.hash(user.password, 10);

  const SQL = `
    INSERT INTO users(id, username, password, is_admin)
    VALUES ($1, $2, $3, $4)
    RETURNING id, username, is_admin;
  `;
  const response = await client.query(SQL, [uuidv4(), user.username, hashed, user.is_admin || false]);
  return response.rows[0];
};

// Login
const authenticate = async ({ username, password }) => {
  const SQL = `
    SELECT id, password
    FROM users
    WHERE username = $1
  `;
  const response = await client.query(SQL, [username]);
  const user = response.rows[0];
  if (!user) {
    const error = Error('Invalid username');
    error.status = 401;
    throw error;
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    const error = Error('Invalid password');
    error.status = 401;
    throw error;
  }

  const token = jwt.sign({ id: user.id }, JWT_SECRET);
  return { token };
};

// Verify token
const findUserByToken = async (token) => {
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const SQL = `
      SELECT id, username, is_admin
      FROM users
      WHERE id = $1
    `;
    const response = await client.query(SQL, [payload.id]);
    if (!response.rows.length) {
      throw Error('User not found');
    }
    return response.rows[0];
  } catch (err) {
    const error = Error('Bad token');
    error.status = 401;
    throw error;
  }
};

module.exports = {
  client,
  createUser,
  authenticate,
  findUserByToken,
};
