const { Pool } = require("pg");

const pool = new Pool({
  user: "eazy",        // ← your user
  host: "localhost",
  database: "gamesdb", // ← your DB name
  port: 5432,
});

module.exports = pool;
