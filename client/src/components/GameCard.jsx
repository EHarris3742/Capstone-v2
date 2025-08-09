import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/GameCard.css";

export default function GameCard({
  game,
  showAddButtons = true,
  showRemove = false,
  removeType,                 
  onRemove,                   
}) {
  const { token } = useContext(AuthContext);
  const [busy, setBusy] = useState(false);
  const [wishAdded, setWishAdded] = useState(false);
  const [collAdded, setCollAdded] = useState(false);

  const authedFetch = (url, options = {}) =>
    fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    });

  const handleAdd = async (type) => {
    if (!token) return alert("Please log in first.");
    setBusy(true);
    try {
      const url =
        type === "wishlist"
          ? "http://localhost:3000/api/wishlist"
          : "http://localhost:3000/api/collection";

      const res = await authedFetch(url, {
        method: "POST",
        body: JSON.stringify({ game_id: game.id }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Request failed");
      }

      const data = await res.json().catch(() => ({}));
      const added = data.added ?? true;

      if (type === "wishlist") setWishAdded(true);
      if (type === "collection") setCollAdded(true);

      if (added) {
        
      }
    } catch (err) {
      console.error(err);
      alert(`Could not add to ${type}.`);
    } finally {
      setBusy(false);
    }
  };

  const imgSrc =
    game.image_url || "https://via.placeholder.com/300x400?text=No+Cover";

  return (
    <div className="game-card">
      <img src={imgSrc} alt={game.name} className="game-img" />
      <h3>{game.name}</h3>
      <p><strong>Genre:</strong> {game.genre}</p>
      <p><strong>Rating:</strong> {game.rating}</p>
      <p><strong>Platform:</strong> {game.platform}</p>

      <div className="actions">
        {showAddButtons && (
          <>
            <button
              onClick={() => handleAdd("wishlist")}
              disabled={busy || wishAdded}
              className={`btn ${wishAdded ? "btn-disabled" : ""}`}
            >
              {wishAdded ? "In Wishlist ✓" : "Add to Wishlist"}
            </button>
            <button
              onClick={() => handleAdd("collection")}
              disabled={busy || collAdded}
              className={`btn ${collAdded ? "btn-disabled" : ""}`}
            >
              {collAdded ? "In Collection ✓" : "Add to Collection"}
            </button>
          </>
        )}

        {showRemove && (
          <button
            onClick={onRemove}
            className="btn btn-danger"
            disabled={busy}
            title={`Remove from ${removeType || "list"}`}
          >
            Remove{removeType ? ` from ${removeType}` : ""}
          </button>
        )}
      </div>
    </div>
  );
}
