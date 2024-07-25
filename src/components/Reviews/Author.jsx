import React from "react";
import "./Author.css"; // Add some styles for the Author component

const Author = ({ author }) => {
  return (
    <div className="author-info">
      <h3>Written by: {author.username}</h3>
    </div>
  );
};

export default Author;
