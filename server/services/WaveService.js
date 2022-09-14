const {Op} = require('sequelize')

const {Wave, Plan} = require('../models')
const ApiError = require('../utils/ApiError')

class WaveService {
    /**
     * Получить все волны
     * @param {number} limit
     * @param {number} page
     */
    async get(limit = 25, page = 1) {
        return await Wave.findAndCountAll({
            limit,
            offset: (page-1)*limit,
            include: [
                {
                    model: Plan,
                    as: 'visitPlan'
                },
                {
                    model: Plan,
                    as: 'eventPlan'
                },
                {
                    model: Plan,
                    as: 'longReadPlan'
                }
            ]
        })
    }

    /**
     * Создать волну
     * @param {string} name
     * @param {number} visitPlanId
     * @param {number} eventPlanId
     * @param {number} longReadPlanId
     */
    async create(name, visitPlanId, eventPlanId, longReadPlanId) {

        if(name.length < 3)
            throw ApiError.BadRequest('Название не может быть меньше 3 симвалов')

        const plans = await Plan.findAll({where: {id: {[Op.in]: [visitPlanId, eventPlanId, longReadPlanId]}}})

        const findPlans = {}

        plans.forEach((plan) => {
            findPlans[plan.id] = plan.toJSON()
        })

        if(!findPlans[visitPlanId] || findPlans[visitPlanId].type !== 'visits')
            throw ApiError.BadRequest(`План визита с id ${visitPlanId} не найден`)

        if(!findPlans[eventPlanId] || findPlans[eventPlanId].type !== 'event')
            throw ApiError.BadRequest(`План мероприятия с id ${eventPlanId} не найден`)

        if(!findPlans[longReadPlanId] || findPlans[longReadPlanId].type !== 'longRead')
            throw ApiError.BadRequest(`План Longread'a с id ${eventPlanId} не найден`)

        return await Wave.create({
            name,
            visitPlanId,
            eventPlanId,
            longReadPlanId
        })
    }

    /**
     * Удалить волны
     * @param {number[]} waveIds
     */
    async delete(waveIds) {
        return await Wave.destroy({
            where: {
                id: {
                    [Op.in]: waveIds
                }
            }
        })
    }
}

module.exports = WaveService
