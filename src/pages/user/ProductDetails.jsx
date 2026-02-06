import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProducts } from "../../utils/productStorage";
import { useAuth } from "../../context/AuthContext";
import { FiHeart } from "react-icons/fi";
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);

  /* REVIEWS */
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  /* AUTH */
  const { user } = useAuth();

  /* LOAD PRODUCT */
  useEffect(() => {
    const products = getProducts();
    const found = products.find((p) => String(p._id) === id);
    setProduct(found);
  }, [id]);

  /* LOAD REVIEWS */
  useEffect(() => {
  const loadReviews = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/reviews/${id}`
      );
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.error("Failed to load reviews", err);
    }
  };

  loadReviews();
}, [id]);

  /* PRICE LOGIC */
  if (!product) {
  return <p className="empty-text">Product not found</p>;
}

const finalPrice =
  product.discount > 0
    ? Math.round(
        product.price - (product.price * product.discount) / 100
      )
    : product.price;

  /* ADD TO CART (MongoDB) */
  const addToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          productId: product._id,
          quantity: qty,
        }),
      });

      // optional: cart badge refresh
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Add to cart failed", error);
    }
  };

  /* SUBMIT REVIEW */
  /* SUBMIT REVIEW (MongoDB) */
const handleSubmitReview = async () => {
  if (!user) {
    alert("Please login to add a review");
    return;
  }

  if (!comment.trim()) return;

  try {
    const res = await fetch(
      "http://localhost:5000/api/reviews/add",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          productId: product._id,
          rating,
          comment,
        }),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      alert(err.message || "Failed to add review");
      return;
    }

    // reload reviews
    const updated = await fetch(
      `http://localhost:5000/api/reviews/${id}`
    );
    setReviews(await updated.json());

    setComment("");
    setRating(5);
  } catch (error) {
    console.error("Review submit failed", error);
  }

  // 1️⃣ PRODUCT-SPECIFIC REVIEWS
  const productReviews =
    JSON.parse(localStorage.getItem(`reviews_${id}`)) || [];

  const updatedProductReviews = [
    newReview,
    ...productReviews,
  ];

  localStorage.setItem(
    `reviews_${id}`,
    JSON.stringify(updatedProductReviews)
  );

  setReviews(updatedProductReviews);

  // 2️⃣ GLOBAL ADMIN REVIEWS
  const allReviews =
    JSON.parse(localStorage.getItem("allReviews")) || [];

  localStorage.setItem(
    "allReviews",
    JSON.stringify([newReview, ...allReviews])
  );

  setComment("");
  setRating(5);
};


  /* AVERAGE RATING */
  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) /
          reviews.length
        ).toFixed(1)
      : null;

  return (
    <div className="product-details-page">
      <div className="product-details-card">
        {/* IMAGE */}
        <div className="product-image">
          <img src={product.image} alt={product.name} />
        </div>

        {/* INFO */}
        <div className="product-info">
          <h2>{product.name}</h2>
          <p className="desc">{product.desc}</p>

          {/* PRICE */}
          <div className="price-row">
            <span className="final-price">₹ {finalPrice}</span>

            {product.discount > 0 && (
              <>
                <span className="original-price">
                  ₹ {product.price}
                </span>
                <span className="discount-badge">
                  {product.discount}% OFF
                </span>
              </>
            )}
          </div>

          {/* RATING */}
          {avgRating && (
            <p className="avg-rating">
              ⭐ {avgRating} ({reviews.length} reviews)
            </p>
          )}

          {/* QTY */}
          <div className="qty-control">
            <button onClick={() => setQty(Math.max(1, qty - 1))}>
              -
            </button>
            <span>{qty}</span>
            <button onClick={() => setQty(qty + 1)}>+</button>
          </div>

          {/* ACTIONS */}
          <button className="add-cart-btn" onClick={addToCart}>
            Add to Cart
          </button>
        </div>
      </div>

      {/* REVIEWS */}
      <div className="reviews-section">
        <h3>Customer Reviews</h3>

        {/* ADD REVIEW */}
        <div className="review-form">
          <div className="stars">
            {[1, 2, 3, 4, 5].map((s) => (
              <span
                key={s}
                className={s <= rating ? "active" : ""}
                onClick={() => setRating(s)}
              >
                ★
              </span>
            ))}
          </div>

          <textarea
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button onClick={handleSubmitReview}>
            Submit Review
          </button>
        </div>

        {/* REVIEWS LIST */}
        {reviews.length === 0 && (
          <p className="no-reviews">No reviews yet</p>
        )}

        {reviews.map((r) => (
          <div className="review-item" key={r._id}>
            <strong>{r.user}</strong>
            <div className="stars">
              {"★".repeat(r.rating)}
            </div>
            <p>{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductDetails;
