import {authHost} from "@api/Main";
import {getDateForFilter} from "@utils/DateUtils";

class PlansApi {
    async getAll(type = '', limit = 25, page = 1) {
        try {
            const response = await authHost.get('/api/plan', {params: {limit, page, type}})

            return {success: true, data: response.data}
        } catch (error) {
            return {success: false, message: error.message}
        }
    }

    async get(filter, type = 'event', limit= 15, page= 1) {
        try {
            filter = getDateForFilter(filter)
            const response = await authHost.get('/api/plan', {params: {...filter, limit, page, type}})

            return {success: true, data: response.data}
        } catch (error) {
            return {success: false, message: error.message}
        }
    }

    async create(data) {
        try {
            const response = await authHost.post('/api/plan', data)

            return {success: true, data: response.data}
        } catch (error) {
            return {success: false, message: error.message}
        }
    }

    async delete(planIds) {
        try {
            const response = await authHost.delete('/api/plan', {data: {planIds}})

            return {success: false, data: response.data}
        } catch (error) {
            return {success: false, message: error.message}
        }
    }
}

export default new PlansApi()
