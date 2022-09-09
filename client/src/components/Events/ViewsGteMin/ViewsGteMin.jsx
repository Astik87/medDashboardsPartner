import React, {useState} from "react";

import eye from '@images/eye.svg'

import './style.css'
import Button from "@components/General/Button";

const ViewsGteMin = (props) => {
    let {value, onChange, defaultValue} = props

    if(!value)
        value = 0

    const [minutes, setMinutes] = useState(defaultValue ? defaultValue : 20)

    const change = () => {
        if(typeof onChange === 'function')
            onChange(minutes)
    }

    const inputWidth =  minutes.toString().length*18

    return (
        <div className="views-gte-min">
            <div className="views-gte-min__top">
                <div className="views-gte-min__icon">
                    <img src={eye} alt="eye"/>
                </div>
                <div className="views-gte-min__title">
                    % смотревших > <input style={{width: inputWidth}} type="number" onChange={({target}) => setMinutes(target.value ? target.value : 1)} value={minutes}/> минут
                    <span>Зрителей</span>
                </div>

                <div className="views-gte-min__value">
                    {value}%
                </div>
            </div>
            <div className="views-gte-min__progress">
                <span style={{width: value+'%'}}> </span>
            </div>
            <Button className="views-gte-min__btn" onClick={change}>Поиск</Button>
        </div>
    )
}

export default ViewsGteMin
