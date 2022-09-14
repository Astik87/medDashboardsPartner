import React from "react";
import {Delete, ListAlt} from '@mui/icons-material'

import './style.css'

import done from './img/done.svg'
import ongoing from './img/ongoing.svg'
import preparing from './img/preparing.svg'

import {formatDate} from "@utils/DateUtils";
import {PlanCardBlock} from "@components/Plans";
import {IconButton} from "@mui/material";

const groupColorClasses = {
    Done: 'green',
    Ongoing: 'blue',
    Preparing: 'yellow'
}

const statusIcons = {
    Done: <img src={done} alt=""/>,
    Ongoing: <img src={ongoing} alt=""/>,
    Preparing: <img src={preparing} alt=""/>
}

const PlanCard = (props) => {
    const {data, open, deletePlan} = props

    const now = new Date()

    let status = 'Preparing'
    const start = new Date(data.dateStart)
    const end = new Date(data.dateEnd)

    if (end < now)
        status = 'Done'

    if (start < now && end > now)
        status = 'Ongoing'

    const groupBlacksList = [
        {title: 'Plan', value: data.plan},
        {title: 'Fact', value: data.fact}
    ]

    const result = data.plan - data.fact

    if (status !== 'Preparing')
        groupBlacksList.push({title: result < 0 ? 'Result' : 'Target', value: Math.abs(result)})

    return (
        <div className={`plans-list__item ${groupColorClasses[status]}`}>
            {
                (deletePlan || open)
                &&
                <div className="plan-actions">
                    {
                        deletePlan
                        &&
                        <IconButton
                            onClick={deletePlan}
                            variant="outlined">
                            <Delete color="error"/>
                        </IconButton>
                    }
                    {
                        open
                        &&
                        <IconButton
                            onClick={open}
                            variant="outlined">
                            <ListAlt color="primary"/>
                        </IconButton>
                    }
                </div>
            }
            <div className="plans-list__item-left">
                <div className="plans-list__item-name">
                    {data.name}
                </div>
                <div className="plans-list__item-status">
                    {status} {statusIcons[status]}
                </div>
                <div className="plans-list__item-result-percent">
                    {(data.fact / data.plan * 100).toFixed()}%
                </div>

                <div className="plans-list__item-start">
                    {formatDate(start)}
                </div>
            </div>
            <div className="plans-list__item-right">
                {
                    groupBlacksList.map(({title, value}, index) => <PlanCardBlock key={data.id + '.' + index}
                                                                                  title={title} value={value}/>)
                }
                <div className="plans-list__item-end">
                    {formatDate(end)}
                </div>
            </div>
        </div>
    )
}

export default PlanCard
