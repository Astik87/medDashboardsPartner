import {authHost} from './Main'
import {getDateForFilter} from "@utils/DateUtils";

class VisitsApi {

    /**
     * Получить список планов
     * @param {{}} filter
     * @param {number} page
     * @param {number} limit
     * @return {Promise<{success: boolean, plans: any}|{success: boolean, message: *}>}
     */
    async getPlans(filter, page, limit) {
        try {
            filter = getDateForFilter(filter)
            const response = await authHost.get('/api/visits/plans', {params: {...filter, limit, page}})

            return {success: true, plans: response.data}
        } catch (error) {
            return {success: false, message: error.message}
        }
    }

    /**
     * Массив планов мероприятий для react-select
     * @return {Promise<{success: boolean, message: *}|{data: [{label: string, value: number}], success: boolean}>}
     */
    async getPlansForSelector() {
        try {
            const response = await authHost.get('/api/visits/plans/for-selector')

            return {success: true, data: response.data}
        } catch (error) {
            return {success: false, message: error.message}
        }
    }

    /**
     * Создать план
     * @param {string} name
     * @param {Date} start
     * @param {Date} end
     * @param {number} plan
     * @return {Promise<{success: boolean, message: string}>}
     */
    async createPlan(name, start, end, plan) {
        try {
            const response = await authHost.post('/api/visits/plans', {name, start, end, plan})

            return {success: response.data}
        } catch (error) {
            return {success: false, message: error.message}
        }
    }

    /**
     * Удалить план
     * @param {number} id
     * @return {Promise<{success: boolean, message: string}|{data: any, success: boolean}>}
     */
    async deletePlan(id) {
        try {
            const response = await authHost.delete('/api/visits/plans', {params: {id}})

            return {success: true, data: response.data}
        } catch (error) {
            return {success: false, message: error.message}
        }
    }
}

export default new VisitsApi()
