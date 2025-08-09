const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const { client } = require("./db");

const usersRouter = require("./routes/users");
const gamesRouter = require("./routes/games");
const wishlistRouter = require("./routes/wishlist");
const collectionRouter = require("./routes/collection");



app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/users", usersRouter);
app.use("/api/games", gamesRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/collection", collectionRouter);

app.get("/", (req, res) => {
  res.send("Welcome to The Game Closet API");
});

// Central error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(err.status || 500).send({ error: err.message || "Server error" });
});

const init = async () => {
  try {
    await client.connect();
    console.log("Connected to database");
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("Startup error:", err);
  }
};

init();
