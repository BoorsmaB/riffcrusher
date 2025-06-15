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
          `${API_BASE_URL}/api/metal-reviews?_limit=10&_sort=publishedAt:DESC&populate=Albumcover`,
          {
            headers: {
              Authorization: `Bearer ${API_TOKEN}`,
            },
          }
        );
        if (response.data && response.data.data) {
          setRecentAlbums(response.data.data);
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
      <h2>Welcome to Jovanaar Reviews</h2>
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
          const albumCoverUrl =
            album.attributes?.Albumcover?.data?.attributes?.url || null;
          const cardStyle = {
            backgroundColor: "rgb(210, 210, 210)",
            color: "black",
          };

          // Safely handle Review text
          const reviewText = album.attributes?.Review || "";
          const preview = reviewText.split(" ").slice(0, 20).join(" ");

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
                    alt={album.attributes?.Title || "Album Cover"}
                    className="album-cover"
                  />
                )}
                <div className="album-info">
                  <h3>{album.attributes?.Title || "Unknown Title"}</h3>
                  <h4>{album.attributes?.Band || "Unknown Band"}</h4>
                  <div className="review-preview">
                    <ReactMarkdown>{`${preview} ...`}</ReactMarkdown>
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

export default Home;
