import React, {useState, useEffect} from "react"
import {useLocation} from "react-router-dom";
import {Tabs, Tab, useMediaQuery} from "@mui/material"

const SidebarTabs = (props) => {
    const {children, className, routes} = props
    const currentPath = useLocation().pathname

    const [currentTab, setCurrentTab] = useState(0)
    const isMobile = useMediaQuery('(max-width: 768px)')

    useEffect(() => {
        routes.forEach(({path}, index) => {
            if(path === currentPath)
                setCurrentTab(index)
        })
    }, [])

    return (
        <Tabs
            value={currentTab}
            onChange={(event, value) => setCurrentTab(value)}
            orientation={isMobile ? 'horizontal' : 'vertical'}
            centered={isMobile}
            variant="fullWidth"
            selectionFollowsFocus={false}
            className={`sidebar-tabs-wrapper ${className ? className : ''}`}>
            {routes.map(({path, icon}) => {
                const isCurrent = currentPath === path
                return <Tab key={path} icon={icon} className={`sidebar-tab ${isCurrent ? 'current' : ''}`} />
            })}
        </Tabs>
    )
}

export default SidebarTabs
