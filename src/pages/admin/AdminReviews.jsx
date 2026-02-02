import { useEffect, useState } from "react";
import "./AdminReviews.css";

function AdminReviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const stored =
      JSON.parse(localStorage.getItem("allReviews")) || [];
    setReviews(stored);
  }, []);

  return (
    <div className="admin-reviews-page">
      <h2>Customer Reviews</h2>

      {reviews.length === 0 && (
        <p className="empty-text">No reviews yet</p>
      )}

      <div className="admin-reviews-grid">
        {reviews.map((r) => (
          <div className="admin-review-card" key={r.id}>
            <img src={r.productImage} alt={r.productName} />

            <div className="review-info">
              <h4>{r.productName}</h4>

              <p className="review-user">
                👤 {r.user}
              </p>

              <div className="stars">
                {"★".repeat(r.rating)}
                {"☆".repeat(5 - r.rating)}
              </div>

              <p className="comment">"{r.comment}"</p>

              <small>
                {new Date(r.createdAt).toLocaleString()}
              </small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminReviews;
