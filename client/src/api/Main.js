import axios from "axios";
import userState from "@/state/UserState";

const host = axios.create({
    withCredentials: true,
    baseURL: process.env.REACT_APP_DOMAIN_NAME
})

const authHost = axios.create({
    withCredentials: true,
    baseURL: process.env.REACT_APP_DOMAIN_NAME
})

const authResponseInterceptors = async error => {
    const originalRequest = error.config
    if(!error.config || error.config._isRetry)
        throw error

    if(error.response.data && error.response.data.message) {
        error.message = error.response.data.message
    }

    if(error.response.status !== 401)
        throw error

    try {
        originalRequest._isRetry = true
        if(error.response.status === 401) {
            const response = await axios.get(process.env.REACT_APP_DOMAIN_NAME+'/api/user/refresh', {withCredentials: true})
            localStorage.setItem('accessToken', 'Bearer ' + response.data.accessToken)
            userState.setIsAuth(true)
            userState.setUser(response.data)
            return await host.request(originalRequest)
        }
    } catch (error) {
        userState.setUser(false)
        userState.setIsAuth(false)
    }
}

const authRequestInterceptor = async config => {
    config.headers.authorization = localStorage.getItem('accessToken')
    config.withCredentials = true
    return config
}

authHost.interceptors.request.use(authRequestInterceptor)

authHost.interceptors.response.use(config => {
    return config
}, authResponseInterceptors)

export {
    host,
    authHost
}
