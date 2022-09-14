import {authHost} from "./Main";

class WavesApi {

    /**
     * Получть список волн
     * @param {number} limit
     * @param {number} page
     * @return {Promise<{success: boolean, message: *}|{data: any, success: boolean}>}
     */
    async get(limit, page) {
        try {
            const response = await authHost.get('/api/wave', {params: {limit, page}})

            return {success: true, data: response.data}
        } catch (error) {
            return {success: false, message: error.message}
        }
    }

    /**
     * Создать новую волну
     * @param {string} name
     * @param {number} visitPlanId
     * @param {number} eventPlanId
     * @param {number} longReadPlanId
     * @return {Promise<{success: boolean, message: *}|{data: {}, success: boolean}>}
     */
    async createWave(name, visitPlanId, eventPlanId, longReadPlanId) {
        try {
            const response = await authHost.post('/api/waves', {name, visitPlanId, eventPlanId, longReadPlanId})

            return {success: true, data: response.data}
        } catch (error) {
            return {success: false, message: error.message}
        }
    }

    /**
     * Удалить волну
     * @param {number} id
     * @return {Promise<{success: boolean, message: string}|{data: {}, success: boolean}>}
     */
    async deleteWave(id) {
        try {
            const response = await authHost.delete('/api/waves', {params: {id}})

            return {success: true, data: response.data}
        } catch (error) {
            return {success: false, message: error.message}
        }
    }
}

export default new WavesApi()
