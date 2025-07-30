require("dotenv").config(); // ⬅️ Load env variables from .env
const pg = require("pg");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

const client = new pg.Client(process.env.DATABASE_URL || "postgres://eazy@localhost/gamesdb");

const createUser = async ({ username, password, is_admin = false }) => {
  const hashed = await bcrypt.hash(password, 10);
  const SQL = `
    INSERT INTO users(id, username, password, is_admin)
    VALUES ($1, $2, $3, $4)
    RETURNING id, username, is_admin;
  `;
  const response = await client.query(SQL, [uuidv4(), username, hashed, is_admin]);
  return response.rows[0];
};

const seed = async () => {
  const SQL = `
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS games;

    CREATE TABLE users (
      id UUID PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      is_admin BOOLEAN DEFAULT false NOT NULL
    );

    CREATE TABLE games (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      genre TEXT NOT NULL,
      rating TEXT NOT NULL,
      platform TEXT NOT NULL,
      image_url TEXT
    );
  `;
  await client.query(SQL);

  // Seed games
  await client.query(`
    INSERT INTO games (name, genre, rating, platform, image_url) VALUES
      ('Call of Duty', 'FPS', 'M', 'Multi-Platform', 'https://upload.wikimedia.org/wikipedia/en/6/65/Call_of_Duty_cover.jpg'),
      ('The Legend of Zelda', 'Adventure', 'E', 'Nintendo', 'https://upload.wikimedia.org/wikipedia/en/c/c6/The_Legend_of_Zelda_Box_Art.png'),
      ('Halo', 'Shooter', 'T', 'Xbox', 'https://upload.wikimedia.org/wikipedia/en/e/e0/Halo-combat-evolved.jpg');
  `);

  // Seed users
  await Promise.all([
    createUser({ username: "admin", password: "admin123", is_admin: true }),
    createUser({ username: "gamer", password: "playnow" })
  ]);

  console.log("✅ Database seeded with users and games");
};

module.exports = {
  client,
  seed,
};
