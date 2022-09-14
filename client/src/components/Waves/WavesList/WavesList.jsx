import React from "react";

import './style.css'
import {PlanCard} from "@components/Plans";
import {Delete} from "@mui/icons-material";
import {IconButton} from "@mui/material";

const WavesList = (props) => {
    const {waves} = props

    return (
        <div className="waves-list">
            {
                waves.map(wave => {
                    return (
                        <div key={wave.id} className="waves-list__item">
                            <div className="waves-list__item-name">
                                <span>{wave.name}</span>
                            </div>
                            {
                                wave.visitPlan
                                &&
                                <PlanCard data={wave.visitPlan}/>
                            }
                            {
                                wave.eventPlan
                                &&
                                <PlanCard data={wave.eventPlan}/>
                            }
                            {
                                wave.longReadPlan
                                &&
                                <PlanCard data={wave.longReadPlan}/>
                            }
                        </div>
                    )
                })
            }
        </div>
    )
}

export default WavesList
