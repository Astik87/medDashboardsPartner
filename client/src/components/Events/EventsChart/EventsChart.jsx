import React from "react";

import {DashboardBlock} from "@components/General";
import eventEye from "@images/eye.svg";
import Loading from "@components/General/Loading";
import LineChart from "@components/Charts/LineChart";

const EventsChart = (props) => {

    const {isLoading, datasets} = props

    return (
        <DashboardBlock className="events-visits-chart" title="Кол-во уникальных зрителей (1 день)"
                        icon={eventEye}>
            {
                isLoading
                    ? <Loading/>
                    : <LineChart datasets={datasets}/>
            }
        </DashboardBlock>
    )
}

export default EventsChart
