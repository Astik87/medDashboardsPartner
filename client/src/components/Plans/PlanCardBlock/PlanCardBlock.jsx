import React from "react";

import './style.css'

const PlanCardBlock = (props) => {
    const {title, value} = props
    return (
        <div className="plans-list__item-block">
            <span className="plans-list__item-block__title">
                {title}
            </span>
            <span className="plans-list__item-block__value">
                {value}
            </span>
        </div>
    )
}

export default PlanCardBlock
