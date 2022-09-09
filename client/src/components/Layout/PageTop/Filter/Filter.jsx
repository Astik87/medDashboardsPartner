import React from "react"
import Select from 'react-select'

import './style.css'
import DateFilter from "./DateFilter";
import {useContext} from "react";
import {Context} from "@/index";
import {observer} from "mobx-react";

const Filter = observer((props) => {
    const {filtersList, filter} = props
    let {change} = props

    if(typeof change !== 'function')
        change = () => {}

    const {directionsList, eventsList} = useContext(Context).filter

    if(!filtersList || !filtersList.length)
        return 'Not elements'

    const setEvent = (option) =>
        change({...filter, eventId: !option ? false : option.value})

    const setDirection = (option) =>
        change({...filter, directionId: !option ? false : option.value})

    const getEventOptions = () => eventsList.map(({id, name}) => {return {value: id, label: name}})

    const getDirectionOptions = () => directionsList.map(({id, name}) => {return {value: id, label: name}})

    return (
        <div className="filter">
            {filtersList.map((filterName) => {
                switch (filterName) {
                    case 'date':
                        return <DateFilter key="date" filter={filter} change={(date) => change({...filter, ...date})} />
                    case 'events':
                        return eventsList &&
                            <Select
                                key="event"
                                placeholder="Мероприятие"
                                onChange={setEvent}
                                options={getEventOptions()}
                                classNamePrefix="filter"
                                className="filter-select"
                                isClearable={true}
                            />
                    case 'directions':
                        return directionsList &&
                            <Select
                                key="directions"
                                placeholder="Специальность"
                                onChange={setDirection}
                                options={getDirectionOptions()}
                                classNamePrefix="filter"
                                className="filter-select"
                                isClearable={true}
                            />
                    default:
                        return `Filter ${filterName} is not-defined`
                }
            })}
        </div>
    )
})

export default Filter
