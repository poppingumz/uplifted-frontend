import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-sections">

                {/* Section 1: Logo & About */}
                <div className="footer-section about-section">
                    <h2>UpliftEd</h2>
                    <p>Empowering your learning journey. Join us to enhance your skills and knowledge through top-quality courses.</p>
                </div>

                {/* Section 2: Useful Links */}
                <div className="footer-section links-section">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="#">About Us</a></li>
                        <li><a href="#">Courses</a></li>
                        <li><a href="#">Contact</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Terms of Service</a></li>
                    </ul>
                </div>

                {/* Section 3: Contact Info */}
                <div className="footer-section contact-section">
                    <h3>Contact Us</h3>
                    <p>Email: <a href="mailto:support@uplifted.com">support@uplifted.com</a></p>
                    <p>Phone: <a href="tel:+14155552671">+1 415 555 2671</a></p>
                    <p>
                        Address: 
                        <a 
                            href="https://www.google.com/maps/place/500+Terry+A+Francois+Blvd,+San+Francisco,+CA+94158"
                            target="_blank" 
                            rel="noreferrer"
                        >
                        <span> 500 Terry A Francois Blvd, San Francisco, CA 94158</span>
                        </a>
                    </p>
                </div>

                {/* Section 4: Social Media */}
                <div className="footer-section social-section">
                    <h3>Follow Us</h3>
                    <div className="social-icons">
                        <a href="#"><FaFacebookF /></a>
                        <a href="#"><FaTwitter /></a>
                        <a href="#"><FaInstagram /></a>
                        <a href="#"><FaLinkedin /></a>
                        <a href="#"><FaYoutube /></a>
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="footer-bottom">
                <p>&copy; 2025 UpliftEd. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
