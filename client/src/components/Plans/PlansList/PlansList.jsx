import React from "react";

import './style.css'

import {PlanCard} from "@components/Plans";
import {Empty} from "@components/General";

const PlansList = (props) => {

    const {plansList, setCurrentPlan} = props

    const getOpenHandler = (index) => {
        if(typeof setCurrentPlan === 'function')
            return () => setCurrentPlan(index)

        return false
    }

    return (
        <div className="plans-list">
            {
                plansList.length
                    ?
                    plansList.map((plan, index) => <PlanCard key={plan.id} data={plan} open={getOpenHandler(index)}/>)
                    :
                    <Empty/>
            }
        </div>
    )
}

export default PlansList
