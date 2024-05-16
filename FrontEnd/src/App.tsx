import {createBrowserRouter} from "react-router-dom";
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

export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainPage/>
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
        path: "animals",
        element: <RolesCheck roles={['USER', 'ADMIN', 'MODERATOR']}><MyComponent/></RolesCheck>,
    },
    {
        path: "animals/:id",
        element: <AnimalEditForm/>,
    },
    {
        path:"animals/newAnimal",
        element: <NewAnimals/>
    },
    {
        path:"users/newUsers",
        element: <NewUsers/>
    },
    {
      path:"users",
      element: <UserComponent/>
    }
]);


