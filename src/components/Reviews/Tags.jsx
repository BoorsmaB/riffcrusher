import React from "react";
import "./Tags.css";

const Tags = ({ tags }) => {
  return (
    <div className="tags-container">
      {tags.data.map((tag) => {
        const tagSlug = tag.attributes.slug.toLowerCase();
        return (
          <span key={tag.id} className={`tag tag-${tagSlug}`}>
            {tag.attributes.title}
          </span>
        );
      })}
    </div>
  );
};

export default Tags;
