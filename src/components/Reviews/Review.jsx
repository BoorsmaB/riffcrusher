import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import MarkdownRenderer from "../MarkdownRenderer/MarkdownRenderer";
import Tags from "./Tags"; // Ensure correct import
import "./Review.css";
import Author from "./Author";

function Review() {
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const [selectedButton, setSelectedButton] = useState(null);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await axios.get(
          `http://localhost:1337/api/metalreviews/${id}?populate=Albumcover,BannerReview,tags,Writer`
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
        }
      } catch (error) {
        console.error("Error fetching review:", error);
      }
    };

    fetchReview();
  }, [id]);

  const handleButtonClick = async (type) => {
    if (!review || selectedButton === type) return;

    try {
      let newCount = review[type] ? review[type] + 1 : 1;

      // Remove previous vote if any
      const previousVote = localStorage.getItem(`review_${id}`);
      if (previousVote && previousVote !== type) {
        const previousCount = review[previousVote]
          ? review[previousVote] - 1
          : 0;
        newCount = review[type] ? review[type] + 1 : 1;

        // Update the review state and local storage with the new counts
        setReview((prevReview) => ({
          ...prevReview,
          [previousVote]: previousCount,
          [type]: newCount,
        }));
      } else {
        // Just increment the count if no previous vote
        newCount = review[type] ? review[type] + 1 : 1;
        setReview((prevReview) => ({
          ...prevReview,
          [type]: newCount,
        }));
      }

      await axios.put(`http://localhost:1337/api/metalreviews/${id}`, {
        data: {
          [type]: newCount,
        },
      });

      // Update local storage with the new vote
      localStorage.setItem(`review_${id}`, type);
      setSelectedButton(type);
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  if (!review) {
    return <div>Loading review...</div>;
  }

  const albumCoverUrl = review.Albumcover?.data?.attributes?.url;
  const bannerReviewUrl = review.BannerReview?.data?.attributes?.url;

  // Parse oembed field and extract HTML code for embedding the video
  const oembed = JSON.parse(review.oembed);
  const videoHtml = oembed?.rawData?.html;

  return (
    <div className="review-container">
      <div className="home-container">
        <div className="review-header">
          {albumCoverUrl && (
            <img
              src={`http://localhost:1337${albumCoverUrl}`}
              alt="Album Cover"
              className="review-cover"
            />
          )}
          <h2 className="review-title">{review.Title}</h2>
          {review.Writer && (
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
              style={{ width: "100%", height: "100%" }} // Apply inline styles directly
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
            src={`http://localhost:1337${bannerReviewUrl}`}
            alt="Banner Review"
            className="banner-review"
          />
        )}
      </div>
    </div>
  );
}

export default Review;
