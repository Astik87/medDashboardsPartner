import React from "react"

import './style.css'
import notification from './img/notification.svg'

const Notifications = () => {
    return (
        <div className="notifications has-notifications">
            <img src={notification} alt=""/>
        </div>
    )
}
export default Notifications
