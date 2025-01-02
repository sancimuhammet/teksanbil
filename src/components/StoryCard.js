import React from "react";

function StoryCard({ title, description, image }) {
  return (
    <div className="story-card">
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default StoryCard;
