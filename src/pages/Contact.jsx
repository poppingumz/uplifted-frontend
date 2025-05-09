import React from 'react';
import Navbar from '../components/Navbar';
import { FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Contact = () => {
    return (
        <>
            <Navbar />
            <div className="contact-page">
            <div className="contact-top">
                <div className="contact-info">
                    <h1>Contact</h1>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex nulla quod, a ullam, eius suscipit illum porro corrupti nemo corporis eveniet voluptatem vel impedit.
                    </p>
                </div>
                <div className="contact-details">
                    <div className="contact-card">
                        <FaPhone className="icon" />
                        <div>
                            <h3>Give us a call</h3>
                            <p>+1 234 567 890</p>
                        </div>
                    </div>
                    <div className="contact-card">
                        <FaMapMarkerAlt className="icon" />
                        <div>
                            <h3>Our location</h3>
                            <p>New York City Hall, USA</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="contact-bottom">
                <div className="contact-form">
                    <form>
                        <label>Your Name (required)</label>
                        <input type="text" name="name" required />

                        <label>Your Email (required)</label>
                        <input type="email" name="email" required />

                        <label>Subject</label>
                        <input type="text" name="subject" />

                        <label>Your Message</label>
                        <textarea name="message" rows="5"></textarea>

                        <button type="submit">Send</button>
                    </form>
                </div>

                <div className="contact-map">
                    <iframe
                        title="map"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3021.8341472100797!2d-74.00601568459332!3d40.71277597933092!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a31651e85a3%3A0x3c3b7b7f3fcf593e!2sNew%20York%20City%20Hall!5e0!3m2!1sen!2sus!4v1616246371156!5m2!1sen!2sus"
                        width="100%"
                        height="117%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                    ></iframe>
                </div>
            </div>
        </div>
        </>
    );
};

export default Contact;
