import React from "react";
import Navbar from "../MainPage/Navbar";
import AboutPage from "./AboutPage";
import HomePage from "./HomePage";
import ImageList from "./ImageList";
import Footer from "./Footer";

export function MainPage() {


    return (
        <>
            <Navbar/>
            <HomePage/>
            <h2 style={{textAlign: 'center'}}>Additional Services</h2>
            <ImageList/>
            <AboutPage/>
            <Footer/>
        </>
    );
}