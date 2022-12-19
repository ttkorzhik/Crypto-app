import React from 'react';

import {BrowserRouter, Route, Routes} from "react-router-dom";

import Header from "../Header/Header";
import HomePage from "../../pages/HomePage/HomePage";
import CoinPage from "../../pages/CoinPage/CoinPage";
import Notification from "../Notification/Notification";

import {makeStyles} from "@material-ui/core";
import './App.css';

const useStyles = makeStyles(() => ({
    App: {
        backgroundColor: "#14161a",
        color: "white",
        minHeight: "100vh",
    },
}));

function App() {
    const classes = useStyles()

  return (
    <BrowserRouter>
        <div className={classes.App}>
            <Header/>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/coins/:id" element={<CoinPage/>}/>
            </Routes>
            <Notification/>
        </div>
    </BrowserRouter>
  );
}

export default App;
