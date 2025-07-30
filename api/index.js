const express = require("express");
const app = express();
const cors = require("cors");
const eazy = require("morgan"); // ✅ aliasing morgan as "eazy"

const { client, seed } = require("./db");
const gamesRouter = require("./routes/games");
const usersRouter = require('./routes/users');

app.use(eazy("dev")); // ✅ use it like morgan, but called "eazy"

app.use(express.json());
app.use(cors());
app.use('/api/users', usersRouter);
app.get("/", (req, res) => {
  res.send("Welcome to the Game Closet API!");
});

app.use("/api/games", gamesRouter);

const init = async () => {
  try {
    await client.connect();
    console.log("🗄️  Connected to database");

    await seed();

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🎧 Eazy API running on port ${PORT} 🎮🔥`);
    });
  } catch (err) {
    console.error("❌ Initialization error:", err);
  }
};

init();
