import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import MarkdownRenderer from "../MarkdownRenderer/MarkdownRenderer";
import Tags from "./Tags";
import "./Review.css";
import Author from "./Author";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_TOKEN = process.env.REACT_APP_API_TOKEN;

function Review() {
  const { id } = useParams(); // This should now be the documentId
  const [review, setReview] = useState(null);
  const [selectedButton, setSelectedButton] = useState(null);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        console.log("useParams ID (documentId):", id);

        const response = await axios.get(
          `${API_BASE_URL}/api/metal-reviews/${id}?populate=*`,
          {
            headers: {
              ...(API_TOKEN && { Authorization: `Bearer ${API_TOKEN}` }),
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Full response data:", response.data);
        console.log("Review object:", response.data?.data);
        console.log("Attributes:", response.data?.data);

        if (response.data?.data) {
          setReview(response.data.data);

          // Use documentId for localStorage key
          const localStorageKey = `review_${response.data.data.documentId}`;
          const hasVoted = localStorage.getItem(localStorageKey);
          if (hasVoted) {
            setSelectedButton(hasVoted);
          }
        } else {
          console.error("Review data not found in the response.");
        }
      } catch (error) {
        console.error("Error fetching review:", error);
        console.error("Error response:", error.response?.data);
      }
    };

    fetchReview();
  }, [id]);

  const handleButtonClick = async (type) => {
    if (!review || selectedButton === type) return;

    const currentData = review; // In Strapi v5, data is directly on the review object

    try {
      let newCount = currentData[type] ? currentData[type] + 1 : 1;

      const previousVote = localStorage.getItem(`review_${review.documentId}`);
      if (previousVote && previousVote !== type) {
        const previousCount = currentData[previousVote]
          ? currentData[previousVote] - 1
          : 0;

        setReview((prev) => ({
          ...prev,
          [previousVote]: previousCount,
          [type]: newCount,
        }));
      } else {
        setReview((prev) => ({
          ...prev,
          [type]: newCount,
        }));
      }

      // Update using documentId
      await axios.put(
        `${API_BASE_URL}/api/metal-reviews/${review.documentId}`,
        {
          data: {
            [type]: newCount,
          },
        },
        {
          headers: {
            ...(API_TOKEN && { Authorization: `Bearer ${API_TOKEN}` }),
            "Content-Type": "application/json",
          },
        }
      );

      localStorage.setItem(`review_${review.documentId}`, type);
      setSelectedButton(type);
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  if (!review) return <div>Loading review...</div>;

  // In Strapi v5, the data structure is flatter
  const albumCoverUrl = review.Albumcover?.url || null;
  const bannerReviewUrl = review.BannerReview?.url || null;
  const writer = review.Writer || null;

  const oembed = review.oembed ? JSON.parse(review.oembed) : null;
  const videoHtml = oembed?.rawData?.html || null;

  return (
    <div className="review-container">
      <div className="home-container">
        <div className="review-header">
          {albumCoverUrl && (
            <img
              src={`${API_BASE_URL}${albumCoverUrl}`}
              alt={review.Title || "Album Cover"}
              className="review-cover"
            />
          )}
          <h2 className="review-title">{review.Title || "Untitled"}</h2>
          <h4>{review.Band || "Unknown Band"}</h4>

          {writer && writer.username && (
            <Link to={`/author/${writer.username}`}>
              <Author author={writer} />
            </Link>
          )}
        </div>

        <MarkdownRenderer
          content={review.Review || "No review content available."}
        />

        {videoHtml && (
          <div className="embedded-video-container">
            <div
              className="embedded-video"
              dangerouslySetInnerHTML={{ __html: videoHtml }}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        )}

        <p className="review-rating">
          Our Rating:{" "}
          <span className="rating-value">{review.Rating || "N/A"}</span>
        </p>

        <div className="your-rating-section">
          <p className="your-rating-title">Your Rating:</p>
          <div className="response-buttons">
            <button
              className={`good-button ${
                selectedButton === "Good" ? "selected" : ""
              }`}
              onClick={() => handleButtonClick("Good")}
            >
              Good ({review.Good || 0})
            </button>
            <button
              className={`okay-button ${
                selectedButton === "Okay" ? "selected" : ""
              }`}
              onClick={() => handleButtonClick("Okay")}
            >
              Okay ({review.Okay || 0})
            </button>
            <button
              className={`bad-button ${
                selectedButton === "Bad" ? "selected" : ""
              }`}
              onClick={() => handleButtonClick("Bad")}
            >
              Bad ({review.Bad || 0})
            </button>
          </div>
        </div>

        <p className="tags-title">Tags:</p>
        {review.tags && review.tags.length > 0 ? (
          <Tags tags={review.tags} />
        ) : (
          <p>No tags available.</p>
        )}

        {bannerReviewUrl && (
          <img
            src={`${API_BASE_URL}${bannerReviewUrl}`}
            alt="Banner Review"
            className="banner-review"
          />
        )}
      </div>
    </div>
  );
}

export default Review;
