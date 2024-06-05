// AuthorProfile.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import "./AuthorProfile.css";

function AuthorProfile() {
  const { username } = useParams();
  const [authorInfo, setAuthorInfo] = useState(null);
  const [authorReviews, setAuthorReviews] = useState([]);
  const [authorId, setAuthorId] = useState(null);
  const API_TOKEN =
    "573fd8cdf7abe1754a888b2378e04ecf6021ef21a187830c886e4d0a50b099aad445af426afd4f84e39d3fadb2edfa31cf75e42dbfdfd23ebebdeaf16c0d97a9350533ec7b2de03cf85f9503f1f792279fc3b6aa035a2a9fdc467a39083db2ce0dc1c6c225fbc3350b4a6a1987b22b950798684865c7dfd5c8ac38ea5429d07d";

  useEffect(() => {
    const fetchAuthorInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:1337/api/users?filters[username][$eq]=${username}`,
          {
            headers: {
              Authorization: `Bearer ${API_TOKEN}`,
            },
          }
        );
        if (response.data && response.data.length > 0) {
          const author = response.data[0];
          setAuthorInfo(author);
          setAuthorId(author.id);
        } else {
          console.error("Author not found");
        }
      } catch (error) {
        console.error("Error fetching author info:", error);
      }
    };

    fetchAuthorInfo();
  }, [username]);

  useEffect(() => {
    if (authorId) {
      const fetchAuthorReviews = async () => {
        try {
          const response = await axios.get(
            `http://localhost:1337/api/metalreviews?filters[author][id][$eq]=${authorId}&populate=Albumcover`,
            {
              headers: {
                Authorization: `Bearer ${API_TOKEN}`,
              },
            }
          );
          if (response.data && response.data.data) {
            setAuthorReviews(response.data.data);
          } else {
            setAuthorReviews([]);
          }
        } catch (error) {
          console.error("Error fetching author reviews:", error);
        }
      };

      fetchAuthorReviews();
    }
  }, [authorId]);

  if (!authorInfo) {
    return <div>Loading author profile...</div>;
  }

  return (
    <div className="author-profile-container">
      <h1>{authorInfo.username}'s Profile</h1>
      <p>Email: {authorInfo.email}</p>
      <h2>{authorInfo.username}'s Reviews</h2>
      <ul className="review-list">
        {authorReviews.map((review) => {
          const albumCoverUrl =
            review.attributes.Albumcover?.data?.attributes?.url;
          return (
            <Link
              to={`/review/${review.id}`}
              className="review-link"
              key={review.id}
            >
              <li className="review-card">
                {albumCoverUrl && (
                  <img
                    src={`http://localhost:1337${albumCoverUrl}`}
                    alt={review.attributes.Title}
                    className="album-cover"
                  />
                )}
                <div className="review-info">
                  <h3>{review.attributes.Title}</h3>
                  <h4>{review.attributes.Band}</h4>
                  <div className="review-preview">
                    <ReactMarkdown>
                      {`${review.attributes.Review.split(" ")
                        .slice(0, 20)
                        .join(" ")} ...`}
                    </ReactMarkdown>
                  </div>
                  <p className="read-more">Read more</p>
                </div>
              </li>
            </Link>
          );
        })}
      </ul>
    </div>
  );
}

export default AuthorProfile;
