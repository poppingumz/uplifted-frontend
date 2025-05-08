import React from 'react';
import Navbar from '../components/Navbar';
import teamImage from '../assets/img/teamwork.png';
import missionImage from '../assets/img/mission.jpg';
import { Link } from 'react-router-dom';

const AboutUs = () => {
    return (
        <>
            <Navbar />
            <div className="about-page">

                {/* HERO SECTION */}
                <section className="about-hero">
                    <div className="hero-text">
                        <h1>About UpliftEd</h1>
                        <p>
                            At UpliftEd, we believe education should be accessible, empowering, and transformative.
                            Our mission is to provide top-quality online learning experiences that uplift and inspire learners of all backgrounds.
                        </p>
                    </div>
                    <div className="hero-image">
                        <img src={teamImage} alt="Teamwork" />
                    </div>
                </section>

                <section className="mission-section">
                {/* Mission */}
                <div className="mission-block">
                    <div className="text">
                        <h2>Our Mission</h2>
                        <p>
                            To empower individuals with relevant, engaging, and skill-driven education that enhances their personal and professional lives.
                            UpliftEd connects passionate educators with motivated learners in an intuitive and inclusive environment.
                        </p>
                    </div>
                </div>

                {/* Vision */}
                <div className="vision-block">
                    <div className="text">
                        <h2>Our Vision</h2>
                        <p>
                            We envision a world where learning is not confined by walls, borders, or limitations. UpliftEd is committed to building a future 
                            where quality education is accessible to all — empowering students, career switchers, professionals, and dreamers alike.
                        </p>
                        <p>
                            Our goal is to help create global citizens who are equipped with practical skills, critical thinking, and confidence to thrive in 
                            the modern world. Whether you're in a rural village or a buzzing city, your future is just a few clicks away.
                        </p>
                    </div>
                    <div className="image">
                        <img src={missionImage} alt="Our Vision" className="section-image" />
                    </div>
                </div>
            </section>


                {/* OUR VALUES */}
                <section className="values-section">
                    <h2>Our Core Values</h2>
                    <ul>
                        <li><strong>Accessibility:</strong> Learning should be open to everyone.</li>
                        <li><strong>Innovation:</strong> We use cutting-edge tech and ideas to keep content fresh and effective.</li>
                        <li><strong>Community:</strong> We foster collaboration between educators and learners worldwide.</li>
                        <li><strong>Quality:</strong> Every course is crafted with care, clarity, and excellence.</li>
                    </ul>
                </section>

                {/* FEATURES / REASONS */}
                <section className="features-section">
                    <h2>Why Choose UpliftEd?</h2>
                    <div className="features">
                        <div className="feature-card">
                            <i className="fas fa-graduation-cap"></i>
                            <h3>Expert Instructors</h3>
                            <p>Our educators are industry professionals and experienced mentors who care about your success.</p>
                        </div>
                        <div className="feature-card">
                            <i className="fas fa-laptop-code"></i>
                            <h3>Modern Learning</h3>
                            <p>Interactive videos, quizzes, downloadable resources, and practical projects in every course.</p>
                        </div>
                        <div className="feature-card">
                            <i className="fas fa-globe-americas"></i>
                            <h3>Global Access</h3>
                            <p>Learn from anywhere — our platform is available 24/7 on any device worldwide.</p>
                        </div>
                    </div>
                </section>

                {/* CALL TO ACTION */}
                <section className="join-section">
                    <h2>Join Us Today</h2>
                    <p>
                        Whether you’re a student eager to gain new skills or an instructor with knowledge to share, UpliftEd welcomes you.
                        Together, let’s uplift education.
                    </p>
                    <Link to="/courses">
                        <button className="cta-button">Explore Courses</button>
                    </Link>
                </section>

            </div>
        </>
    );
};

export default AboutUs;
