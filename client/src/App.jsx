import React, {useContext, useEffect, useState} from "react"
import {BrowserRouter} from "react-router-dom";

import AppRouter from "@components/AppRouter";
import Header from "@components/Layout/Header";
import Sidebar from "@components/Layout/Sidebar";

import userState from "@/state/UserState";
import FilterState from "@/state/FilterState";

import './App.css';
import './fonts/stylesheet.css'
import {Context} from "@/index";
import UserApi from "@api/UserApi";
import {Loading} from "@components/General";

function App() {

    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        UserApi.check().then(response => {
            const {data, success} = response
            if (!success) {
                userState.setUser(false)
                return
            }

            userState.setUser(data)
        }).finally(() => {
            setLoading(false)
        })
    }, [])

    if (loading)
        return <Loading/>

    return (
        <React.StrictMode>
            <BrowserRouter>
                <div className="app">
                    <Context.Provider value={{
                        userState: userState,
                        filter: new FilterState()
                    }}>
                        <Header/>
                        <div className="content-wrapper">
                            <Sidebar/>
                            <div className="content">
                                <div className="export-page-container">
                                    <AppRouter/>
                                </div>
                            </div>
                        </div>
                    </Context.Provider>
                </div>
            </BrowserRouter>
        </React.StrictMode>
    );
}

export default App;
