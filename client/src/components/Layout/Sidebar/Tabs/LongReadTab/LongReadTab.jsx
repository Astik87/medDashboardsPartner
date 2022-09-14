import React from "react"
import {Link} from "react-router-dom";

import SidebarTabs from "@components/Layout/Sidebar/SidearTabs";

const Icon = () => {
    return (
        <Link to="/long-read">
            <div className="sidebar-tab-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21ZM6 5C5.44772 5 5 5.44772 5 6V18C5 18.5523 5.44772 19 6 19H18C18.5523 19 19 18.5523 19 18V6C19 5.44772 18.5523 5 18 5H6ZM17 16C17 16.5523 16.5523 17 16 17C15.4477 17 15 16.5523 15 16V11C15 10.4477 15.4477 10 16 10C16.5523 10 17 10.4477 17 11V16ZM13 16C13 16.5523 12.5523 17 12 17C11.4477 17 11 16.5523 11 16V8C11 7.44772 11.4477 7 12 7C12.5523 7 13 7.44772 13 8V16ZM9 16C9 16.5523 8.55228 17 8 17C7.44772 17 7 16.5523 7 16V13C7 12.4477 7.44772 12 8 12C8.55228 12 9 12.4477 9 13V16Z" fill="#3361FF"/>
                </svg>
            </div>
        </Link>
    )
}

const LongReadTab = () => {
    return (
        <SidebarTabs routes={[{path: '/long-read', icon: <Icon/>}]} />
    )
}

export default LongReadTab
