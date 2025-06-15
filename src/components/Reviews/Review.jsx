import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import MarkdownRenderer from "../MarkdownRenderer/MarkdownRenderer";
import Tags from "./Tags";
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
          `${API_BASE_URL}/api/metal-reviews/${id}?populate=*`
        );
        console.log("Full response data:", response.data);

        if (response.data && response.data.data) {
          setReview(response.data.data);

          const localStorageKey = `review_${id}`;
          const hasVoted = localStorage.getItem(localStorageKey);
          if (hasVoted) {
            setSelectedButton(hasVoted);
          }
        } else {
          console.error("Review data not found:", response.data);
          setReview(null);
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
      const updatedReview = { ...review };

      const previousVote = localStorage.getItem(`review_${id}`);
      if (previousVote && previousVote !== type) {
        updatedReview.attributes[previousVote] = Math.max(
          (updatedReview.attributes[previousVote] || 0) - 1,
          0
        );
      }

      updatedReview.attributes[type] =
        (updatedReview.attributes[type] || 0) + 1;

      setReview(updatedReview);

      const updateData =
        previousVote && previousVote !== type
          ? {
              [previousVote]: updatedReview.attributes[previousVote],
              [type]: updatedReview.attributes[type],
            }
          : { [type]: updatedReview.attributes[type] };

      await axios.put(`${API_BASE_URL}/api/metal-reviews/${id}`, {
        data: updateData,
      });

      localStorage.setItem(`review_${id}`, type);
      setSelectedButton(type);
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  if (!review) return <div>Loading review...</div>;

  const attrs = review; // no .attributes layer
  const albumCoverUrl = attrs.Albumcover?.url;
  const bannerReviewUrl = attrs.BannerReview?.url;

  let videoHtml = null;
  try {
    const oembed = JSON.parse(attrs.oembed || "{}");
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
          <h2 className="review-title">{attrs.Title}</h2>
          {attrs.Writer && (
            <Link to={`/author/${attrs.Writer.username}`}>
              <Author author={attrs.Writer} />
            </Link>
          )}
        </div>

        <MarkdownRenderer content={attrs.Review} />

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
          Our Rating: <span className="rating-value">{attrs.Rating}</span>
        </p>

        <div className="your-rating-section">
          <p className="your-rating-title">Your Rating:</p>
          <div className="response-buttons">
            {["Good", "Okay", "Bad"].map((type) => (
              <button
                key={type}
                className={`${type.toLowerCase()}-button ${
                  selectedButton === type ? "selected" : ""
                }`}
                onClick={() => handleButtonClick(type)}
              >
                {type} ({attrs[type] || 0})
              </button>
            ))}
          </div>
        </div>

        <p className="tags-title">Tags:</p>
        {attrs.tags && <Tags tags={attrs.tags} />}

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
