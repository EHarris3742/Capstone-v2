console.log("✅ users.js router file loaded");


const express = require('express');
const router = express.Router();
const { createUser, authenticate, findUserByToken } = require('../db/auth');
router.get("/test", (req, res) => {
  res.send("✅ /api/users/test route working");
});
// POST /api/users/register
router.post('/register', async (req, res, next) => {
    console.log("🔐 POST /api/users/register hit");
  try {
    const user = await createUser(req.body);
    const { token } = await authenticate(req.body);
    const { username, is_admin } = user;
    res.send({ user: { username, is_admin }, token });
  } catch (err) {
    next(err);
  }
});

// POST /api/users/login
router.post('/login', async (req, res, next) => {
  try {
    const result = await authenticate(req.body);
    res.send(result);
  } catch (err) {
    next(err);
  }
});

// GET /api/users/me
router.get('/me', async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).send({ error: "Invalid or missing token" });
    }
    const token = auth.slice(7);
    const user = await findUserByToken(token);
    res.send(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
