import React from "react";

import BaseWithFilter from "@pages/BaseWithFilter";
import EventsApi from "@api/EventsApi";
import {AddButton, DashboardBlock, Loading} from "@components/General";
import {PlansList, CreatePlanModal} from "@components/Plans";
import {PlansChart} from "@components/Charts";
import {TablePagination} from "@mui/material";
import PlansApi from "@api/PlansApi";

class EventPlans extends BaseWithFilter {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            error: false,
            plans: false,
            openedCreatePlanModal: false,
            limit: 15,
            page: 1,
            plansCount: 0,
            ...this.state
        }
    }

    componentDidMount() {
        const {filter, limit, page} = this.state
        this.getPlans(filter, limit, page)
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return JSON.stringify(this.state) !== JSON.stringify(nextState)
    }

    getFiltersList = () => {
        return ['date']
    }

    /**
     * Обновить планы на странице
     * @return {Promise<void>}
     */
    getPlans = async (filter, limit, page) => {
        this.setState({isLoading: true})
        PlansApi.get(filter, 'event', limit, page).then(response => {
            if(!response.success) {
                this.setState({error: response.message, isLoading: false, limit, page})
                return false
            }

            this.setState({plans: response.data.rows, plansCount: response.data.count, isLoading: false, limit, page})
        })
    }

    /**
     * Показать/скрыть форму создания плана
     */
    toggleCreatePlanModal = (reload) => {
        const {openedCreatePlanModal} = this.state

        if(reload === true)
            setTimeout(() => {
                const {filter, limit, page} = this.state
                this.getPlans(filter, limit, page)
            }, 500)

        this.setState({openedCreatePlanModal: !openedCreatePlanModal})
    }

    /**
     * Создать новый план
     * @param {string} name
     * @param {string} start Date TimeStamp
     * @param {string} end Date TimeStamp
     * @param {string} plan
     * @return {Promise<{success: boolean, message: *}|{data: *, success: boolean}>}
     */
    createPlan = async (name, start, end, plan) => {
        return await EventsApi.createPlan(name, start, end, plan)
    }

    changePage = (event, page) => {
        this.getPlans(this.state.filter, this.state.limit, page+1)
    }

    changePageLimit = (event) => {
        this.getPlans(this.state.filter, event.target.value, 1)
    }

    content() {

        const {plans, isLoading, error, openedCreatePlanModal, limit, page, plansCount} = this.state

        if(error)
            return <div className="error">{error}</div>

        if(isLoading)
            return <Loading />

        return (
            <div className="page__content">
                <PlansList plansList={plans} />
                <CreatePlanModal isOpen={openedCreatePlanModal} onClose={this.toggleCreatePlanModal} onSendForm={this.createPlan}/>
                <DashboardBlock title="Total touch" className="plans-chart">
                    <PlansChart plans={plans} />
                </DashboardBlock>
                <TablePagination labelRowsPerPage='' rowsPerPageOptions={[6, 15, 30, 60, 90]} component="div" count={+plansCount}
                                 page={page - 1}
                                 rowsPerPage={limit} onPageChange={this.changePage}
                                 onRowsPerPageChange={this.changePageLimit}/>
            </div>
        )
    }
}

export default EventPlans
