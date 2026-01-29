import { useEffect, useState } from "react";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import UserHeader from "../../components/user/UserHeader";
import "./Wishlist.css";

function Wishlist() {
    const [wishlist, setWishlist] = useState([]);

    const addToCart = (product) => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];

        const existing = cart.find((item) => item.id === product.id);

        let updatedCart;

        if (existing) {
            updatedCart = cart.map((item) =>
                item.id === product.id
                    ? { ...item, qty: item.qty + 1 }
                    : item
            );
        } else {
            updatedCart = [
                ...cart,
                { ...product, qty: 1 }
            ];
        }

        localStorage.setItem("cart", JSON.stringify(updatedCart));

        // 🔔 notify header badge (we'll add later)
        window.dispatchEvent(new Event("cartUpdated"));
    };


    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("wishlist")) || [];
        setWishlist(stored);
    }, []);

    const removeFromWishlist = (id) => {
        const updated = wishlist.filter((p) => p.id !== id);
        setWishlist(updated);
        localStorage.setItem("wishlist", JSON.stringify(updated));
        window.dispatchEvent(new Event("wishlistUpdated"));
    };

    return (
        <div className="wishlist-page">
            <UserHeader/>
    <section className="listing-section">

      {/* Header */}
      <div className="listing-header">
        <h2 className="page-title">My Wishlist</h2>
        <p className="page-subtitle">
          Your saved favorites, curated just for you
        </p>
        <div className="title-divider"></div>
      </div>

      {wishlist.length === 0 ? (
        <p className="empty-text">No items in wishlist</p>
      ) : (
                <div className="wishlist-grid">
                    {wishlist.map((p) => (
                        <div className="wishlist-card" key={p.id}>
                            {p.image && <img src={p.image} alt={p.name} />}

                            <h3>{p.name}</h3>
                            <p>{p.desc}</p>
                            <p className="price">₹ {p.price}</p>

                            <div className="wishlist-actions">
                                <button
                                    className="cart-btn"
                                    onClick={() => addToCart(p)}
                                >
                                    <FiShoppingCart /> Add to Cart
                                </button>

                                <button
                                    className="remove-btn"
                                    onClick={() => removeFromWishlist(p.id)}
                                >
                                    <FiHeart /> Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            </section>
        </div>
    );
}

export default Wishlist;
