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
            createModalIsOpen: false,
            createModalLoading: false,
            plansSelectOptions: false,
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

    pageTopCustomBtn = () => {
        return <AddButton onClick={this.openCreateWaveModal}>Создвть план</AddButton>
    }

    /**
     * Открыть модалку создания волны
     */
    openCreateWaveModal = async () => {
        const {plansSelectOptions} = this.state
        this.setState({createModalIsOpen: true})
        if(plansSelectOptions === false) {
            let eventOptions = await EventsApi.getPlansForSelector()
            if(!eventOptions.success)
                return this.setState({error: eventOptions.message})

            let visitOptions = await VisitsApi.getPlansForSelector()
            if(!visitOptions.success)
                return this.setState({error: visitOptions.message})

            let longReadOptions = await LongReadApi.getPlansForSelector()
            if(!longReadOptions.success)
                return this.setState({error: eventOptions.message})

            visitOptions = visitOptions.data
            eventOptions = eventOptions.data
            longReadOptions = longReadOptions.data
            this.setState({createModalLoading: false, plansSelectOptions: {eventOptions, visitOptions, longReadOptions}})
        }
    }

    /**
     * Закрыть модалку создания волны
     */
    closeWaveCreateModal = (reload) => {
        if(reload === true)
            setTimeout(() => {
                const {limit} = this.state
                this.getWaves(limit, 1)
            }, 500)

        this.setState({createModalIsOpen: false})
    }

    /**
     * Обновить сприсок волн
     * @param {number} limit
     * @param {page} page
     * @return {Promise<void>}
     */
    getWaves = async (limit, page) => {
        this.setState({isLoading: true})

        const response = await WavesApi.getAll(limit, page)

        if (!response.success)
            return this.setState({error: response.message, isLoading: false})

        this.setState({waves: response.data.rows, wavesCount: response.data.count, isLoading: false, limit, page})
    }

    /**
     * Создать волну
     * @param {string} name
     * @param {number} visitPlanId
     * @param {number} eventPlanId
     * @param {number} longReadPlanId
     * @return {Promise<{success: boolean, message: string}|{data: {}, success: boolean}>}
     */
    createWave = async (name, visitPlanId, eventPlanId, longReadPlanId) => {
        return await WavesApi.createWave(name, visitPlanId, eventPlanId, longReadPlanId)
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

    /**
     * Удалить волну
     * @param {number} id
     * @return {Promise<void>}
     */
    deleteWave = async (id) => {
        const {limit} = this.state
        await WavesApi.deleteWave(id)
        this.getWaves(limit, 1)
    }

    content() {

        const {isLoading, error, waves, page, limit, wavesCount, createModalIsOpen, createModalLoading, plansSelectOptions} = this.state

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
                <WaveCreateModal sendForm={this.createWave} plansSelectOptions={plansSelectOptions} isLoading={createModalLoading} isOpen={createModalIsOpen} onClose={this.closeWaveCreateModal} />
                <WavesList deleteWave={this.deleteWave} waves={waves}/>
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
