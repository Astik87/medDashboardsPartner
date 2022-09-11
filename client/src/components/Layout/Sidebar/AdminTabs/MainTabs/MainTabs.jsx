import {Link, useLocation} from "react-router-dom";
import {Tab} from "@mui/material"

import './style.css'

import SidebarTabs from "@components/Layout/Sidebar/Tabs";
import React from "react";

const Home = () => {
    return (
        <Link to="/admin">
            <div className="sidebar-tab-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21ZM6 5C5.44772 5 5 5.44772 5 6V18C5 18.5523 5.44772 19 6 19H18C18.5523 19 19 18.5523 19 18V6C19 5.44772 18.5523 5 18 5H6ZM17 16C17 16.5523 16.5523 17 16 17C15.4477 17 15 16.5523 15 16V11C15 10.4477 15.4477 10 16 10C16.5523 10 17 10.4477 17 11V16ZM13 16C13 16.5523 12.5523 17 12 17C11.4477 17 11 16.5523 11 16V8C11 7.44772 11.4477 7 12 7C12.5523 7 13 7.44772 13 8V16ZM9 16C9 16.5523 8.55228 17 8 17C7.44772 17 7 16.5523 7 16V13C7 12.4477 7.44772 12 8 12C8.55228 12 9 12.4477 9 13V16Z"
                        fill="#3361FF"/>
                </svg>
            </div>
        </Link>
    )
}

const Users = () => {
    return (
        <Link to="/admin/users">
            <div className="sidebar-tab-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 10 12" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd"
                          d="M7.06393 7H2.9357C1.72068 7.07238 0.644233 7.96299 0.155775 9.3C-0.433376 10.688 0.742426 12 2.10989 12H7.88974C9.25803 12 10.4338 10.688 9.84385 9.3C9.3554 7.96299 8.27894 7.07238 7.06393 7Z"
                          fill="#F7F8FA"/>
                    <path fillRule="evenodd" clipRule="evenodd"
                          d="M8 3C8 4.65685 6.65685 6 5 6C3.34315 6 2 4.65685 2 3C2 1.34315 3.34315 0 5 0C5.79565 0 6.55871 0.31607 7.12132 0.87868C7.68393 1.44129 8 2.20435 8 3Z"
                          fill="#F7F8FA"/>
                </svg>
            </div>
        </Link>
    )
}

const Partners = () => {
    return (
        <Link to="/admin/partners">
            <div className="sidebar-tab-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 10 12" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd"
                          d="M7.06393 7H2.9357C1.72068 7.07238 0.644233 7.96299 0.155775 9.3C-0.433376 10.688 0.742426 12 2.10989 12H7.88974C9.25803 12 10.4338 10.688 9.84385 9.3C9.3554 7.96299 8.27894 7.07238 7.06393 7Z"
                          fill="#F7F8FA"/>
                    <path fillRule="evenodd" clipRule="evenodd"
                          d="M8 3C8 4.65685 6.65685 6 5 6C3.34315 6 2 4.65685 2 3C2 1.34315 3.34315 0 5 0C5.79565 0 6.55871 0.31607 7.12132 0.87868C7.68393 1.44129 8 2.20435 8 3Z"
                          fill="#F7F8FA"/>
                </svg>
            </div>
        </Link>
    )
}

const routes = [
    {path: '/admin', icon: <Home/>},
    {path: '/admin/users', icon: <Users/>},
    {path: '/admin/partners', icon: <Partners/>}
]

const MainTabs = () => {
    const currentPath = useLocation().pathname
    return (
        <SidebarTabs className="admin-tabs">
            {
                routes.map(({path, icon}) => {
                    const isCurrent = currentPath === path
                    return <Tab key={path} icon={icon} className={`sidebar-tab ${isCurrent ? 'current' : ''}`}/>
                })
            }
        </SidebarTabs>
    )
}

export default MainTabs
