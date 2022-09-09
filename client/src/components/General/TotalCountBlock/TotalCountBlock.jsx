import React from "react";

import './style.css'

import Loading from "@components/General/Loading";
import {DashboardBlock} from "@components/General";

const TotalCountBlock = (props) => {

    const {isLoading, count, title, subtitle, icon, className} = props

    return (
        <DashboardBlock className={`total-count-block ${className ? className : ''}`} title={title} icon={icon}>
            <div className="events-page-value">
                {isLoading ? <Loading/> : count}
            </div>
            <div className="events-page-subtitle">
                {subtitle}
            </div>
        </DashboardBlock>
    )
}

export default TotalCountBlock
