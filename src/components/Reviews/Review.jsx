import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import MarkdownRenderer from "../MarkdownRenderer/MarkdownRenderer";
import "./Review.css";

function Review() {
  const { id } = useParams();
  const [review, setReview] = useState(null);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await axios.get(
          `http://localhost:1337/api/metalreviews/${id}?populate=Albumcover&populate=BannerReview`
        );
        if (
          response.data &&
          response.data.data &&
          response.data.data.attributes
        ) {
          setReview(response.data.data.attributes);
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

  if (!review) {
    return <div>Loading review...</div>;
  }

  const albumCoverUrl = review.Albumcover?.data?.attributes?.url;
  const bannerReviewUrl = review.BannerReview?.data?.attributes?.url;

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
        </div>
        <MarkdownRenderer content={review.Review} />
        <p className="review-rating">
          Rating: <span className="rating-value">{review.Rating}</span>
        </p>
        {bannerReviewUrl && (
          <div className="centered-banner">
            <img
              src={`http://localhost:1337${bannerReviewUrl}`}
              alt="Banner Review"
              className="banner-review small-banner"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Review;
