import React from "react";

import './style.css'
import { PlanCard } from "@components/Plans";
import { Delete } from "@mui/icons-material";
import { IconButton } from "@mui/material";

const WavesList = (props) => {
    const { waves, deleteWave } = props

    return (
        <div className="waves-list">
            {
                waves.map(wave => {
                    return (
                        <div key={wave.id} className="waves-list__item">
                            <div className="waves-list__item-name">
                                <IconButton
                                    onClick={() => deleteWave(wave.id)}
                                    style={{ marginRight: 10 }}
                                    variant="outlined">
                                    <Delete style={{ fontSize: 20 }} color="error" />
                                </IconButton>
                                <span>{wave.name}</span>
                            </div>
                            {
                                wave.visitPlan
                                &&
                                <PlanCard title="Визит" data={wave.visitPlan} />
                            }
                            {
                                wave.eventPlan
                                &&
                                <PlanCard title="Мероприятие" data={wave.eventPlan} />
                            }
                            {
                                wave.longReadPlan
                                &&
                                <PlanCard title="LongRead" data={wave.longReadPlan} />
                            }
                        </div>
                    )
                })
            }
        </div>
    )
}

export default WavesList
