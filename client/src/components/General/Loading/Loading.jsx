import React from "react";

import './style.css'
import preloader from './img/preloader.gif'

const Loading = () => {
    return (
        <div className="loading">
            <img src={preloader} alt=""/>
        </div>
    )
}

export default Loading
