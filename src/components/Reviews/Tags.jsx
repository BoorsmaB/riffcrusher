import React from "react";
import "./Tags.css";

const Tags = ({ tags }) => {
  return (
    <div className="tags-container">
      {tags?.data?.map((tag) => {
        const slug = tag?.attributes?.slug;
        const title = tag?.attributes?.title;

        if (!slug || !title) return null; // Skip malformed tags

        const tagSlug = slug.toLowerCase();

        return (
          <span key={tag.id} className={`tag tag-${tagSlug}`}>
            {title}
          </span>
        );
      })}
    </div>
  );
};

export default Tags;
