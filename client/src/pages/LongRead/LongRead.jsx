import React from "react";

import './style.css'

import readIcon from './img/read-icon.svg'
import eye from '@images/eye.svg'
import book from './img/book.svg'
import link from './img/link.svg'
import nurse from '@images/nurse.svg'
import city from '@images/city.svg'
import tape from './img/tape.svg'
import note from './img/note.svg'

import LongReadApi from "@api/LongReadApi";
import {DashboardBlock} from "@components/General";
import {TopFive, Loading} from "@components/General";
import {BarChart} from "@components/Charts";
import BaseWithFilter from "@pages/BaseWithFilter";

class LongRead extends BaseWithFilter {
    constructor(props) {
        super(props);

        this.state = {data: false, error: false, ...this.state}
    }

    getStatistic = (filter) => {
        LongReadApi.getStatistic(filter).then((res) => {
            if (res.success === false)
                return this.setState({error: res.message})

            this.setState({data: res.data})
        })
    }

    onChangeFilter = (filter) => {
        this.getStatistic(filter)
    }

    componentDidMount() {
        this.getStatistic(this.state.filter)
    }

    content = () => {
        const {data, error} = this.state

        if (error)
            return <div>{error}</div>

        if (data === false)
            return <Loading/>

        return (
            <div className="page-long-read-content">
                <div className="page-long-read-content__left">
                    <DashboardBlock title="Статистика лонгрида" icon={readIcon} className="long-read">
                        <div className="long-read-block">
                            <img src={eye} alt=""/>
                            <div className="long-read-block-text">
                                <div>Прочтений</div>
                                <span>лонгрида</span>
                            </div>
                            <div className="long-read-block-value long-read-block-value--gray">
                                {data.readings}
                            </div>
                        </div>
                        <div className="long-read-block">
                            <img src={book} alt=""/>
                            <div className="long-read-block-text">
                                <div>Дочитываний</div>
                                <span>лонгрида</span>
                            </div>
                            <div className="long-read-block-value long-read-block-value--blue">
                                {data.reReadings}
                            </div>
                        </div>
                        <div className="long-read-block">
                            <img src={link} alt=""/>
                            <div className="long-read-block-text">
                                <div>Переходов</div>
                                <span>по ссылке</span>
                            </div>
                            <div className="long-read-block-value long-read-block-value--green">
                                {data.transitions}
                            </div>
                        </div>
                    </DashboardBlock>
                    <DashboardBlock title="Разбивка по специальностям" icon={nurse} className="directions-chart">
                        {data.direction && data.direction.length &&
                        <BarChart data={data.direction.map(({name, count}) => ({label: name, value: (count/data.readings*100).toFixed()}))}/>}
                    </DashboardBlock>
                </div>

                <div className="page-long-read-content__right">
                    {
                        !data || !data.cities ? '' :
                            <TopFive valueType="percent" total={data.readings} title="Города" icon={city}
                                     values={data.cities.map(({name, count}, index) => ({
                                         id: name + count + index,
                                         title: name,
                                         value: count
                                     }))}/>
                    }
                    <DashboardBlock title="Статистика лонгрида" icon={tape} className="long-read__videos-and-tests">
                        {
                            !data.tests ? '' :
                                data.tests.map((value, index) => (
                                    <div key={index} className="long-read-block">
                                        <img src={note} alt=""/>
                                        <div className="long-read-block-text">
                                            <div>Тест №{index + 1}</div>
                                            <span>прошли</span>
                                        </div>
                                        <div className="long-read-block-value long-read-block-value--green">
                                            {value}
                                        </div>
                                    </div>
                                ))
                        }
                        {
                            !data || !data.videos ? '' :
                                data.videos.map((value, index) => (
                                    <div key={index} className="long-read-block">
                                        <img src={tape} alt=""/>
                                        <div className="long-read-block-text">
                                            <div>Видео №{index + 1}</div>
                                            <span>воспроизвели</span>
                                        </div>
                                        <div className="long-read-block-value long-read-block-value--green">
                                            {value}
                                        </div>
                                    </div>
                                ))
                        }
                    </DashboardBlock>
                </div>
            </div>
        )
    }
}

export default LongRead
