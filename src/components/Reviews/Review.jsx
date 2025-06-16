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
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const [selectedButton, setSelectedButton] = useState(null);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        console.log("useParams ID:", id);

        const response = await axios.get(
          `${API_BASE_URL}/api/metal-reviews/${id}?populate[Albumcover]=*&populate[BannerReview]=*&populate[tags]=*&populate[Writer]=*`,
          API_TOKEN
            ? {
                headers: {
                  Authorization: `Bearer ${API_TOKEN}`,
                },
              }
            : {}
        );

        console.log("Full response data:", response.data);
        console.log("Review object:", response.data?.data);
        console.log("Attributes:", response.data?.data?.attributes);

        if (response.data?.data) {
          setReview(response.data.data);

          const localStorageKey = `review_${id}`;
          const hasVoted = localStorage.getItem(localStorageKey);
          if (hasVoted) {
            setSelectedButton(hasVoted);
          }
        } else {
          console.error("Review data not found in the response.");
        }
      } catch (error) {
        console.error("Error fetching review:", error);
      }
    };

    fetchReview();
  }, [id]);

  const handleButtonClick = async (type) => {
    if (!review || selectedButton === type) return;

    const currentData = review.attributes;

    try {
      let newCount = currentData[type] ? currentData[type] + 1 : 1;

      const previousVote = localStorage.getItem(`review_${id}`);
      if (previousVote && previousVote !== type) {
        const previousCount = currentData[previousVote]
          ? currentData[previousVote] - 1
          : 0;

        setReview((prev) => ({
          ...prev,
          attributes: {
            ...prev.attributes,
            [previousVote]: previousCount,
            [type]: newCount,
          },
        }));
      } else {
        setReview((prev) => ({
          ...prev,
          attributes: {
            ...prev.attributes,
            [type]: newCount,
          },
        }));
      }

      await axios.put(
        `${API_BASE_URL}/api/metal-reviews/${id}`,
        {
          data: {
            [type]: newCount,
          },
        },
        API_TOKEN
          ? {
              headers: {
                Authorization: `Bearer ${API_TOKEN}`,
              },
            }
          : {}
      );

      localStorage.setItem(`review_${id}`, type);
      setSelectedButton(type);
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  if (!review) return <div>Loading review...</div>;

  const attrs = review.attributes || {};
  const albumCoverUrl = attrs.Albumcover?.data?.attributes?.url;
  const bannerReviewUrl = attrs.BannerReview?.data?.attributes?.url;
  const writer = attrs.Writer?.data?.attributes;

  const oembed = attrs.oembed ? JSON.parse(attrs.oembed) : null;
  const videoHtml = oembed?.rawData?.html;

  return (
    <div className="review-container">
      <div className="home-container">
        <div className="review-header">
          {albumCoverUrl && (
            <img
              src={`${API_BASE_URL}${albumCoverUrl}`}
              alt={attrs.Title || "Album Cover"}
              className="review-cover"
            />
          )}
          <h2 className="review-title">{attrs.Title || "Untitled"}</h2>
          <h4>{attrs.Band || "Unknown Band"}</h4>

          {writer && (
            <Link to={`/author/${writer.username}`}>
              <Author author={writer} />
            </Link>
          )}
        </div>

        <MarkdownRenderer
          content={attrs.Review || "No review content available."}
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
          <span className="rating-value">{attrs.Rating || "N/A"}</span>
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
              Good ({attrs.Good || 0})
            </button>
            <button
              className={`okay-button ${
                selectedButton === "Okay" ? "selected" : ""
              }`}
              onClick={() => handleButtonClick("Okay")}
            >
              Okay ({attrs.Okay || 0})
            </button>
            <button
              className={`bad-button ${
                selectedButton === "Bad" ? "selected" : ""
              }`}
              onClick={() => handleButtonClick("Bad")}
            >
              Bad ({attrs.Bad || 0})
            </button>
          </div>
        </div>

        <p className="tags-title">Tags:</p>
        {attrs.tags ? <Tags tags={attrs.tags} /> : <p>No tags available.</p>}

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
