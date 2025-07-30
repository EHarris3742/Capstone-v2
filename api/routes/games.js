const express = require("express");
const router = express.Router();
const { client } = require("../db");

// GET all games
router.get("/", async (req, res, next) => {
  try {
    const response = await client.query(`SELECT * FROM games;`);
    res.send(response.rows);
  } catch (err) {
    next(err);
  }
});

// GET one game
router.get("/:id", async (req, res, next) => {
  try {
    const response = await client.query(`SELECT * FROM games WHERE id = $1;`, [req.params.id]);
    res.send(response.rows[0]);
  } catch (err) {
    next(err);
  }
});

// POST new game
router.post("/", async (req, res, next) => {
  try {
    const { name, genre, rating, platform, image_url } = req.body;
    const SQL = `
      INSERT INTO games (name, genre, rating, platform, image_url)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const response = await client.query(SQL, [name, genre, rating, platform, image_url]);
    res.send(response.rows[0]);
  } catch (err) {
    next(err);
  }
});

// DELETE game
router.delete("/:id", async (req, res, next) => {
  try {
    await client.query(`DELETE FROM games WHERE id = $1;`, [req.params.id]);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

// PUT full update
router.put("/:id", async (req, res, next) => {
  try {
    const { name, genre, rating, platform, image_url } = req.body;
    const SQL = `
      UPDATE games
      SET name = $1, genre = $2, rating = $3, platform = $4, image_url = $5
      WHERE id = $6
      RETURNING *;
    `;
    const response = await client.query(SQL, [name, genre, rating, platform, image_url, req.params.id]);
    res.send(response.rows[0]);
  } catch (err) {
    next(err);
  }
});

// PATCH update rating
router.patch("/:id", async (req, res, next) => {
  try {
    const response = await client.query(
      `UPDATE games SET rating = $1 WHERE id = $2 RETURNING *;`,
      [req.body.rating, req.params.id]
    );
    res.send(response.rows[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
