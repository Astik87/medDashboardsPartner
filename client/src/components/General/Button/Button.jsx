import React from "react";

import './style.css'

const Button = (props) => {
    const {children, className, onClick} = props

    const click = () => {
        if(typeof onClick === 'function')
            onClick()
    }

    return (
        <div className={`btn ${className}`} onClick={click}>
            {children}
        </div>
    )
}

export default Button
