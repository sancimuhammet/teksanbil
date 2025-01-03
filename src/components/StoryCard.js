import React, { useState } from "react";
import "./StoryCard.css"; // CSS dosyası

function StoryCard({ title, description, image }) {
  const [likes, setLikes] = useState(0); // Beğeni sayısını tutan state

  const handleLike = () => {
    setLikes(likes + 1); // Beğeni sayısını 1 artır
  };

  return (
    <div className="story-card">
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="story-actions">
        <button onClick={handleLike} className="like-button">
          ❤️ Beğen ({likes})
        </button>
      </div>
    </div>
  );
}

export default StoryCard;
