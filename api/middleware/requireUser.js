const { findUserByToken } = require("../db/auth");

module.exports = async function requireUser(req, res, next) {
  try {
    const auth = req.headers.authorization || "";
    if (!auth.startsWith("Bearer ")) {
      return res.status(401).send({ error: "Missing or invalid token" });
    }
    const token = auth.slice(7);
    const user = await findUserByToken(token); 
    req.user = user;
    next();
  } catch (err) {
    err.status = 401;
    next(err);
  }
};
