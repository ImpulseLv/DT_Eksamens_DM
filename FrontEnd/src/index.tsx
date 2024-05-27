import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {router} from './App';
import reportWebVitals from './reportWebVitals';
import {MyComponent} from "./Pages/Animals/AnimalList";
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import {AuthProvider} from "./Pages/LoginAndRegister/AuthContext";
import '@fortawesome/fontawesome-free/css/all.min.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
      <AuthProvider>
      <LocalizationProvider dateAdapter={AdapterMoment}>
      <RouterProvider router={router} />
      </LocalizationProvider>
      </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
