import React from "react";
import Navbar from "../MainPage/Navbar";
import AboutPage from "./AboutPage";
import HomePage from "./HomePage";

export function MainPage() {


    return (
        <>
            <Navbar/>
            <HomePage/>
            <AboutPage/>
        </>
    );
}