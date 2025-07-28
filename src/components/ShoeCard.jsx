import "../styles/ShoeCard.css";
import React from 'react';

export default function ShoeCard({ shoe }) {
  return (
    <div className="shoe-card">
      <img src={shoe.image_url} alt={shoe.name} className="shoe-img" />
      <h3>{shoe.name}</h3>
      <p>{shoe.brand}</p>
      <p className="price">${shoe.price}</p>
      <div className="button-group">
        <button>Add to Closet</button>
        <button>Add to Wishlist</button>
      </div>
    </div>
  );
}
