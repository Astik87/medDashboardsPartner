import {authHost} from "@api/Main";
import {getDateForFilter} from "@utils/DateUtils";

/**
 * API для статистики LongRead
 */
class LongReadApi {
    /**
     * Получить статистику LongRead
     * @param {{dateFrom: string, dateTo: string, eventId: number, directionId: number}} filter
     * @returns {Promise<{success: boolean, message: string}|{data: {}, success: boolean}>}
     */
    async getStatistic(filter) {
        try {
            filter = getDateForFilter(filter)
            const statistic = await authHost.get('/api/long-read/statistic', {params: filter})

            return {success: true, data: statistic.data}
        } catch (error) {
            return {success: false, message: error.message, status: error.status}
        }
    }

    /**
     *
     * @param {{year: number, month: number, day: number}} filter
     * @param {number} limit
     * @param {number} page
     * @return {Promise<
     *                  {success: boolean, message: string}
     *                  |
     *                  {success: boolean, data: {
     *                      count: number,
     *                      rows: [{
     *                              name: string,
     *                              start: string,
     *                              end: string,
     *                              plan: number,
     *                              fact: number}
     *                          ]}}>}
     */
    async getPlans(filter, limit, page) {
        try {
            filter = getDateForFilter(filter)
            const response = await authHost.get('/api/long-read/plans', {params: {...filter, limit, page}})

            return {success: true, data: response.data}
        } catch (error) {
            return {success: false, message: error.message}
        }
    }

    async getPlansForSelector() {
        try {
            const response = await authHost.get('/api/long-read/plans/for-selector')

            return {success: true, data: response.data}
        } catch (error) {
            return {success: false, message: error.message}
        }
    }

    /**
     * Создать новый план
     * @param {string} name
     * @param {number} start Date TimeStamp
     * @param {number} end Date TimeStamp
     * @param {number} plan
     * @return {Promise<{success: boolean, message: *}|{data: {}, success: boolean}>}
     */
    async createPlans(name, start, end, plan) {
        try {
            const response = await authHost.post('/api/long-read/plans', {name, start, end, plan})

            return {success: true, data: response.data}
        } catch (error) {
            return {success: false, message: error.message}
        }
    }

    /**
     * Удалить план
     * @param {number} id
     * @return {Promise<{success: boolean, message: string}|{data: {}, success: boolean}>}
     */
    async deletePlan(id) {
        try {
            const response = await authHost.delete('/api/long-read/plans', {params: {id}})

            return {success: true, data: response.data}
        } catch (error) {
            return {success: false, message: error.message}
        }
    }
}

export default new LongReadApi()
