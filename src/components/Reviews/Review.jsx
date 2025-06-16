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

  if (!review) return <div className="loading">Loading review...</div>;

  // In Strapi v5, the data structure is flatter
  const albumCoverUrl = review.Albumcover?.url || null;
  const bannerReviewUrl = review.BannerReview?.url || null;
  const writer = review.Writer || null;

  const oembed = review.oembed ? JSON.parse(review.oembed) : null;
  const videoHtml = oembed?.rawData?.html || null;

  return (
    <div className="review-container">
      <div className="review-content">
        <div className="review-header">
          {albumCoverUrl && (
            <div className="album-cover-container">
              <img
                src={`${API_BASE_URL}${albumCoverUrl}`}
                alt={review.Title || "Album Cover"}
                className="review-cover"
              />
            </div>
          )}

          <div className="review-info">
            <h1 className="review-title">{review.Title || "Untitled"}</h1>
            <h2 className="band-name">{review.Band || "Unknown Band"}</h2>

            {writer && writer.username && (
              <div className="author-container">
                <Link to={`/author/${writer.username}`} className="author-link">
                  <Author author={writer} />
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="review-text">
          <MarkdownRenderer
            content={review.Review || "No review content available."}
          />
        </div>

        {videoHtml && (
          <div className="embedded-video-container">
            <div
              className="embedded-video"
              dangerouslySetInnerHTML={{ __html: videoHtml }}
            />
          </div>
        )}

        <div className="rating-section">
          <p className="review-rating">
            Our Rating:{" "}
            <span className="rating-value">{review.Rating || "N/A"}</span>
          </p>
        </div>

        <div className="your-rating-section">
          <h3 className="your-rating-title">Your Rating:</h3>
          <div className="response-buttons">
            <button
              className={`rating-button good-button ${
                selectedButton === "Good" ? "selected" : ""
              }`}
              onClick={() => handleButtonClick("Good")}
            >
              <span className="button-text">Good</span>
              <span className="button-count">({review.Good || 0})</span>
            </button>
            <button
              className={`rating-button okay-button ${
                selectedButton === "Okay" ? "selected" : ""
              }`}
              onClick={() => handleButtonClick("Okay")}
            >
              <span className="button-text">Okay</span>
              <span className="button-count">({review.Okay || 0})</span>
            </button>
            <button
              className={`rating-button bad-button ${
                selectedButton === "Bad" ? "selected" : ""
              }`}
              onClick={() => handleButtonClick("Bad")}
            >
              <span className="button-text">Bad</span>
              <span className="button-count">({review.Bad || 0})</span>
            </button>
          </div>
        </div>

        <div className="tags-section">
          <h3 className="tags-title">Tags:</h3>
          {review.tags && review.tags.length > 0 ? (
            <Tags tags={review.tags} />
          ) : (
            <p className="no-tags">No tags available.</p>
          )}
        </div>

        {bannerReviewUrl && (
          <div className="banner-container">
            <img
              src={`${API_BASE_URL}${bannerReviewUrl}`}
              alt="Banner Review"
              className="banner-review"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Review;
