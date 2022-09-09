import React, {useState} from "react"
import {Tabs, useMediaQuery} from "@mui/material"

const SidebarTabs = (props) => {
    const {children, className} = props

    const [value, setValue] = useState(0)

    const isMobile = useMediaQuery('(max-width: 768px)')

    return (
        <Tabs
            value={value}
            onChange={(event, value) => setValue(value)}
            orientation={isMobile ? 'horizontal' : 'vertical'}
            centered={isMobile}
            variant="fullWidth"
            selectionFollowsFocus={false}
            className={`sidebar-tabs-wrapper ${className ? className : ''}`}>
            {children}
        </Tabs>
    )
}

export default SidebarTabs
