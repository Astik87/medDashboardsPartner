import {authHost} from "./Main";

/**
 * API для мед. направлений
 */
class DirectionsApi {
    /**
     * Получить все мед. направления
     * @returns {Promise<[{id: number, code: string, name: string}]>}
     */
    async getAll() {
        try {
            const directionsList = await authHost.get('/api/directions')

            return directionsList.data
        } catch (error) {
            return false
        }
    }
}

export default new DirectionsApi()
