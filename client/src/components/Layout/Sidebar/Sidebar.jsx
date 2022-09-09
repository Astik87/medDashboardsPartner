import React from "react"
import {Routes, Route} from 'react-router-dom'
import {adminSideBarRoutes, sidebarRoutes} from "@globals/Routes";

import './style.css'

const Sidebar = () => {
    return (
        <div className="sidebar">
            <Routes>
                {
                    adminSideBarRoutes.map(({path, Component}) => {
                        return <Route key={path} path={path} element={Component} />
                    })
                }
                {
                    sidebarRoutes.map(({path, Component}) => <Route exact  key={path} path={path} element={Component}/>)
                }
            </Routes>
        </div>
    )
}

export default Sidebar
