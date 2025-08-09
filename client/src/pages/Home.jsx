import React, { useEffect, useState } from "react";
import GameCard from "../components/GameCard";
import "../styles/Home.css"; // ⬅️ add this

export default function Home() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/games");
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`HTTP ${response.status} ${response.statusText}: ${text}`);
        }
        const data = await response.json();
        setGames(data);
      } catch (err) {
        console.error("Failed to fetch games:", err);
      }
    };
    fetchGames();
  }, []);

  return (
    <main className="home">
      <header className="home-top">
        <h1>Welcome to your Arcade Archive!</h1>
        <p className="subtitle">Your curated shelf of favorites, classics, and hidden gems.</p>
      </header>

      <section className="home-content">
        <h1>Our Favorite Games:</h1>
        <div className="card-container">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>
    </main>
  );
}
