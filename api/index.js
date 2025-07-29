const express = require("express");
const app = express();

const cors = require("cors");
const gamesRouter = require("./routes/games");

const init = () => {
  const PORT = 3001;

  app.use(cors());
  app.use(express.json());

  // Health check route
  app.get("/", (req, res) => {
    res.send("✅ API is running");
  });

  // Use /games routes
  app.use("/games", gamesRouter);

  // Start server
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
};

init();
