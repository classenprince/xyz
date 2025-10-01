import React from 'react';
import './Navbar.css';

const Navbar = ({ onMenuToggle }) => {
  return (
    <div className="navbar">
      <div className="navbar-left">
        <div className="logo-section">
          <div className="logo">LOGO</div>
        </div>
      </div>
      
      <div className="navbar-center">
        <div className="navbar-title">NAVBAR</div>
      </div>
      
      <div className="navbar-right">
        <div className="profile-section">
          <div className="profile-avatar" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="7" r="4" fill="#fff"/>
              <path d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6v1H4v-1z" fill="#fff"/>
            </svg>
          </div>
          <span className="profile-text">Doctor's Profile</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
