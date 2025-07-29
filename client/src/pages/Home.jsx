import GameCard from "../components/GameCard";
import "../styles/Home.css";
import { useEffect, useState } from "react";

function Home() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/games") 
      .then((res) => res.json())
      .then((data) => setGames(data))
      .catch((err) => console.error("Failed to fetch games:", err));
  }, []);

  return (
    <div>
      <h1>All Games</h1>
      <div className="game-grid">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}

export default Home;

