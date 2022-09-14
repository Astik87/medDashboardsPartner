import React from "react";

import './style.css'

import BaseWithFilter from "@pages/BaseWithFilter";
import LongReadApi from "@api/LongReadApi";
import {AddButton, DashboardBlock, Loading} from "@components/General";
import {CreatePlanModal, PlansList} from "@components/Plans";
import {PlansChart} from "@components/Charts";
import {TablePagination} from "@mui/material";
import PlansApi from "@api/PlansApi";

class LongReadPlans extends BaseWithFilter {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            error: false,
            limit: 15,
            page: 1,
            plansCount: 0,
            openedCreatePlanModal: false,
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

    getPlans = async (filter, limit, page) => {
        this.setState({isLoading: true})
        const response = await PlansApi.get(filter, 'longRead', limit, page)
        if(!response.success)
            return this.setState({error: response.message, isLoading: false})

        this.setState({plans: response.data.rows, plansCount: response.data.count, isLoading: false, page, limit})
    }

    changePage = (event, page) => {
        this.getPlans(this.state.filter, this.state.limit, page+1)
    }

    changePageLimit = (event) => {
        this.getPlans(this.state.filter, event.target.value, 1)
    }

    toggleCreatePlanModal = (reload = false) => {
        const {openedCreatePlanModal} = this.state

        if(reload === true)
            setTimeout(() => {
                const {filter, limit} = this.state
                this.getPlans(filter, limit, 1)
            }, 500)

        this.setState({openedCreatePlanModal: !openedCreatePlanModal})
    }

    createPlan = async (name, start, end, plan) => {
        return await LongReadApi.createPlans(name, start, end, plan)
    }

    deletePlan = async (planIndex) => {
        const {plans, filter, limit} = this.state

        await LongReadApi.deletePlan(plans[planIndex].id)
        this.getPlans(filter, limit, 1)
    }

    content() {
        const {plans, isLoading, error, plansCount, page, limit, openedCreatePlanModal} = this.state

        if(error)
            return <div>{error}</div>

        if(isLoading)
            return <Loading />

        return (
            <div className="page__content">
                <PlansList deletePlan={this.deletePlan} plansList={plans} />
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

export default LongReadPlans
