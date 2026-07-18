import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaSearch,
  FaUserCircle,
  FaBars,
  FaTimes,
} from "react-icons/fa";

import { useCart } from "../../context/CartContext";
import CartDrawer from "../CartDrawer/CartDrawer";

import "./Navbar.css";

function Navbar() {
  const { totalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Dropdown activation state and DOM boundary target references
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // Mobile hamburger menu state
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  // Context handler logic tracking layout clicks to clear the menu wrapper context safely
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close the mobile menu automatically whenever the viewport is resized
  // back up to desktop width, so it can't get stuck open.
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 900) {
        setMobileOpen(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <header className="navbar">
      <div className="logo">
        <span className="food">Food</span>
        <span className="hub">Hub</span>
      </div>

      <nav className={mobileOpen ? "nav-links open" : "nav-links"}>
        <Link to="/" onClick={closeMobileMenu}>Home</Link>
        <Link to="/restaurants" onClick={closeMobileMenu}>Restaurants</Link>
        <Link to="/offers" onClick={closeMobileMenu}>Offers</Link>
        <Link to="/contact" onClick={closeMobileMenu}>Contact</Link>

        {/* Search box and auth links move inside the mobile dropdown too,
            so everything is reachable with the panel collapsed */}
        <div className="search-box mobile-only-in-menu">
          <FaSearch />
          <input type="text" placeholder="Search restaurants..." />
        </div>

        {!token ? (
          <div className="mobile-only-in-menu mobile-auth-links">
            <Link className="login-btn" to="/login" onClick={closeMobileMenu}>
              Login
            </Link>
            <Link className="register-btn" to="/register" onClick={closeMobileMenu}>
              Register
            </Link>
          </div>
        ) : (
          <div className="mobile-only-in-menu mobile-auth-links">
            <Link to="/profile" onClick={closeMobileMenu}>My Profile</Link>
            <Link to="/my-orders" onClick={closeMobileMenu}>My Orders</Link>
            <Link to="/favorites" onClick={closeMobileMenu}>❤️ Favorites</Link>
            <button
              onClick={() => {
                closeMobileMenu();
                logout();
              }}
              className="logout-btn"
            >
              Logout
            </button>
          </div>
        )}
      </nav>

      <div className="navbar-right">
        <div className="search-box desktop-only">
          <FaSearch />
          <input type="text" placeholder="Search restaurants..." />
        </div>

        {!token ? (
          <div className="desktop-only auth-links-inline">
            <Link className="login-btn" to="/login">
              Login
            </Link>

            <Link className="register-btn" to="/register">
              Register
            </Link>
          </div>
        ) : (
          <span className="hi-user desktop-only">
            Hi, {user?.full_name}
          </span>
        )}

        <div className="cart" onClick={() => navigate("/cart")}>
          <FaShoppingCart />
          <span>{totalItems}</span>
        </div>

        {/* Interactive Account Dropdown Anchor Frame Element (desktop) */}
        <div ref={menuRef} className="profile-menu-wrapper desktop-only">
          <FaUserCircle
            className="profile-icon"
            style={{ cursor: "pointer" }}
            onClick={() => setShowMenu(!showMenu)}
          />

          {showMenu && (
            <div className="profile-dropdown">
              <Link to="/profile">My Profile</Link>
              <Link to="/my-orders">My Orders</Link>
              <Link to="/favorites">❤️ Favorites</Link>
              <button onClick={logout} className="logout-btn">
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Hamburger toggle - mobile only */}
        <button
          className="hamburger-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
}

export default Navbar;
