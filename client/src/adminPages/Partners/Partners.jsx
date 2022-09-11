import React, {useState} from "react";
import {Tabs, Tab} from '@mui/material'

import './style.css'

import PlansPanel from "@adminPages/Partners/PlansPanel";

const Panels = [
    {
        label: 'Plans',
        Component: <PlansPanel />
    }
]

const Partners = () => {

    const [currentTab, setCurrentTab] = useState(0)

    return (
        <div className="page">
            <Tabs value={currentTab} onChange={(event, newTab) => setCurrentTab(newTab)}>
                {
                    Panels.map(({label}, index) => {
                        return <Tab key={index} label={label} />
                    })
                }
            </Tabs>

            {Panels[currentTab].Component}
        </div>
    )
}

export default Partners
