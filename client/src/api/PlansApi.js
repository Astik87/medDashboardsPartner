import {authHost} from "@api/Main";

class PlansApi {
    async getAll(limit = 25, page = 1) {
        try {
            const response = await authHost.get('/api/plan', {params: {limit, page}})

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
