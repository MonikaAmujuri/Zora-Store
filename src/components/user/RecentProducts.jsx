import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import "./RecentProducts.css";

function RecentProducts() {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const allProducts =
      JSON.parse(localStorage.getItem("products")) || [];

    const recent = [...allProducts]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5); 

    setProducts(recent);
    setWishlist(
      JSON.parse(localStorage.getItem("wishlist")) || []
    );
  }, []);

  if (products.length === 0) return null;

  /* ❤️ helpers */
  const isWishlisted = (id) =>
    wishlist.some((item) => item.id === id);

  const toggleWishlist = (product) => {
    let updated;

    if (isWishlisted(product.id)) {
      updated = wishlist.filter(
        (item) => item.id !== product.id
      );
    } else {
      updated = [...wishlist, product];
    }

    setWishlist(updated);
    localStorage.setItem(
      "wishlist",
      JSON.stringify(updated)
    );
    window.dispatchEvent(
      new Event("wishlistUpdated")
    );
  };

  return (
    <div className="recent-section">
      <div className="recent-divider"></div>
      <h2 className="recent-title"></h2>

      <div className="recent-grid">
        {products.map((p) => (
          <div className="recent-card" key={p.id}>
            <div className="recent-img-wrap">
              <img
                src={p.image}
                alt={p.name}
                onClick={() =>
                  navigate(`/sarees/${p.category}`)
                }
              />

              <button
                className={`wishlist-btn ${
                  isWishlisted(p.id) ? "active" : ""
                }`}
                onClick={() => toggleWishlist(p)}
              >
                <FiHeart />
              </button>
            </div>

            <div className="recent-info">
              <h4>{p.name}</h4>
              <p className="recent-price">₹ {p.price}</p>

              <button
                className="recent-btn"
                onClick={() =>
                  navigate(`/sarees/${p.category}`)
                }
              >
                View Product
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentProducts;
