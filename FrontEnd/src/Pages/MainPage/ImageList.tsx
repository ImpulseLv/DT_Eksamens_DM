import React from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

const ImageList = () => {
    const images = [
        "https://www.teamais.net/wp-content/uploads/2020/08/vet-min.jpg",
        "https://viking-dogs.com/wp-content/uploads/2021/03/1-Sobaka-dolzhna-nemedlenno-saditsya-po-prikazu-hozyaina-1024x768.jpg",
    ];

    return (
        <Slide>
            <div className="each-slide-effect">
                <div style={{ 'backgroundImage': `url(${images[0]})` }}>
                    <span>Care of pets</span>
                </div>
            </div>
            <div className="each-slide-effect">
                <div style={{ 'backgroundImage': `url(${images[1]})` }}>
                    <span>Pets training</span>
                </div>
            </div>
        </Slide>
    );
};

export default ImageList;