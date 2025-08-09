import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import GameCard from "../components/GameCard";

export default function Account() {
  const { token, user, loadingUser } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);
  const [collection, setCollection] = useState([]);
  const [loading, setLoading] = useState(true);

  const authedFetch = (url, options = {}) =>
    fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    });

  const fetchLists = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [wRes, cRes] = await Promise.all([
        authedFetch("http://localhost:3000/api/wishlist"),
        authedFetch("http://localhost:3000/api/collection"),
      ]);
      if (!wRes.ok || !cRes.ok) throw new Error("Failed to load lists");
      const [wData, cData] = await Promise.all([wRes.json(), cRes.json()]);
      setWishlist(wData);
      setCollection(cData);
    } catch (e) {
      console.error(e);
      setWishlist([]);
      setCollection([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchLists();
  }, [token]);

  const removeFrom = async (type, gameId) => {
    try {
      const url =
        type === "wishlist"
          ? `http://localhost:3000/api/wishlist/${gameId}`
          : `http://localhost:3000/api/collection/${gameId}`;
      const res = await authedFetch(url, { method: "DELETE" });
      if (!res.ok && res.status !== 204) throw new Error("Delete failed");
      if (type === "wishlist") {
        setWishlist(prev => prev.filter(g => g.id !== gameId));
      } else {
        setCollection(prev => prev.filter(g => g.id !== gameId));
      }
    } catch (e) {
      console.error(e);
      alert("Could not remove item.");
    }
  };

  if (loadingUser) return <p>Loading your account…</p>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="account">
      <h1>Welcome, {user.username}!</h1>

      <section>
        <h2>Your Collection</h2>
        {loading ? (
          <p>Loading collection…</p>
        ) : collection.length === 0 ? (
          <p>No games in your collection yet.</p>
        ) : (
          <div className="card-container">
            {collection.map(game => (
              <GameCard
                key={game.id}
                game={game}
                showAddButtons={false}
                showRemove
                removeType="collection"
                onRemove={() => removeFrom("collection", game.id)}
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2>Your Wishlist</h2>
        {loading ? (
          <p>Loading wishlist…</p>
        ) : wishlist.length === 0 ? (
          <p>No games in your wishlist yet.</p>
        ) : (
          <div className="card-container">
            {wishlist.map(game => (
              <GameCard
                key={game.id}
                game={game}
                showAddButtons={false}
                showRemove
                removeType="wishlist"
                onRemove={() => removeFrom("wishlist", game.id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
