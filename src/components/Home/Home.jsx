import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "./Home.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_TOKEN = process.env.REACT_APP_API_TOKEN;

function Home() {
  const [recentAlbums, setRecentAlbums] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/metal-reviews?pagination[limit]=10&sort=publishedAt:DESC&populate=*`,
          {
            headers: {
              Authorization: `Bearer ${API_TOKEN}`,
            },
          }
        );
        if (response.data && response.data.data) {
          const albums = response.data.data.map((item) => ({
            id: item.id,
            documentId: item.documentId,
            ...item,
          }));
          setRecentAlbums(albums);
        } else {
          console.error(
            "Recent albums data not found in the response:",
            response.data
          );
          setRecentAlbums([]);
        }
      } catch (error) {
        console.error("Error fetching recent albums:", error);
        setRecentAlbums([]);
      }
    };

    fetchData();
  }, []);

  if (recentAlbums === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="home-container">
      <h2>Welcome to Riffcrusher</h2>
      <p>Check out the latest reviews of the newest metal records worldwide.</p>
      <p>
        <u>
          We are currently looking for new reviewers! Quickly go to our{" "}
          <b>Contact</b> page and send us your information.
        </u>
      </p>
      <h2>Recent Reviewed Albums</h2>
      <ul className="album-list">
        {recentAlbums.map((album) => {
          const albumId = album.documentId || album.id;
          const title = album.Title || "Unknown Title";
          const band = album.Band || "Unknown Band";
          const reviewText = album.Review || "";
          const preview = reviewText.split(" ").slice(0, 20).join(" ");
          const albumCoverUrl = album.Albumcover?.url || null;

          return (
            <Link
              to={`/review/${albumId}`}
              className="album-link"
              key={albumId}
            >
              <li
                className="album-card"
                style={{
                  backgroundColor: "rgb(210, 210, 210)",
                  color: "black",
                }}
              >
                {albumCoverUrl && (
                  <img
                    src={`${API_BASE_URL}${albumCoverUrl}`}
                    alt={title}
                    className="album-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                )}
                <div className="album-info">
                  <h3 className="album-title">
                    {band} - {title}
                  </h3>
                  {reviewText && (
                    <>
                      <div className="review-preview">
                        <ReactMarkdown>
                          {`${preview}${
                            reviewText.split(" ").length > 20 ? " ..." : ""
                          }`}
                        </ReactMarkdown>
                      </div>
                      <p className="read-more">Read more</p>
                    </>
                  )}
                </div>
              </li>
            </Link>
          );
        })}
      </ul>
    </div>
  );
}

export default Home;
