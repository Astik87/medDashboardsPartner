import React from "react"
import {TablePagination} from "@mui/material"

import './style.css'

import VisitsApi from "@api/VisitsApi"
import BaseWithFilter from "@pages/BaseWithFilter"

import {
    Loading,
    AddButton,
    DashboardBlock
} from "@components/General"
import {CreatePlanModal, PlanDetailModal} from "@components/Plans"
import {PlansChart} from "@components/Charts"

import {withRouter} from "@utils/RouteUtils"
import PlansList from "@components/Plans/PlansList";

class VisitPlan extends BaseWithFilter {

    constructor(props) {
        super(props);

        const {routeParams} = this.props

        this.state = {
            page: routeParams.page ? routeParams.page : 1,
            limit: 15,
            plans: false,
            plansCount: false,
            currentPlan: false,
            isLoading: true,
            error: false,
            openedCreatePlanModal: false,
            ...this.state
        }
    }

    /**
     * Фильтры для данной страницы
     * @return {[string]}
     */
    getFiltersList = () => {
        return ['date']
    }

    /**
     * Кастомная кнопка рядом с кнопкой экспорта страницы
     */
    pageTopCustomBtn = () => {
        return (
            <AddButton className="add-plan-btn" onClick={this.toggleCreatePlanModal}><span>Создать план</span></AddButton>
        )
    }

    /**
     * Получение списка планов при монтировании компонента
     */
    componentDidMount() {
        const {filter, page, limit} = this.state

        this.getPlans(filter, page, limit)
    }

    /**
     * При изменении фильтра получаем новый список планов и меняем url текущей страницы
     * @param {{}} filter
     */
    onChangeFilter = (filter) => {
        const {limit} = this.state
        window.history.pushState({}, undefined, this.props.baseUri)

        this.getPlans(filter, 1, limit)
    }

    /**
     * Получить пданы из api
     * @param {{year: number, month: number, day: number}} filter
     * @param {number|boolean} page номер страницы
     * @param {number} limit максимальное кол-ва элементов на странице
     * @return {boolean}
     */
    getPlans = (filter, page, limit) => {
        if (!filter || !page || !limit)
            return false

        this.setState({isLoading: true})
        VisitsApi.getPlans(filter, page, limit).then(response => {
            if (!response.success)
                this.setState({error: response.message})
            else
                this.setState({
                    plans: response.plans.rows,
                    plansCount: response.plans.count,
                    isLoading: false,
                    page: page
                })
        })
    }

    /**
     * Открвть дктатьную информацию прлана
     * @param {number} planIndex индекс плана в массиве this.state.plans
     */
    setCurrentPlan = (planIndex) => {
        this.setState({currentPlan: planIndex})
    }

    /**
     * Компонент модалки с детальной информацией о плане
     * @param {number} planIndex индекс плана в массиве this.state.plans
     * @return {boolean|*}
     */
    getPlanDetailElement(planIndex) {
        const {plans} = this.state
        const plan = planIndex ? plans[planIndex] : false

        return (<PlanDetailModal plan={plan} close={this.closePlan}/>)
    }

    /**
     * Закрыть модалку с детальной информацией плана
     */
    closePlan = () => {
        this.setState({currentPlan: false})
    }

    /**
     * Показать/скрыть модалку создания нового плана
     * @param {boolean} reload нужно ли заново получить все планы и перезагрузить компонент
     */
    toggleCreatePlanModal = (reload) => {
        const {openedCreatePlanModal} = this.state

        if (reload === true) {
            setTimeout(() => {
                const {filter, limit} = this.state
                this.getPlans(filter, 1, limit)
            }, 500)
        }

        this.setState({openedCreatePlanModal: !openedCreatePlanModal})
    }

    changePage = (event, page) => {
        const {filter, limit} = this.state
        this.getPlans(filter, page + 1, limit)
    }

    changePageLimit = (event) => {
        this.setState({limit: +event.target.value})
        const {filter} = this.state
        this.getPlans(filter, 1, +event.target.value)
    }

    /**
     * Созать план
     * @param {string} name
     * @param {Date} start
     * @param {Date} end
     * @param {number} plan
     * @return {Promise<{success: boolean, message: string}>}
     */
    createPlan = async (name, start, end, plan) => {
        return await VisitsApi.createPlan(name, start, end, plan)
    }

    /**
     * Удалить план
     * @param {number} planIndex
     * @return {Promise<{success: boolean, message: string}|{data: *, success: boolean}>}
     */
    deletePlan = async (planIndex) => {
        const {plans} = this.state
        await VisitsApi.deletePlan(plans[planIndex].id)
        const {filter, limit} = this.state
        this.getPlans(filter, 1, limit)
    }

    content = () => {
        const {isLoading, error, plans, page, plansCount, limit, currentPlan, openedCreatePlanModal} = this.state

        if (error)
            return <div>{error}</div>

        if (isLoading)
            return <Loading/>

        const currentPlanItem = currentPlan !== false ? plans[currentPlan] : false
        return (
            <div className="plans-page page__content">
                <CreatePlanModal onSendForm={this.createPlan} isOpen={openedCreatePlanModal} onClose={this.toggleCreatePlanModal}/>
                <PlanDetailModal plan={currentPlanItem} close={this.closePlan}/>
                <PlansList deletePlan={this.deletePlan} plansList={plans} setCurrentPlan={this.setCurrentPlan} />
                <DashboardBlock title="Total touch" className="plans-chart">
                    <PlansChart plans={plans}/>
                </DashboardBlock>
                <TablePagination labelRowsPerPage='' rowsPerPageOptions={[6, 15, 30, 60, 90]} component="div" count={+plansCount}
                                 page={page - 1}
                                 rowsPerPage={limit} onPageChange={this.changePage}
                                 onRowsPerPageChange={this.changePageLimit}/>
            </div>
        )
    }
}

export default withRouter(VisitPlan)
