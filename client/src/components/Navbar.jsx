import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ user, logout }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          ZarooriBazaar
        </Link>

        {/* Hamburger Button (mobile) */}
        <button
          className="nav-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? "✖" : "☰"}
        </button>

        {/* Nav Links */}
        <div className={`nav-links ${mobileOpen ? "active" : ""}`}>
          <Link
            to="/"
            className="nav-link"
            onClick={() => setMobileOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/products"
            className="nav-link"
            onClick={() => setMobileOpen(false)}
          >
            Products
          </Link>
          <Link
            to="/cart"
            className="nav-link"
            onClick={() => setMobileOpen(false)}
          >
            Cart
          </Link>

          {/* Auth Links */}
          {user ? (
            <div
              className="nav-profile"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button className="nav-link profile-btn">{user.name} ▼</button>
              {dropdownOpen && (
                <div className="dropdown">
                  <Link
                    to="/dashboard"
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/purchases"
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Previous Purchases
                  </Link>
                  <button onClick={logout} className="dropdown-item">
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="nav-link"
                onClick={() => setMobileOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="nav-link"
                onClick={() => setMobileOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
