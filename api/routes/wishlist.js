const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const { client } = require("../db");
const requireUser = require("../middleware/requireUser");

// GET my wishlist 
router.get("/", requireUser, async (req, res, next) => {
  try {
    const SQL = `
      SELECT g.*
      FROM wishlists w
      JOIN games g ON g.id = w.game_id
      WHERE w.user_id = $1
      ORDER BY g.name;
    `;
    const { rows } = await client.query(SQL, [req.user.id]);
    res.send(rows);
  } catch (err) { next(err); }
});

// ADD to wishlist
router.post("/", requireUser, async (req, res, next) => {
  try {
    const { game_id } = req.body;
    if (!game_id) return res.status(400).send({ error: "game_id required" });

    const SQL = `
      INSERT INTO wishlists (id, user_id, game_id)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, game_id) DO NOTHING
      RETURNING *;
    `;
    const { rows } = await client.query(SQL, [uuidv4(), req.user.id, game_id]);
    res.status(rows.length ? 201 : 200).send({ added: !!rows.length });
  } catch (err) { next(err); }
});

// REMOVE from wishlist
router.delete("/:game_id", requireUser, async (req, res, next) => {
  try {
    const SQL = `DELETE FROM wishlists WHERE user_id = $1 AND game_id = $2`;
    await client.query(SQL, [req.user.id, req.params.game_id]);
    res.sendStatus(204);
  } catch (err) { next(err); }
});

module.exports = router;
