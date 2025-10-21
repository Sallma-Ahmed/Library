import React, { useState } from "react";
import { Link } from "react-router-dom"; 
import '../styles/navbar.css'

export default function Navbar({
  logoSrc = "/images/logo.svg",
  brandName = "Selah Eltlmeez",
  user = null,
  onProfileClick = () => {},
  onLogout = () => {},
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="header">
      <div className="navbar">
        <Link  to="/" className="logo ">
          <img src={logoSrc} alt="logo" className="logo-img " />
          <p className="brand-name">{brandName}</p>
        </Link>

        <div className="user-section">
          <button
            className="menu-btn"
            onClick={() => setOpen(!open)}
            aria-label="Open menu"
          >
            <svg
              className="menu-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {user ? (
            <div className="user-menu">
              <button
                onClick={() => setOpen((v) => !v)}
                className="user-btn"
                aria-haspopup="true"
                aria-expanded={open}
              >
                <img
                  src={user.avatar || "/images/default-avatar.png"}
                  alt={user.name}
                  className="avatar"
                />
                <span className="user-name">{user.name}</span>
              </button>

              {open && (
                <div className="dropdown">
                  <button
                    onClick={() => {
                      setOpen(false);
                      onProfileClick();
                    }}
                    className="dropdown-item"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      setOpen(false);
                      onLogout();
                    }}
                    className="dropdown-item logout"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <a href="/login" className="login-btn">
                Login
              </a>
              <a href="/signup" className="signup-btn">
                Sign up
              </a>
            </div>
          )}
        </div>
      </div>

      {open && (
        <div className="mobile-menu">
          <nav className="mobile-nav">
            <a href="#" className="mobile-link">
              Home
            </a>
            <a href="#" className="mobile-link">
              Templates
            </a>
            <a href="#" className="mobile-link">
              About
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
