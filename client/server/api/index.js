const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Root route to confirm API is running
app.get('/', (req, res) => {
  res.send('✅ API is running');
});

// PostgreSQL connection
const pool = new Pool({
  user: 'eazy',           // Your PostgreSQL username
  host: 'localhost',
  database: 'gamesdb',    // Make sure this DB exists
  port: 5432              // Default PostgreSQL port
});

// Test route
app.get('/test', (req, res) => {
  console.log("✅ Test route hit");
  res.send("Server is working!");
});

// Seed route to create + populate games table
app.get('/seed', async (req, res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS games (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        genre TEXT NOT NULL,
        rating TEXT NOT NULL,
        platform TEXT NOT NULL,
        image_url TEXT
      );
    `);

    await pool.query(`DELETE FROM games;`);

    await pool.query(`
      INSERT INTO games (name, genre, rating, platform, image_url)
      VALUES 
        ('Call of Duty', 'FPS', 'M', 'Multi-Platform', 'https://upload.wikimedia.org/wikipedia/en/6/65/Call_of_Duty_Modern_Warfare_II_cover.jpg'),
        ('Zelda: Tears of the Kingdom', 'Action-Adventure', 'E10+', 'Nintendo Switch', 'https://upload.wikimedia.org/wikipedia/en/a/a9/The_Legend_of_Zelda_Tears_of_the_Kingdom.jpg'),
        ('God of War: Ragnarok', 'Action', 'M', 'PlayStation', 'https://upload.wikimedia.org/wikipedia/en/b/bb/God_of_War_Ragnar%C3%B6k_cover.jpg'),
        ('Minecraft', 'Sandbox', 'E10+', 'Multi-Platform', 'https://upload.wikimedia.org/wikipedia/en/5/51/Minecraft_cover.png'),
        ('Halo Infinite', 'FPS', 'T', 'Xbox', 'https://upload.wikimedia.org/wikipedia/en/e/e0/Halo_Infinite.png');
    `);

    res.send('✅ Games seeded successfully!');
  } catch (err) {
    console.error('❌ Seeding error:', err.message);
    res.status(500).send(`Seeding failed: ${err.message}`);
  }
});

// Route to get all games
app.get('/games', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM games;');
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Failed to fetch games:", err.message);
    res.status(500).send(`Fetch failed: ${err.message}`);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
