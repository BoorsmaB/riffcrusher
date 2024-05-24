import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Reviews.css";

function Reviews() {
  const [reviewedAlbums, setReviewedAlbums] = useState(null);
  const API_TOKEN =
    "573fd8cdf7abe1754a888b2378e04ecf6021ef21a187830c886e4d0a50b099aad445af426afd4f84e39d3fadb2edfa31cf75e42dbfdfd23ebebdeaf16c0d97a9350533ec7b2de03cf85f9503f1f792279fc3b6aa035a2a9fdc467a39083db2ce0dc1c6c225fbc3350b4a6a1987b22b950798684865c7dfd5c8ac38ea5429d07d";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:1337/api/metalreviews?populate=Albumcover",
          {
            headers: {
              Authorization: `Bearer ${API_TOKEN}`,
            },
          }
        );
        if (response.data && response.data.data) {
          setReviewedAlbums(response.data.data);
        } else {
          setReviewedAlbums([]);
        }
      } catch (error) {
        console.error("Error fetching reviewed albums:", error);
        setReviewedAlbums([]);
      }
    };

    fetchData();
  }, []);

  if (reviewedAlbums === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="home-container">
      <h2>All Albums</h2>
      <ul className="album-list">
        {reviewedAlbums.map((album) => {
          const albumCoverUrl =
            album.attributes.Albumcover?.data?.attributes?.url;
          return (
            <li key={album.id} className="album-card">
              {albumCoverUrl && (
                <img
                  src={`http://localhost:1337${albumCoverUrl}`}
                  alt={album.attributes.Title}
                  className="album-cover"
                />
              )}
              <div className="album-info">
                <h3>{album.attributes.Title}</h3>
                <h4>{album.attributes.Band}</h4>
                <p>
                  {album.attributes.Review.split(" ").slice(0, 20).join(" ")}...
                </p>
                <Link to={`/review/${album.id}`}>Read more</Link>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Reviews;
