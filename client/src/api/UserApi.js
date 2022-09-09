import {authHost, host} from './Main'
import {getDateForFilter} from "@utils/DateUtils";

class UserApi {
    async getStatistic(filter) {
        try {
            filter = getDateForFilter(filter)
            const statistic = await host.get('/api/user/statistic', {params: filter})

            return {success: true, data: statistic.data}
        } catch (error) {
            return {success: false, message: error.message, status: error.status}
        }
    }

    async getUsers(limit = 10, page = 1) {
        try {
            const response = await authHost.get('/api/user', {params: {limit, page}})

            return {success: true, data: response.data}
        } catch (error) {
            return {success: false, message: error.message}
        }
    }

    async deleteUsers(userIds) {
        try {
            const response = await authHost.delete('/api/user', {data: {userIds}})

            return {success: true, data: response.data}
        } catch (error) {
            return {success: false, message: error.message}
        }
    }

    async registration(data) {
        try {
            const response = await authHost.post('/api/user/registration', data)

            return {success: true, data: response.data}
        } catch (error) {
            return {success: false, message: error.message}
        }
    }

    async login(login, password) {
        try {
            const response = await host.post('/api/user/login', {login, password}, {withCredentials: true})

            const {data} = response
            localStorage.setItem('accessToken', 'Bearer '+data.accessToken)
            return {success: true, data}
        } catch (error) {
            let {message} = error

            if(error.response.data && error.response.data.message)
                message = error.response.data.message

            return {success: false, message}
        }
    }

    async logout() {
        try {
            await authHost.get('/api/user/logout')
            return {success: true}
        } catch (error) {
            return {success: false, message: error.message}
        }
    }

    async check() {
        try {
            const response = await host.get('/api/user/refresh', {withCredentials: true})

            const {accessToken} = response.data
            localStorage.setItem('accessToken', 'Bearer ' + accessToken)

            return {success: true, data: response.data}
        } catch (error) {
            return {success: false}
        }
    }
}

export default new UserApi()
