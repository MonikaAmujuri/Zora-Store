import { useEffect, useState } from "react";
import { FiHeart } from "react-icons/fi";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { getProducts } from "../utils/productStorage";
import "./SareeListing.css";

function SareeListing() {
  const { type } = useParams();
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search")?.toLowerCase() || "";

  const [products, setProducts] = useState([]);
  const [addedId, setAddedId] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [dressFilter, setDressFilter] = useState("all");
  const [croptopsFilter, setCropTopsFilter] = useState("all");
  const navigate = useNavigate();
  const subType = searchParams.get("type"); // subcategory
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [selectedColors, setSelectedColors] = useState([]);




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
  // PRICE FILTER
filteredProducts = filteredProducts.filter(
  (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
);

// COLOR FILTER
if (selectedColors.length > 0) {
  filteredProducts = filteredProducts.filter(
    (p) => selectedColors.includes(p.color)
  );
}

  /* DRESSES SUB FILTER */
if (type === "dresses" && dressFilter !== "all") {
  filteredProducts = filteredProducts.filter(
    (p) => p.subCategory === dressFilter
  );
}

/* Crop Tops SUB FILTER */
if (type === "croptops" && croptopsFilter !== "all") {
  filteredProducts = filteredProducts.filter(
    (p) => p.subCategory === croptopsFilter
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
      <div className="listing-layout">

            {/* LEFT FILTER BAR */}
            <aside className="filter-sidebar">

              <h4 className="filter-title">Filters</h4>

              {/* PRICE FILTER */}
              <div className="filter-section">
                <h5>Price</h5>

                <input
                  type="range"
                  min="0"
                  max="50000"
                  step="500"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([0, Number(e.target.value)])
                  }
                />

                <p>Up to ₹ {priceRange[1]}</p>
              </div>

              {/* COLOR FILTER */}
              <div className="filter-section">
                <h5>Color</h5>

                {["red", "blue", "green", "black", "pink","white"].map((color) => (
                  <label key={color} className="color-filter">
                    <input
                      type="checkbox"
                      checked={selectedColors.includes(color)}
                      onChange={() => {
                        setSelectedColors((prev) =>
                          prev.includes(color)
                            ? prev.filter((c) => c !== color)
                            : [...prev, color]
                        );
                      }}
                    />
                    <span className={`color-dot ${color}`}></span>
                    {color}
                  </label>
                ))}
              </div>

              {/* CLEAR FILTER */}
              <button
                className="clear-filter"
                onClick={() => {
                  setPriceRange([0, 50000]);
                  setSelectedColors([]);
                }}
              >
                Clear Filters
              </button>

            </aside>
            <div>
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
       {type === "dresses" && (
          <div className="dress-tabs">
            <button
              className={dressFilter === "all" ? "active" : ""}
              onClick={() => setDressFilter("all")}
            >
              All
            </button>

            <button
              className={dressFilter === "long-frock" ? "active" : ""}
              onClick={() => setDressFilter("long-frock")}
            >
              Long Frocks
            </button>

            <button
              className={dressFilter === "three-piece" ? "active" : ""}
              onClick={() => setDressFilter("three-piece")}
            >
              3 Piece Set
            </button>

            <button
              className={dressFilter === "dress-material" ? "active" : ""}
              onClick={() => setDressFilter("dress-material")}
            >
              Dress Materials
            </button>
          </div>
        )}
         {/* 👚 Crop Tops Subcategories */}
        {type === "croptops" && (
          <div className="subcategory-tabs">
            <button
              className={croptopsFilter === "all" ? "active" : ""}
              onClick={() => setCropTopsFilter("all")}
            >
              All
            </button>

            <button
              className={croptopsFilter === "half-sarees" ? "active" : ""}
              onClick={() => setCropTopsFilter("half-sarees")}
            >
              Half Sarees
            </button>

            <button
              className={croptopsFilter === "chunnies" ? "active" : ""}
              onClick={() => setCropTopsFilter("chunnies")}
            >
              Chunnies
            </button>

            <button
              className={croptopsFilter === "readymade-blouses" ? "active" : ""}
              onClick={() => setCropTopsFilter("readymade-blouses")}
            >
              Readymade Blouses
            </button>

            <button
              className={croptopsFilter === "leggings" ? "active" : ""}
              onClick={() => setCropTopsFilter("leggings")}
            >
              Leggings
            </button>
            <button
              className={croptopsFilter === "western-wear" ? "active" : ""}
              onClick={() => setCropTopsFilter("western-wear")}
            >
              Western Wear
            </button>
          </div>
        )}

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
          </div>

    
    </div>
  );
}

export default SareeListing;
