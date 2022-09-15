import React from "react";

import './style.css'

import BaseWithFilter from "@pages/BaseWithFilter";
import WavesApi from "@api/WavesApi";
import {AddButton, DashboardBlock, Loading} from "@components/General";
import {LineChart} from "@components/Charts";
import {TablePagination} from "@mui/material";
import {WavesList, WaveCreateModal} from "@components/Waves";
import EventsApi from "@api/EventsApi";
import VisitsApi from "@api/VisitsApi";
import LongReadApi from "@api/LongReadApi";

class Waves extends BaseWithFilter {
    constructor(props) {
        super(props);

        this.state = {
            waves: false,
            isLoading: true,
            error: false,
            page: 1,
            limit: 3,
            wavesCount: 0,
            ...this.state
        }
    }

    componentDidMount() {
        const {limit, page} = this.state
        this.getWaves(limit, page)
    }

    getFiltersList = () => {
        return false
    }

    /**
     * Обновить сприсок волн
     * @param {number} limit
     * @param {page} page
     * @return {Promise<void>}
     */
    getWaves = async (limit, page) => {
        this.setState({isLoading: true})

        const response = await WavesApi.get(limit, page)

        if (!response.success)
            return this.setState({error: response.message, isLoading: false})

        this.setState({waves: response.data.rows, wavesCount: response.data.count, isLoading: false, limit, page})
    }

    /**
     * Перейти на страницу page
     * @param {event} event
     * @param {number} page
     */
    changePage = (event, page) => {
        this.getWaves(this.state.limit, page + 1)
    }

    /**
     * Изменить кол-ва элементов на странице
     * @param {event} event
     */
    changePageLimit = (event) => {
        this.getWaves(event.target.value, 1)
    }

    content() {

        const {isLoading, error, waves, page, limit, wavesCount} = this.state

        if (isLoading)
            return <Loading/>

        if (error)
            return <div>{error}</div>

        const visitsPlansChartDatasets = {options: {label: 'Visit plans',}, data: []}
        const eventsPlansChartDatasets = {options: {label: 'Event plans'}, data: []}
        const longReadPlansChartDatasets = {options: {label: 'LongRead plans'}, data: []}

        const visitFactChartDatasets = {options: {label: 'LongRead fact', borderColor: '#34C759'}, data: []}
        const eventFactChartDatasets = {options: {label: 'LongRead fact', borderColor: '#34C759'}, data: []}
        const longReadFactChartDatasets = {options: {label: 'LongRead fact', borderColor: '#34C759'}, data: []}

        waves.forEach((wave) => {
            if (wave.visitPlan)
                visitsPlansChartDatasets.data.push({label: wave.name, value: wave.visitPlan.plan})
            if (wave.eventPlan)
                eventsPlansChartDatasets.data.push({label: wave.name, value: wave.eventPlan.plan})
            if (wave.longReadPlan)
                longReadPlansChartDatasets.data.push({label: wave.name, value: wave.longReadPlan.plan})

            if (wave.visitPlan)
                visitFactChartDatasets.data.push({label: wave.name, value: wave.visitPlan.fact})
            if (wave.eventPlan)
                eventFactChartDatasets.data.push({label: wave.name, value: wave.eventPlan.fact})
            if (wave.longReadPlan)
                longReadFactChartDatasets.data.push({label: wave.name, value: wave.longReadPlan.fact})
        })

        return (
            <div className="page__content">
                <WavesList waves={waves}/>
                <DashboardBlock className="wave-charts" title="Wave Visits">
                    <LineChart datasets={[visitsPlansChartDatasets, visitFactChartDatasets]}/>
                </DashboardBlock>
                <DashboardBlock className="wave-charts" title="Wave Events">
                    <LineChart datasets={[eventsPlansChartDatasets, eventFactChartDatasets]}/>
                </DashboardBlock>
                <DashboardBlock className="wave-charts" title="Wave LongRead">
                    <LineChart datasets={[longReadPlansChartDatasets, longReadFactChartDatasets]}/>
                </DashboardBlock>
                <TablePagination labelRowsPerPage='' rowsPerPageOptions={[3, 6, 15, 30]} component="div"
                                 count={+wavesCount}
                                 page={page - 1}
                                 rowsPerPage={limit} onPageChange={this.changePage}
                                 onRowsPerPageChange={this.changePageLimit}/>
            </div>
        )
    }
}

export default Waves
