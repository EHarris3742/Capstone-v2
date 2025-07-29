import "../styles/GameCard.css";

export default function GameCard({ game }) {
  return (
    <div className="game-card">
      <img src={game.image_url} alt={game.name} className="game-img" />
      <h3>{game.name}</h3>
      <p>Genre: {game.genre}</p>
      <p>Rating: {game.rating}</p>
      <p>Platform: {game.platform}</p>
    </div>
  );
}
