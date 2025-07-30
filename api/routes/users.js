const express = require('express');
const router = express.Router();
const { createUser, authenticate, findUserByToken } = require('../db/auth');

// POST /api/users/register
router.post('/register', async (req, res, next) => {
  try {
    const user = await createUser(req.body);
    const { token } = await authenticate(req.body);
    res.send({ user, token });
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
    if (!auth) throw Error('No token provided');
    const token = auth.replace('Bearer ', '');
    const user = await findUserByToken(token);
    res.send(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
