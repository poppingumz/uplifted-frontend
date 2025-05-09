import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaSearch } from 'react-icons/fa';
import Cookies from 'js-cookie';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null;

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
                    <li><Link to="/login" className="nav-button login-button">Login</Link></li>
                    {user && (
                        <Link to={`/account/${user.user.id}`}>My Account</Link>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
