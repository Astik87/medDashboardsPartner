import React, {useContext} from "react";
import {Routes, Route} from 'react-router-dom'

import {adminRoutes, authRoutes, publicRoutes} from "@globals/Routes";
import {Context} from "@/index";
import Auth from "@pages/Auth";
import {observer} from "mobx-react";
import Forbidden from "@pages/Forbidden";

const AppRouter = observer(() => {

    const {userState} = useContext(Context)
    const {isAuth} = userState
    const isAdmin = isAuth && userState.user.isAdmin

    return (
        <Routes>
            {adminRoutes.map(({path, Component}) => {
                return <Route key={path} path={path} element={isAdmin ? Component : <Forbidden />} />
            })}
            {publicRoutes.map(({path, Component}) => {
                return <Route key={path} path={path} element={Component}/>
            })}
            {authRoutes.map(({path, Component}) => {
                return <Route key={path} path={path} element={isAuth ? Component : <Auth />}/>
            })}
        </Routes>
    )
})

export default AppRouter
