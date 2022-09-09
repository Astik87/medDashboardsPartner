import React from "react"

import './style.css'

import eventEye from './img/eye.svg'
import eye from '@images/eye.svg'
import nurse from '@images/nurse.svg'
import city from '@images/city.svg'

import {
    Loading,
    DashboardBlock,
    TotalCountBlock,
    TopFive
} from "@components/General"
import {
    EventsSelector,
    ViewsGteMin,
    EventsChart
} from "@components/Events"
import {LineChart} from "@components/Charts"
import EventsApi from "@api/EventsApi";
import BaseWithFilter from "@pages/BaseWithFilter"
import {cutLongString} from "@utils/StringUtils"

class Events extends BaseWithFilter {
    constructor(props) {
        super(props);

        this.state = {
            data: false,
            error: false,
            eventIdsByChart: [],
            eventsVisitsCount: [],
            viewGteMin: 20,
            viewsCountGteMin: false,
            isLoading: true, ...this.state
        }
    }

    componentDidMount() {
        const {filter} = this.state

        this.setStatistic(filter)
    }

    onChangeFilter = (filter) => {
        this.setStatistic(filter)
    }

    /**
     * Получить статистику и записать в состояние
     * @param {{ year: number,
     *           month: number,
     *           day: number,
     *           directionId: number,
     *           eventId: number }} filter
     */
    async setStatistic(filter) {
        this.setState({isLoading: true})
        const eventsStatistic = await EventsApi.getStatistic(filter)
        const visitorsCountViewGteMin = await EventsApi.getViewsGteMin(filter, 20)

        if (!eventsStatistic.success || !visitorsCountViewGteMin.success) {
            const error = !visitorsCountViewGteMin.success ? visitorsCountViewGteMin.message : eventsStatistic.message
            this.setState({error})
            return false
        }

        const {data} = eventsStatistic
        const viewsCountGteMin = visitorsCountViewGteMin.data

        this.setState({data, viewsCountGteMin, isLoading: false})

    }

    /**
     * Добавить мероприятие в график сравнения мероприятий
     * @param {number} eventId
     */
    addNewEventInChart = (eventId) => {
        const {eventsVisitsCount} = this.state

        if (eventsVisitsCount.length >= 10)
            return

        EventsApi.getVisitsCount(eventId).then((response) => {
            if (!response.success)
                return false

            const {name, count, id} = response.data

            const {eventsVisitsCount} = this.state

            eventsVisitsCount.push({id, label: cutLongString(name, 10), value: count})

            this.setState({eventsVisitsCount})
        })
    }

    /**
     * Удалить мероприятие из графика сравнения мероприятий
     */
    deleteEventInChart = (eventId) => {
        let {eventsVisitsCount} = this.state
        eventsVisitsCount = eventsVisitsCount.filter(({id}) => id !== eventId)

        this.setState({eventsVisitsCount})
    }

    /**
     * Удалить все мероприятия из графика сравнения мероприятий
     */
    clearEventsInChart = () => {
        this.setState({eventsVisitsCount: []})
    }

    /**
     * Изменить список мероприятий для графика сравнения
     * @param {[number]} eventIds массив id мероприятий
     */
    updateEventIdsForChart = (eventIds) => {
        let {eventIdsByChart} = this

        let newEvent = false
        eventIds.forEach((eventId) => {
            if (eventIdsByChart.indexOf(eventId) === -1)
                newEvent = eventId
        })

        if (newEvent) {
            this.addNewEventInChart(newEvent)
            eventIdsByChart = eventIds
            return
        }

        if (!eventIds.length)
            return this.clearEventsInChart()

        let deletedEventId = false
        eventIdsByChart.forEach((eventId) => {
            if (eventIds.indexOf(eventId) === -1)
                deletedEventId = eventId
        })

        this.deleteEventInChart(deletedEventId)
    }

    /**
     * @param {{name: string, count: number}} data
     * @return {{id: string, title: string, value: number}}
     */
    getTopFiveArray(data) {
        return data.map(({name, count}) => ({
            id: name + count,
            title: name,
            value: count
        }))
    }

    /**
     * Получить количество пользователей смотревших мероприятие больше значения this.state.viewGteMin
     */
    changeViewGteMin = async (newViewGteMin) => {
        let {filter, viewGteMin} = this.state

        if(viewGteMin === newViewGteMin)
            return false

        const visitorsCountViewGteMin = await EventsApi.getViewsGteMin(filter, newViewGteMin)

        if(!visitorsCountViewGteMin.success)
            return false

        this.setState({viewGteMin, viewsCountGteMin: visitorsCountViewGteMin.data})
    }

    content = () => {

        const {data, error, isLoading, eventsVisitsCount, viewsCountGteMin} = this.state

        if (error)
            return <div className="error">{error}</div>

        if (data === false)
            return <Loading/>

        const viewerDatasets = [{options: {}, data: data.uniqueViewers}]
        const viewsGteMinPercent = data.total ? (viewsCountGteMin/data.total*100).toFixed() : 0

        this.eventIdsByChart = eventsVisitsCount.map(({id}) => id)
        const eventsSelectorValues = eventsVisitsCount.map(({id}) => ({label: id, value: id}))

        return (
            <div className="events-page__content">
                <div className="events-page__top events-page__line">
                    <div className="events-page__left">
                        {/*График зрителей*/}
                        <EventsChart isLoading={isLoading} datasets={viewerDatasets} />
                    </div>
                    <div className="events-page__right">
                        <div className="events-page__right-top">
                            {/*Общее число зрителей*/}
                            <TotalCountBlock
                                className="events-page__right-top-item"
                                title="Зрители"
                                icon={eye}
                                subtitle="Пользователей"
                                count={data.total}
                                isLoading={isLoading} />

                            {/*Глубина просмотра*/}
                            <TotalCountBlock
                                className="events-page__right-top-item"
                                title="Глубина просмотра"
                                subtitle="Минут"
                                icon={eye}
                                isLoading={isLoading}
                                count={data.viewingDepth} />
                        </div>
                        <DashboardBlock className="events-page__views-gte-min">
                            <ViewsGteMin value={viewsGteMinPercent} defaultValue={20} onChange={this.changeViewGteMin} />
                        </DashboardBlock>
                    </div>
                </div>
                <div className="events-page__line">
                    <div className="events-page__left">
                        {/*График сравнения мероприятий*/}
                        <DashboardBlock
                            title="Кол-во уникальных зрителей (за промежуток)"
                            icon={eventEye}
                            className="events-visits-chart"
                            topContent={<EventsSelector values={eventsSelectorValues}
                                                        change={this.updateEventIdsForChart}/>}>
                            <LineChart datasets={[{options: {}, data: eventsVisitsCount}]}/>
                        </DashboardBlock>

                        {/*Направления и Города*/}
                        <div className="events-page__tops">
                            <TopFive title="Специальности" icon={nurse} isLoading={isLoading}
                                     values={this.getTopFiveArray(data.cities)}/>
                            <TopFive title="Города" valueType="percent" total={data.total} icon={city}
                                     isLoading={isLoading} values={this.getTopFiveArray(data.directions)}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Events
