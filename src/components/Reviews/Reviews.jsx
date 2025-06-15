import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import SearchBar from "../SearchBar/SearchBar";
import "./Reviews.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_TOKEN = process.env.REACT_APP_API_TOKEN;

function Reviews() {
  const [reviewedAlbums, setReviewedAlbums] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/metalreviews?populate=Albumcover`,
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

  const filteredAlbums = reviewedAlbums.filter((album) => {
    const albumTitle =
      `${album.attributes.Band} - ${album.attributes.Title}`.toLowerCase();
    return albumTitle.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="home-container">
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <h2>All Albums</h2>
      <ul className="album-list">
        {filteredAlbums.map((album) => {
          const albumCoverUrl =
            album.attributes.Albumcover?.data?.attributes?.url;
          const cardStyle = {
            backgroundColor: "rgb(210, 210, 210)",
            color: "black",
          };
          return (
            <Link
              to={`/review/${album.id}`}
              className="album-link"
              key={album.id}
            >
              <li className="album-card" style={cardStyle}>
                {albumCoverUrl && (
                  <img
                    src={`${API_BASE_URL}${albumCoverUrl}`}
                    alt={album.attributes.Title}
                    className="album-cover"
                  />
                )}
                <div className="album-info">
                  <h3>{album.attributes.Title}</h3>
                  <h4>{album.attributes.Band}</h4>
                  <div className="review-preview">
                    <ReactMarkdown>
                      {`${album.attributes.Review.split(" ")
                        .slice(0, 20)
                        .join(" ")} ...`}
                    </ReactMarkdown>
                  </div>
                  <p className="read-more">Read more</p>
                </div>
              </li>
            </Link>
          );
        })}
      </ul>
    </div>
  );
}

export default Reviews;
