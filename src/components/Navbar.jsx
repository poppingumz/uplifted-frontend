// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import Cookies from 'js-cookie';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('uplifted-notifications');
    return saved ? JSON.parse(saved) : [];
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const [hasNew, setHasNew] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      const cookie = Cookies.get('user');
      return cookie ? JSON.parse(cookie) : null;
    } catch {
      return null;
    }
  });

  const navigate = useNavigate();
  const toggleMenu = () => setMenuOpen(prev => !prev);
  const handleNotificationClick = () => {
    setHasNew(false);
    setShowDropdown(prev => !prev);
  };

  useEffect(() => {
    const raw = Cookies.get('user');
    if (raw) {
      const parsed = JSON.parse(raw);
      setUser(parsed);
    }

    const saved = localStorage.getItem('uplifted-notifications');
    if (saved) {
      const parsedNotifs = JSON.parse(saved);
      setNotifications(parsedNotifs);
      if (parsedNotifs.length > 0) setHasNew(true);
    }
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="nav-logo">UpliftEd</Link>

        <div className="menu-icon" onClick={toggleMenu}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>

        <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/courses">Courses</Link></li>
          <li><Link to="/aboutus">About Us</Link></li>
          <li><Link to="/contact">Contact</Link></li>

          {user ? (
            <>
              <li onClick={handleNotificationClick} style={{ cursor: 'pointer' }}>
                🔔 {hasNew && <span className="notif-dot" />}
                {showDropdown && (
                  <div className="notification-dropdown">
                    {notifications.length ? notifications.map(n => (
                      <div key={n.id} className="notification-item">{n.text}</div>
                    )) : <div className="notification-item">No notifications</div>}
                  </div>
                )}
              </li>
              <li><Link to="/account/me">My Account</Link></li>
            </>
          ) : (
            <li><Link to="/login" className="nav-button login-button">Login</Link></li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
