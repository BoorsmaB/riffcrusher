import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import MarkdownRenderer from "../MarkdownRenderer/MarkdownRenderer";
import Tags from "./Tags";
import "./Review.css";
import Author from "./Author";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_TOKEN = process.env.REACT_APP_API_TOKEN; // Original token for review data
const API_TOKEN_VOTING = process.env.REACT_APP_API_TOKEN_VOTING; // Voting token

function Review() {
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const [selectedButton, setSelectedButton] = useState(null);
  const [isVoting, setIsVoting] = useState(false); // Prevent multiple simultaneous votes

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/metal-reviews/${id}?populate=*`,
          {
            headers: {
              ...(API_TOKEN && { Authorization: `Bearer ${API_TOKEN}` }),
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data?.data) {
          const fetchedReview = response.data.data;
          setReview(fetchedReview);

          const localStorageKey = `review_${fetchedReview.documentId}`;
          const storedVote = localStorage.getItem(localStorageKey);
          if (storedVote) {
            setSelectedButton(storedVote);
          }
        } else {
          console.error("Review data missing.");
        }
      } catch (error) {
        console.error("Error fetching review:", error);
      }
    };

    fetchReview();
  }, [id]);

  const handleButtonClick = async (type) => {
    if (!review || isVoting) return;

    // Allow clicking the same button again (to remove vote)
    const isSameVote = selectedButton === type;
    const prevVote = localStorage.getItem(`review_${review.documentId}`);

    try {
      setIsVoting(true);

      const updatedReview = { ...review };

      if (isSameVote) {
        // Remove the current vote
        updatedReview[type] = Math.max((updatedReview[type] || 1) - 1, 0);
        setSelectedButton(null);
        localStorage.removeItem(`review_${review.documentId}`);
      } else {
        // Add new vote
        updatedReview[type] = (updatedReview[type] || 0) + 1;

        // Remove previous vote if it exists and is different
        if (prevVote && prevVote !== type) {
          updatedReview[prevVote] = Math.max(
            (updatedReview[prevVote] || 1) - 1,
            0
          );
        }

        setSelectedButton(type);
        localStorage.setItem(`review_${review.documentId}`, type);
      }

      // Update local state immediately for better UX
      setReview(updatedReview);

      // Prepare data for API update
      const updateData = {
        [type]: updatedReview[type],
      };

      // Include previous vote field if it was different
      if (prevVote && prevVote !== type && !isSameVote) {
        updateData[prevVote] = updatedReview[prevVote];
      }

      // Use voting API token for voting update
      await axios.put(
        `${API_BASE_URL}/api/metal-reviews/${review.documentId}`,
        {
          data: updateData,
        },
        {
          headers: {
            ...(API_TOKEN_VOTING && {
              Authorization: `Bearer ${API_TOKEN_VOTING}`,
            }),
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Vote updated successfully:", updateData);
    } catch (error) {
      console.error("Error updating vote:", error);

      // Revert local state on error
      setReview(review);
      if (prevVote) {
        setSelectedButton(prevVote);
        localStorage.setItem(`review_${review.documentId}`, prevVote);
      } else {
        setSelectedButton(null);
        localStorage.removeItem(`review_${review.documentId}`);
      }
    } finally {
      setIsVoting(false);
    }
  };

  if (!review) return <div className="loading">Loading review...</div>;

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

            {writer?.username && (
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
              disabled={isVoting}
            >
              <span className="button-text">Good</span>
              <span className="button-count">({review.Good || 0})</span>
            </button>
            <button
              className={`rating-button okay-button ${
                selectedButton === "Okay" ? "selected" : ""
              }`}
              onClick={() => handleButtonClick("Okay")}
              disabled={isVoting}
            >
              <span className="button-text">Okay</span>
              <span className="button-count">({review.Okay || 0})</span>
            </button>
            <button
              className={`rating-button bad-button ${
                selectedButton === "Bad" ? "selected" : ""
              }`}
              onClick={() => handleButtonClick("Bad")}
              disabled={isVoting}
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
