import React from "react";
import "./Tags.css";

function Tags({ tags }) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="tags-container">
      {tags.map((tag) => {
        const slug = (tag.slug || tag.name)
          .toLowerCase()
          .replace(/\s+/g, "")
          .replace(/[^\w-]/g, ""); // sanitize
        const title = tag.genrename || tag.name;
        const tagClass = `tag tag-${slug}`;

        return (
          <span key={tag.id} className={tagClass}>
            {title}
          </span>
        );
      })}
    </div>
  );
}

export default Tags;
