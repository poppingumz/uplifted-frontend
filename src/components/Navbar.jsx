import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaSearch } from 'react-icons/fa';
import Cookies from 'js-cookie';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('uplifted-notifications');
    return saved ? JSON.parse(saved) : [];
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const [hasNew, setHasNew] = useState(false);
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    try {
      const cookie = Cookies.get('user');
      return cookie ? JSON.parse(cookie) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const raw = Cookies.get('user');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (
          !user ||
          JSON.stringify(parsed.interests || []) !== JSON.stringify(user.interests || [])
        ) {
          console.log('🍪 Cookie interests changed:', parsed.interests);
          setUser(parsed);
        }
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [user]);

  const toggleMenu = () => setMenuOpen(o => !o);
  const handleSearchChange = e => setSearchQuery(e.target.value);
  const handleSearchSubmit = e => {
    e.preventDefault();
    console.log('🔍 Searching for:', searchQuery);
  };
  const handleLogout = () => {
    Cookies.remove('user');
    navigate('/login');
  };
  const handleNotificationClick = () => {
    setHasNew(false);
    setShowDropdown(d => !d);
  };

  useEffect(() => {
    const interests = user?.interests || [];
    if (interests.length === 0) {
      console.warn('🟡 No interests, skipping WS connect');
      return;
    }

    console.log('🌐 Connecting STOMP over SockJS for interests:', interests);
    const client = new Client({
      brokerURL: undefined, // Use SockJS instead of native WebSocket
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,
      heartbeatIncoming: 0,
      heartbeatOutgoing: 20000,
      debug: msg => console.log('📡 STOMP DEBUG:', msg),
    });

    client.onConnect = () => {
      console.log('✅ STOMP WebSocket connected');
      interests.forEach(cat => {
        const topic = `/topic/category/${cat}`;
        console.log('📡 Subscribing to:', topic);
        client.subscribe(topic, msg => {
          console.log('📬 Raw message:', msg.body);
          try {
            const data = JSON.parse(msg.body);
            const newNoti = { id: Date.now(), text: data.message };
            setNotifications(prev => {
              const updated = [newNoti, ...prev].slice(0, 10);
              localStorage.setItem('uplifted-notifications', JSON.stringify(updated));
              return updated;
            });
            setHasNew(true);
          } catch (e) {
            console.error('❌ JSON parse error:', e);
          }
        });
      });
    };

    client.onStompError = frame => console.error('❌ STOMP error:', frame);
    client.onWebSocketError = evt => console.error('❌ WebSocket error:', evt);

    client.activate();
    return () => client.deactivate();
  }, [user]);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="nav-logo">UpliftEd</Link>

        <form className="search-bar" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button type="submit"><FaSearch /></button>
        </form>

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
              <li
                className="notification-icon"
                onClick={handleNotificationClick}
                style={{ position: 'relative', cursor: 'pointer' }}
              >
                🔔
                {hasNew && <span className="notif-dot" />}
                {showDropdown && (
                  <div className="notification-dropdown">
                    {notifications.length
                      ? notifications.map(n => (
                          <div key={n.id} className="notification-item">{n.text}</div>
                        ))
                      : <div className="notification-item">No notifications</div>
                    }
                  </div>
                )}
              </li>
              <li><Link to="/account/me">My Account</Link></li>
              <li>
                <button onClick={handleLogout} className="nav-button logout-button">
                  Logout
                </button>
              </li>
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
