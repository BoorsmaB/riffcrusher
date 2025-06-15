import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import MarkdownRenderer from "../MarkdownRenderer/MarkdownRenderer";
import Tags from "./Tags"; // Ensure correct import
import "./Review.css";
import Author from "./Author";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function Review() {
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const [selectedButton, setSelectedButton] = useState(null);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/metal-reviews/${id}?populate=Albumcover,BannerReview,tags,Writer`
        );
        console.log("Full response data:", response.data);

        if (
          response.data &&
          response.data.data &&
          response.data.data.attributes
        ) {
          setReview(response.data.data.attributes);

          const localStorageKey = `review_${id}`;
          const hasVoted = localStorage.getItem(localStorageKey);
          if (hasVoted) {
            setSelectedButton(hasVoted);
          }
        } else {
          console.error(
            "Review data not found in the response:",
            response.data
          );
          setReview(null); // Clear review on error
        }
      } catch (error) {
        console.error("Error fetching review:", error);
        setReview(null);
      }
    };

    fetchReview();
  }, [id]);

  const handleButtonClick = async (type) => {
    if (!review || selectedButton === type) return;

    try {
      // Calculate new counts locally before updating
      let newReview = { ...review };

      const previousVote = localStorage.getItem(`review_${id}`);

      // Decrement previous vote count if exists and different
      if (previousVote && previousVote !== type) {
        newReview[previousVote] = newReview[previousVote]
          ? Math.max(newReview[previousVote] - 1, 0)
          : 0;
      }

      // Increment current vote count
      newReview[type] = newReview[type] ? newReview[type] + 1 : 1;

      // Optimistically update UI state
      setReview(newReview);

      // Update backend with new counts for both votes if changed
      const updateData =
        previousVote && previousVote !== type
          ? {
              [previousVote]: newReview[previousVote],
              [type]: newReview[type],
            }
          : { [type]: newReview[type] };

      await axios.put(`${API_BASE_URL}/api/metal-reviews/${id}`, {
        data: updateData,
      });

      // Save current vote locally
      localStorage.setItem(`review_${id}`, type);
      setSelectedButton(type);
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  if (!review) {
    return <div>Loading review...</div>;
  }

  // Use safer optional chaining everywhere
  const albumCoverUrl = review.Albumcover?.data?.attributes?.url;
  const bannerReviewUrl = review.BannerReview?.data?.attributes?.url;

  // Parse oembed safely
  let videoHtml = null;
  try {
    const oembed = JSON.parse(review.oembed);
    videoHtml = oembed?.rawData?.html || null;
  } catch (e) {
    console.warn("Failed to parse oembed JSON:", e);
  }

  return (
    <div className="review-container">
      <div className="home-container">
        <div className="review-header">
          {albumCoverUrl && (
            <img
              src={`${API_BASE_URL}${albumCoverUrl}`}
              alt="Album Cover"
              className="review-cover"
            />
          )}
          <h2 className="review-title">{review.Title}</h2>
          {review.Writer?.data?.attributes && (
            <Link to={`/author/${review.Writer.data.attributes.username}`}>
              <Author author={review.Writer.data.attributes} />
            </Link>
          )}
        </div>
        <MarkdownRenderer content={review.Review} />
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
          Our Rating: <span className="rating-value">{review.Rating}</span>
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
        {review.tags && <Tags tags={review.tags} />}
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
