import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Footer = () => (
    <footer>
        <div className="section">
            <p>Get connected with us on social networks!</p>
            <div>
                <a href="#"><i className="fab fa-facebook-f"></i></a>
                <a href="#"><i className="fab fa-twitter"></i></a>
                <a href="#"><i className="fab fa-google-plus-g"></i></a>
                <a href="#"><i className="fab fa-linkedin-in"></i></a>
                <a href="#"><i className="fab fa-instagram"></i></a>
            </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', textAlign: 'left' }}>
            <div className="column">
                <h4>Animal House</h4>
            </div>
            <div className="column">
                <h4>PRODUCTS</h4>
                <ul>
                    <li><a href="#">Care of pets</a></li>
                    <li><a href="#">Pets training</a></li>
                </ul>
            </div>
            <div className="column">
                <h4>USEFUL LINKS</h4>
                <ul>
                    <li><a href="#">Services</a></li>
                    <li><a href="/animals">Table with animals</a></li>
                    <li><a href="#">Help</a></li>
                </ul>
            </div>
            <div id="contact" className="column">
                <h4>CONTACT</h4>
                <p className="contact-item"><i className="fa fa-home"></i> Liepāja, LV 3407, LV</p>
                <p className="contact-item"><i className="fa fa-envelope"></i> ternovik.daniil@gmail.com</p>
                <p className="contact-item"><i className="fa fa-phone"></i> + 37127884472</p>
            </div>
        </div>
        <div className="footer-bottom">
            <p>&copy; 2024 Copyright: <a href="#" style={{ color: 'steelblue', textDecoration: 'none' }}>AnimalHouse.lv</a></p>
        </div>
    </footer>
);

export default Footer;