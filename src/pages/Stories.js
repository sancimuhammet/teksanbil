import React from "react";
import StoryCard from "../components/StoryCard";

function Stories() {
  const storyList = [
    { title: "Uzayın Derinlikleri", description: "Uzayın gizemleri...", image: "/space.jpg" },
    { title: "Sanatın Gücü", description: "Sanat ve teknoloji nasıl birleşiyor?", image: "/art.jpg" },
  ];

  return (
    <div className="stories">
      <h2>Hikayeler</h2>
      <div className="story-list">
        {storyList.map((story, index) => (
          <StoryCard key={index} {...story} />
        ))}
      </div>
    </div>
  );
}

export default Stories;
