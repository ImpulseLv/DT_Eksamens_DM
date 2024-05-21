import React from 'react';
import {Container} from "@mui/material";
const AboutPage = () => {
    const sections = [
        {
            title: "About Us",
            text: "We are pleased to welcome you to our unique online project for buying and selling pets! Our site is created for everyone who is looking for a loyal friend and family member on four legs.",
            img: "images/aboutUs.jpg"
        },
        {
            title: "How We Can Help",
            text: "Extensive database for finding the perfect pet: We have collected a large database of pets that previous owners are ready to give to good hands. Here you will find a variety of breeds, ages, and characters of animals to find the perfect companion.",
            img: "images/helpImage.png"
        },
        {
            title: "Detailed Descriptions and Photos",
            text: "We provide detailed descriptions of each animal, as well as photos so you can see what they look like. We believe that everyone deserves love and care, so we do our best to help you find your new friend.",
            img: "image3.jpg"
        },
        {
            title: "Selling Your Pet",
            text: "If you want to sell your pet, you can submit a request to post an ad. Our administrator will review your request and, if there are no errors, will post your ad on the site.",
            img: "image4.jpg"
        },
        {
            title: "Offers and Services",
            text: "On our site, you will also find information about current promotions and services for pet care and training. We strive to provide you with everything you need for a happy and healthy life for your pet.",
            img: "image5.jpg"
        },
        {
            title: "Our Mission",
            text: "We believe that every pet deserves care, love, and a home, and our goal is to connect each person with their perfect pet. We work to make this process simple, convenient, and enjoyable for all our users. Join us today and find your loyal friend!",
            img: "image6.jpg"
        }
    ];

    return (
        <div>
            {sections.map((section, index) => (
                <div key={index} className={`section ${index % 2 === 0 ? 'blue' : 'grey'}`}>
                    <div className="text">
                        <h2>{section.title}</h2>
                        <p>{section.text}</p>
                    </div>
                    <div className="image">
                        <img src={section.img} alt={section.title} />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default AboutPage;