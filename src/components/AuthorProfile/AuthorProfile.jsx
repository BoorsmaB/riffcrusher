import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import "./AuthorProfile.css";

function AuthorProfile() {
  const { username } = useParams(); // Retrieve username from URL parameters
  const [authorInfo, setAuthorInfo] = useState(null);
  const [authorReviews, setAuthorReviews] = useState([]);
  const API_TOKEN =
    "573fd8cdf7abe1754a888b2378e04ecf6021ef21a187830c886e4d0a50b099aad445af426afd4f84e39d3fadb2edfa31cf75e42dbfdfd23ebebdeaf16c0d97a9350533ec7b2de03cf85f9503f1f792279fc3b6aa035a2a9fdc467a39083db2ce0dc1c6c225fbc3350b4a6a1987b22b950798684865c7dfd5c8ac38ea5429d07d"; // Replace with your actual API token

  useEffect(() => {
    const fetchAuthorInfo = async () => {
      try {
        console.log(`Fetching author with username: ${username}`);
        const response = await axios.get(
          `http://localhost:1337/api/users?filters[username][$eq]=${username}`,
          {
            headers: {
              Authorization: `Bearer ${API_TOKEN}`,
            },
          }
        );
        console.log("API response:", response.data);
        if (response.data && response.data.length > 0) {
          const author = response.data[0];
          setAuthorInfo(author);

          // Fetch reviews written by this author
          const reviewsResponse = await axios.get(
            `http://localhost:1337/api/metalreviews?filters[Writer][id][$eq]=${author.id}&populate=Albumcover`,
            {
              headers: {
                Authorization: `Bearer ${API_TOKEN}`,
              },
            }
          );
          console.log("Reviews response:", reviewsResponse.data);
          if (reviewsResponse.data && reviewsResponse.data.data) {
            setAuthorReviews(reviewsResponse.data.data);
          } else {
            setAuthorReviews([]);
          }
        } else {
          console.error("Author not found");
        }
      } catch (error) {
        console.error("Error fetching author info:", error);
      }
    };

    fetchAuthorInfo();
  }, [username]);

  if (!authorInfo) {
    return <div>Loading author profile...</div>;
  }

  return (
    <div className="author-profile-container">
      <h2>{authorInfo.username}'s Reviews</h2>
      <ul className="album-list">
        {authorReviews.map((review) => {
          const albumCoverUrl =
            review.attributes.Albumcover?.data?.attributes?.url;
          return (
            <Link
              to={`/review/${review.id}`}
              className="album-link"
              key={review.id}
            >
              <li
                className="album-card"
                style={{
                  backgroundColor: "rgb(210, 210, 210)",
                  color: "black",
                }}
              >
                {albumCoverUrl && (
                  <img
                    src={`http://localhost:1337${albumCoverUrl}`}
                    alt={review.attributes.Title}
                    className="album-cover"
                  />
                )}
                <div className="album-info">
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
