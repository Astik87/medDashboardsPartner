const axios = require('axios').default

class FaceCastApi {
    static apiKey = process.env.FACECAST_API_KEY
    static apiUrl = process.env.FACECAST_API_URL
    static apiUid = process.env.FACECAST_UID

    constructor() {
        this.host = axios.create({
            baseURL: FaceCastApi.apiUrl
        })

        this.host.interceptors.request.use(config => {
            config.params.uid = FaceCastApi.apiUid
            config.params.api_key = FaceCastApi.apiKey

            return config
        })
    }

    async getVisitHistogramAbsoluteTimeAll(eventId) {
        try {
            const response = await this.host.get('/get_visit_histogram_absolute_time_all', {params: {event_id: eventId}})
            return {success: true, data: response.data}
        } catch (error) {
            return {success: false, status: error.status, message: error.message}
        }
    }
}

module.exports = FaceCastApi
