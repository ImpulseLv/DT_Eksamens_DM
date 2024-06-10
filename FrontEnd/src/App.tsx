import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {MyComponent} from "./Pages/Animals/AnimalList";
import React from "react";
import {AnimalEditForm} from "./Pages/Animals/AnimalEditForm";
import {NewAnimals} from "./Pages/Animals/NewAnimals";
import Registration from "./Pages/LoginAndRegister/Registration";
import Login from "./Pages/LoginAndRegister/Login";
import {MainPage} from "./Pages/MainPage/MainPage";
import {UserComponent} from "./Pages/Users/UserList";
import {NewUsers} from "./Pages/Users/NewUsers";
import {RolesCheck} from "./Pages/Users/Components/RolesCheck";
import {UserEditForm} from "./Pages/Users/UserEditForm";
import AboutPage from "./Pages/MainPage/AboutPage";
import Footer from "./Pages/MainPage/Footer";
import AnimalCard from "./Pages/Animals/AnimalCard";
import Profile from "./Pages/Users/Profile";

export const router = createBrowserRouter([

    {
        path: "/",
        element: <MainPage/>
    },
    {
      path: "/profile",
      element: <Profile/>
    },
    {
      path: "/",
      element: <AboutPage/>
    },
    {
      path: "registration",
      element: <Registration/>
    },
    {
        path: "login",
        element: <Login/>,
    },
    {
      path: "animalCard",
      element: <AnimalCard/>
    },
    {
        path: "animals",
        element: <RolesCheck roles={['ADMIN', 'MODERATOR']}><MyComponent/></RolesCheck>,
    },
    {
        path: "animals/:id",
        element: <RolesCheck roles={['ADMIN', 'MODERATOR']}><AnimalEditForm/></RolesCheck>,
    },
    {
        path:"animals/newAnimal",
        element: <RolesCheck roles={['ADMIN', 'MODERATOR']}><NewAnimals/></RolesCheck>
    },
    {
        path:"users/newUsers",
        element: <RolesCheck roles={['ADMIN']}><NewUsers/></RolesCheck>
    },
    {
      path:"users",
      element: <RolesCheck roles={['ADMIN']}><UserComponent/></RolesCheck>
    },
    {
      path:"users/:id",
      element:<UserEditForm/>
    },
]);


