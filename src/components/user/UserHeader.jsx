import { useEffect, useState } from "react";
import { FiSearch, FiX, FiHeart, FiShoppingCart, FiUser, FiChevronDown } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AdminContext";
import "./UserHeader.css";

function UserHeader() {
  
  const [open, setOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;
  const token = localStorage.getItem("token");
  const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  navigate("/");
};
  
  const navigate = useNavigate();

  const handleSearch = (value) => {
    setSearchTerm(value);

    if (value.trim()) {
      navigate(`/products/all?search=${encodeURIComponent(value)}`);
    } else {
      navigate("/");
    }
  };

  // 🔁 Read wishlist count
  const updateWishlistCount = () => {
    const wishlist =
      JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlistCount(wishlist.length);
  };

  useEffect(() => {
    updateWishlistCount();

    // listen for updates from other components
    window.addEventListener("storage", updateWishlistCount);
    window.addEventListener("wishlistUpdated", updateWishlistCount);

    return () => {
      window.removeEventListener("storage", updateWishlistCount);
      window.removeEventListener("wishlistUpdated", updateWishlistCount);
    };
  }, []);

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    setCartCount(totalQty);
  };

  useEffect(() => {
    updateCartCount();

    window.addEventListener("cartUpdated", updateCartCount);
    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);


  return (
    <header className="user-header">
      <div className="header-left">
        <Link to="/" className="logo">
          ZORA
        </Link>
      </div>

      <div className="header-actions">
        {/* SEARCH */}
        <div className={`search-wrapper ${showSearch ? "active" : ""}`}>
          {showSearch && (
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              autoFocus
            />
          )}

          <button
            className="icon-btn"
            onClick={() => setShowSearch((p) => !p)}
          >
            {showSearch ? <FiX /> : <FiSearch />}
          </button>
        </div>


        {/* ❤️ WISHLIST */}
        <Link to="/wishlist" className="icon-btn wishlist-icon">
          <FiHeart />
          {wishlistCount > 0 && (
            <span className="wishlist-badge">{wishlistCount}</span>
          )}
        </Link>

        <Link to="/cart" className="icon-btn cart-icon">
          <FiShoppingCart />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>

        <div className="header-actions">

          {user ? (
            <div
              className="account-wrapper"
              onMouseLeave={() => setOpen(true)}
            >
              <button
                className="account-btn"
                onClick={() => setOpen(!open)}
              >
                <FiUser />
                <FiChevronDown />
              </button>

              {open && (
                <div className="account-dropdown">
                  <p className="user-email">{user.email}</p>

                  {/* USER LINKS */}
                  {user.role === "user" && (
                    <>
                      <Link to="/my-orders">My Orders</Link>
                      <Link to="/profile">My Profile</Link>
                    </>
                  )}

                  {/* ADMIN LINK */}
                  {user.role === "admin" && (
                    <Link to="/admin/dashboard">Admin Dashboard</Link>
                  )}

                  <button
                    className="logout-btn"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="login-btn">
              Login
            </Link>
          )}

        </div>
      </div>
    </header>
  );
}

export default UserHeader;
