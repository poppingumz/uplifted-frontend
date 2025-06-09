import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaSearch } from 'react-icons/fa';
import Cookies from 'js-cookie';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const user = (() => {
  try {
    const cookie = Cookies.get('user');
    if (!cookie) return null;
    const parsed = JSON.parse(cookie);
    return parsed;
  } catch (err) {
    console.error("❌ Failed to parse cookie:", err);
    return null;
  }
})();


    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        console.log("Searching for:", searchQuery);
    };

    const handleLogout = () => {
        Cookies.remove('user');
        navigate('/login');
    };

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
                    {!user && (
                        <li><Link to="/login" className="nav-button login-button">Login</Link></li>
                    )}
                    {user && (
                        <li><Link to="/account/me">My Account</Link></li>
                    )}
                    {user && (
                        <li><button onClick={handleLogout} className="nav-button logout-button">Logout</button></li>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
