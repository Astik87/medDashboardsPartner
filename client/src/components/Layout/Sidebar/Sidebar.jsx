import React, {useContext} from "react"
import {Routes, Route} from 'react-router-dom'
import {observer} from "mobx-react"

import {adminSideBarRoutes, sidebarRoutes} from "@globals/Routes"

import './style.css'
import {Context} from "@/index"
import NotFound from "@pages/NotFound";
import NotFoundTab from "@components/Layout/Sidebar/Tabs/NotFoundTab";

const Sidebar = observer(() => {

    const {userState} = useContext(Context)

    return (
        <div className="sidebar">
            <Routes>
                {
                    adminSideBarRoutes.map(({path, Component}) => {
                        return <Route key={path} path={path} element={userState.user.isAdmin ? Component : <NotFoundTab />} />
                    })
                }
                {
                    sidebarRoutes.map(({path, Component}) => <Route exact  key={path} path={path} element={Component}/>)
                }
            </Routes>
        </div>
    )
})

export default Sidebar
