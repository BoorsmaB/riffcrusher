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
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/metal-reviews?populate=*`,
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
        setError("Failed to load albums. Please try again later.");
        setReviewedAlbums([]);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (reviewedAlbums === null) {
    return <div className="loading">Loading...</div>;
  }

  const filteredAlbums = reviewedAlbums.filter((album) => {
    const band = album.Band || "";
    const title = album.Title || "";
    const albumTitle = `${band} - ${title}`.toLowerCase();
    return albumTitle.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="home-container">
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <h2>All Albums</h2>
      {filteredAlbums.length === 0 ? (
        <div className="no-results">
          {searchQuery
            ? "No albums found matching your search."
            : "No albums available."}
        </div>
      ) : (
        <ul className="album-list">
          {filteredAlbums.map((album) => {
            const albumId = album.documentId || album.id;
            const albumCoverUrl = album.Albumcover?.url || null;
            const reviewText = album.Review || "";
            const preview = reviewText.split(" ").slice(0, 20).join(" ");

            return (
              <Link
                to={`/review/${albumId}`}
                className="album-link"
                key={albumId}
              >
                <li className="album-card">
                  <div className="album-header">
                    <h3>{album.Title || "Unknown Title"}</h3>
                    <h4>{album.Band || "Unknown Band"}</h4>
                  </div>
                  {albumCoverUrl && (
                    <img
                      src={`${API_BASE_URL}${albumCoverUrl}`}
                      alt={album.Title || "Album Cover"}
                      className="album-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  )}
                  <div className="album-info">
                    {reviewText && (
                      <div className="review-preview">
                        <ReactMarkdown>{`${preview}${
                          reviewText.split(" ").length > 20 ? " ..." : ""
                        }`}</ReactMarkdown>
                      </div>
                    )}
                    <p className="read-more">Read more</p>
                  </div>
                </li>
              </Link>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default Reviews;
