import React from "react"

import './style.css'

import smiley from './img/smiley.svg'
import userIcon from './img/user.svg'
import nurse from '@images/nurse.svg'
import city from '@images/city.svg'
import human from './img/human.svg'

import UserApi from "@api/UserApi";
import EventsApi from "@api/EventsApi";

import BaseWithFilter from "@pages/BaseWithFilter";
import {TopFive, Loading, DashboardBlock} from "@components/General";
import {LineChart} from "@components/Charts";


class Medtouch extends BaseWithFilter {
    constructor(props) {
        super(props);

        this.state = {usersData: false, eventsData: false, error: false, isLoading: true, eventsDataLoading: true,...this.state}
    }

    getStatistics(filter) {
        this.setState({isLoading: true})
        UserApi.getStatistic(filter).then((response) => {
            if(response.success === false)
                return this.setState({error: response.message})

            this.setState({usersData: response.data, isLoading: false})
        })

        this.setState({eventsDataLoading: true})
        EventsApi.getStatistic(filter).then((response) => {
            if(!response.success)
                return this.setState({error: response.message})

            this.setState({eventsData: response.data, eventsDataLoading: false})
        })
    }

    componentDidMount() {
        this.getStatistics(this.state.filter)
    }

    onChangeFilter = (filter) => {
        this.getStatistics(filter)
    }

    content = () => {

        const {error, usersData, isLoading, eventsDataLoading, eventsData} = this.state

        if(error)
            return <div className="error">{error}</div>

        if(usersData === false && isLoading)
            return <Loading/>

        const registeredByDates = [{options: {}, data: usersData.registeredByDates}]
        const uniqueViewers = [{options: {}, data: eventsData.uniqueViewers}]

        return (
            <div className="medtouch-page__content">
                <div className="medtouch-page__left">
                    <DashboardBlock title="Зарегистрировано" icon={smiley} className="registered-total-block">
                        <div className="registered-total">
                            <div className="registered-total__icon">
                                <img src={userIcon} alt=""/>
                            </div>
                            <div className="registered-total__value">
                                <span>
                                    {isLoading ? <Loading/> : usersData.total}
                                </span>
                                <div className="registered-total__value-text">
                                    Пользователей
                                </div>
                            </div>
                        </div>
                    </DashboardBlock>
                    <TopFive
                        isLoading={isLoading}
                        title="Специальности"
                        icon={nurse}
                        values={usersData.directions.map(({name, count}) => ({id: name+count, title: name, value: count}))}
                    />
                    <TopFive
                        isLoading={isLoading}
                        title="Города"
                        icon={city}
                        valueType="percent"
                        total={usersData.total}
                        values={usersData.cities.map(({name, count}) => ({id: name+count, title: name, value: count}))}
                    />
                </div>

                <div className="medtouch-page__right">
                    <DashboardBlock title="Кол-во зарегистрированных пользователей" icon={smiley} className="medtouch-page__registrations-chart">
                        {
                            isLoading ? <Loading/> : <LineChart datasets={registeredByDates}/>
                        }
                    </DashboardBlock>

                    <DashboardBlock title="Кол-во уникальных участников мероприятия в динамике" icon={human} className="medtouch-page__events-chart">
                        {
                            eventsDataLoading ? <Loading/> : <LineChart datasets={uniqueViewers}/>
                        }
                    </DashboardBlock>
                </div>
            </div>
        )
    }
}

export default Medtouch
