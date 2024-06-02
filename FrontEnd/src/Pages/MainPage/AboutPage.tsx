import React from 'react';
import aboutUs from '../../images/aboutUs.jpg'
import helpImage from '../../images/helpImage.png'
import  dogIcon2 from '../../images/dogIcon2.png'
import moneyIcon from '../../images/moneyIcon.png'
import offersIcons from '../../images/offersIcons.png'
import missionIcon from '../../images/missionIcon.png'
const AboutPage = () => {
    const sections = [
        {
            title: "About Us",
            text: "We are pleased to welcome you to our unique online project for buying and selling pets! Our site is created for everyone who is looking for a loyal friend and family member on four legs.",
            img: aboutUs
        },
        {
            title: "How We Can Help",
            text: "Extensive database for finding the perfect pet: We have collected a large database of pets that previous owners are ready to give to good hands. Here you will find a variety of breeds, ages, and characters of animals to find the perfect companion.",
            img: helpImage
        },
        {
            title: "Detailed Descriptions and Photos",
            text: "We provide detailed descriptions of each animal, as well as photos so you can see what they look like. We believe that everyone deserves love and care, so we do our best to help you find your new friend.",
            img: dogIcon2
        },
        {
            title: "Selling Your Pet",
            text: "If you want to sell your pet, you can submit a request to post an ad. Our administrator will review your request and, if there are no errors, will post your ad on the site.",
            img: moneyIcon
        },
        {
            title: "Offers and Services",
            text: "On our site, you will also find information about current promotions and services for pet care and training. We strive to provide you with everything you need for a happy and healthy life for your pet.",
            img: offersIcons
        },
        {
            title: "Our Mission",
            text: "We believe that every pet deserves care, love, and a home, and our goal is to connect each person with their perfect pet. We work to make this process simple, convenient, and enjoyable for all our users. Join us today and find your loyal friend!",
            img: missionIcon
        }
    ];

    return (
        <div>
            {sections.map((section, index) => (
                <div key={index} id={'about'} style={{ height: '200px', overflow: 'hidden'}} className={`section ${index % 2 === 0 ? 'blue' : 'grey'}` }>
                    <div className="text">
                        <h2>{section.title}</h2>
                        <p>{section.text}</p>
                    </div>
                    <div className="image" style={{ width: '100%', height: '100%' }}>
                        <img src={section.img} alt={section.title} style={{ width: '200px', height: '200px', objectFit: 'cover', marginLeft: 250 }}/>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default AboutPage;