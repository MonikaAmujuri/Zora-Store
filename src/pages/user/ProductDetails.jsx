import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProducts } from "../../utils/productStorage";
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
  const user = JSON.parse(localStorage.getItem("loggedUser"));

  /* LOAD PRODUCT */
  useEffect(() => {
    const products = getProducts();
    const found = products.find((p) => String(p._id) === id);
    setProduct(found);
  }, [id]);

  /* LOAD REVIEWS */
  useEffect(() => {
    const stored =
      JSON.parse(localStorage.getItem(`reviews_${id}`)) || [];
    setReviews(stored);
  }, [id]);

  if (!product) {
    return <p className="empty-text">Product not found</p>;
  }

  /* PRICE LOGIC */
  const finalPrice =
    product.discount > 0
      ? Math.round(
          product.price - (product.price * product.discount) / 100
        )
      : product.price;

  /* ADD TO CART */
  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find((item) => item.id === product._id);

    let updated;
    if (existing) {
      updated = cart.map((item) =>
        item.id === product.id
          ? { ...item, qty: item.qty + qty }
          : item
      );
    } else {
      updated = [
        ...cart,
        {
          ...product,
          qty,
          finalPrice,
        },
      ];
    }

    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  /* SUBMIT REVIEW */
  const handleSubmitReview = () => {
  if (!user) {
    alert("Please login to add a review");
    return;
  }

  if (!comment.trim()) return;

  const newReview = {
    id: Date.now(),
    productId: product.id,
    productName: product.name,
    productImage: product.image,
    user: user.name || user.email,
    rating,
    comment,
    createdAt: new Date().toISOString(),
  };

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
          <div className="review-item" key={r.id}>
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
