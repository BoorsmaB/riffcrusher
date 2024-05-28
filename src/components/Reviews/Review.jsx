import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import MarkdownRenderer from "../MarkdownRenderer/MarkdownRenderer";
import Tags from "./Tags"; // Ensure correct import
import "./Review.css";

function Review() {
  const { id } = useParams();
  const [review, setReview] = useState(null);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await axios.get(
          `http://localhost:1337/api/metalreviews/${id}?populate=*`
        );
        console.log("Full response data:", response.data);
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

  console.log("Review tags:", review.tags); // Debugging line

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
          {review.createdBy && (
            <p className="review-author">
              Written by: {review.createdBy.data.attributes.username}
            </p>
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
          Rating: <span className="rating-value">{review.Rating}</span>
        </p>
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
