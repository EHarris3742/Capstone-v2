import React, { useEffect, useState } from "react";
import GameCard from "../components/GameCard";

export default function Home() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/games");
        const data = await response.json();
        setGames(data);
      } catch (err) {
        console.error("Failed to fetch games:", err);
      }
    };

    fetchGames();
  }, []);

  return (
    <div className="game-list">
      <h1>Game Closet</h1>
      <div className="card-container">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}
