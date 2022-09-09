import React from "react";

import Button from "@components/General/Button";

import './style.css'

const EventsList = (props) => {
    const {events, deleteEvent} = props

    return (
        <div className="events-list">
            {events.map(({label, value}) => <Button className="events-list__item" onClick={() => deleteEvent(value)} key={value}>{label}</Button>)}
        </div>
    )
}

export default EventsList
