import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { FastAverageColor } from "fast-average-color";
import { Helmet } from "react-helmet"; // ✅ Helmet for SEO
import "./Home.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_TOKEN = process.env.REACT_APP_API_TOKEN;

function AlbumCard({ album }) {
  const [bgColor, setBgColor] = useState("#d2d2d2");
  const [textColor, setTextColor] = useState("black");
  const imgRef = useRef(null);

  const albumCoverUrl = album.Albumcover?.url
    ? `${API_BASE_URL}${album.Albumcover.url}`
    : null;

  const title = album.Title || "Unknown Title";
  const band = album.Band || "Unknown Band";
  const reviewText = album.Review || "";
  const preview = reviewText.split(" ").slice(0, 40).join(" ");

  useEffect(() => {
    if (imgRef.current && albumCoverUrl) {
      const fac = new FastAverageColor();
      fac
        .getColorAsync(imgRef.current)
        .then((color) => {
          setBgColor(color.hex);
          setTextColor(color.isDark ? "white" : "black");
        })
        .catch((err) => {
          console.error("Color extraction failed:", err);
          setBgColor("#d2d2d2");
          setTextColor("black");
        });
    }
  }, [albumCoverUrl]);

  return (
    <li
      className="album-card"
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
    >
      <div className="album-header">
        <h3 className="album-title-line" style={{ color: textColor }}>
          {band} – {title}
        </h3>
      </div>

      <div className="album-content">
        {albumCoverUrl && (
          <img
            ref={imgRef}
            src={albumCoverUrl}
            alt={title}
            className="album-cover"
            crossOrigin="anonymous"
            onError={(e) => {
              e.target.style.display = "none";
              setBgColor("#d2d2d2");
              setTextColor("black");
            }}
          />
        )}
        <div className="album-info">
          {reviewText && (
            <>
              <div className="review-preview" style={{ color: textColor }}>
                <ReactMarkdown>
                  {`${preview}${
                    reviewText.split(" ").length > 40 ? " ..." : ""
                  }`}
                </ReactMarkdown>
              </div>
              <p className="read-more" style={{ color: textColor }}>
                Read more
              </p>
            </>
          )}
        </div>
      </div>
    </li>
  );
}

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
          console.error("Recent albums data not found:", response.data);
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
      {/* ✅ Helmet for SEO */}
      <Helmet>
        <title>Home</title>
        <meta
          name="description"
          content="We love everything loud!. Check out the newest reviews, from huge bands to the underground."
        />
        <meta
          property="og:title"
          content="Riffcrusher | Latest Metal Reviews"
        />
        <meta
          property="og:description"
          content="We love everything loud!. Check out the newest reviews, from huge bands to the underground."
        />
        <meta
          property="og:image"
          content="https://www.riffcrusher.com/social-preview.jpg"
        />
        <meta property="og:url" content="https://www.riffcrusher.com/" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <h2>Welcome to RiffCrusher</h2>
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
          return (
            <Link
              to={`/review/${albumId}`}
              className="album-link"
              key={albumId}
            >
              <AlbumCard album={album} />
            </Link>
          );
        })}
      </ul>
    </div>
  );
}

export default Home;
