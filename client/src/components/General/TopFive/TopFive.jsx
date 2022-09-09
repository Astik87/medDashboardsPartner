import React from "react"

import './style.css'

import {DashboardBlock, Loading} from "@components/General"

const TopFive = (props) => {
    const {valueType, title, icon, values, total, isLoading} = props

    const render = () => {
        if(isLoading)
            return <Loading/>

        if(!values || !values.length)
            return <div className="top-five__empty"><span>Пусто</span></div>

        return (
            <ul className='top-five'>
                {values.map(({id, title, value}, index) => (
                    <li key={id} className="top-five__item">
                        <span className="top-five__item-index">{index+1}.</span>
                        <span className="top-five__item-title">{title}</span>
                        <span className="top-five__item-value">{valueType === 'percent' ? (value / total * 100).toFixed(2) + '%' : value}</span>
                    </li>
                ))}
            </ul>
        )
    }

    return (
        <DashboardBlock title={title} icon={icon} className="top-five-block">
            {render()}
        </DashboardBlock>
    )
}

export default TopFive
