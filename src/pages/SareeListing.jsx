import { useEffect, useState } from "react";
import { FiHeart } from "react-icons/fi";
import { useParams, useSearchParams } from "react-router-dom";
import { getProducts } from "../utils/productStorage";
import "./SareeListing.css";

function SareeListing() {
  const { type } = useParams();
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search")?.toLowerCase() || "";

  const [products, setProducts] = useState([]);
  const [addedId, setAddedId] = useState(null);
  const [quantities, setQuantities] = useState({});

  const getFinalPrice = (price, discount = 0) => {
  if (!discount || discount <= 0) return price;
  return Math.round(price - (price * discount) / 100);
};




  const addToCart = (product) => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const discount = product.discount || 0;
  const finalPrice =
    discount > 0
      ? Math.round(product.price - (product.price * discount) / 100)
      : product.price;

  const existing = cart.find(item => item.id === product.id);

  let updatedCart;

  if (existing) {
    updatedCart = cart.map(item =>
      item.id === product.id
        ? { ...item, qty: item.qty + (quantities[product.id] || 1) }
        : item
    );
  } else {
    updatedCart = [
      ...cart,
      {
        ...product,
        price: Number(product.price),
        discount,
        finalPrice,
        qty: quantities[product.id] || 1,
      },
    ];
  }

  localStorage.setItem("cart", JSON.stringify(updatedCart));
  window.dispatchEvent(new Event("cartUpdated"));
};


  const increaseQty = (id) => {
    setQuantities(prev => ({
      ...prev,
      [id]: (prev[id] || 1) + 1
    }));
  };

  const decreaseQty = (id) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) - 1)
    }));
  };



  /* ❤️ WISHLIST STATE (TOP LEVEL – REQUIRED) */
  const [wishlist, setWishlist] = useState(() => {
    return JSON.parse(localStorage.getItem("wishlist")) || [];
  });

  /* LOAD PRODUCTS */
  useEffect(() => {
    setProducts(getProducts());
  }, []);

  /* WISHLIST HELPERS */
  const isWishlisted = (id) =>
    wishlist.some((item) => item.id === id);

  const toggleWishlist = (product) => {
    let updated;

    if (isWishlisted(product.id)) {
      updated = wishlist.filter((item) => item.id !== product.id);
    } else {
      updated = [...wishlist, product];
    }

    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
    window.dispatchEvent(new Event("wishlistUpdated"));

  };

  /* FILTER PRODUCTS */
  let filteredProducts = [...products];

  if (type) {
    filteredProducts = filteredProducts.filter(
      (p) => p.category === type
    );
  }

  if (searchTerm) {
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.desc?.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm)
    );
  }

  /* UI */
  return (
    <div className="saree-page">
    <section className="listing-section">

      {/* 🔥 HEADER (NEW – applies to ALL categories) */}
      <div className="listing-header">
        <h2 className="page-title">
          {searchTerm
            ? `Search results for "${searchTerm}"`
            : type
              ? `${type.charAt(0).toUpperCase() + type.slice(1)} Collection`
              : "All Products"}
        </h2>

        {!searchTerm && (
          <p className="page-subtitle">
            Handwoven elegance • Timeless craftsmanship
          </p>
        )}

        <div className="title-divider"></div>
      </div>

      {filteredProducts.length === 0 && (
        <p className="empty-text">No products found</p>
      )}


      <div className="products-grid">
        {filteredProducts.map((p) => (
          <div className="product-card" key={p.id}>
            {/* ❤️ Wishlist */}
            <button
              className={`wishlist-btn ${isWishlisted(p.id) ? "active" : ""
                }`}
              onClick={() => toggleWishlist(p)}
            >
              <FiHeart />
            </button>

            <img src={p.image} alt={p.name} />

            <div className="product-info">
              <h4>{p.name}</h4>
              <p>{p.desc}</p>

              <div className="price-row">
                <div className="price-row">
                  {p.discount > 0 ? (
                    <>
                      <span className="price discounted">
                        ₹ {p.discountedPrice}
                      </span>

                      <span className="price original">
                        ₹ {p.price}
                      </span>

                      <span className="discount-badge">
                        {p.discount}% OFF
                      </span>
                    </>
                  ) : (
                    <div className="price-row">
                        <span className="price">₹ {getFinalPrice(p.price, p.discount)}</span>

                        {p.discount > 0 && (
                          <>
                            <span className="original-price">₹ {p.price}</span>
                            <span className="discount">{p.discount}% OFF</span>
                          </>
                        )}
                      </div>

                  )}
                </div>

                
              </div>
              <div className="qty-control">
                <button onClick={() => decreaseQty(p.id)}>-</button>
                <span>{quantities[p.id] || 1}</span>
                <button onClick={() => increaseQty(p.id)}>+</button>
              </div>

              <button
                className={`add-to-cart ${addedId === p.id ? "added" : ""}`}
                onClick={() => {
                  addToCart({ ...p, qty: quantities[p.id] || 1 });
                  setAddedId(p.id);
                  setTimeout(() => setAddedId(null), 1500);
                }}
              >
                {addedId === p.id ? "✓ Added" : "Add to Cart"}
              </button>


            </div>
          </div>
        ))}
      </div>
      </section>
    </div>
  );
}

export default SareeListing;
