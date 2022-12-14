const {Op} = require('sequelize')

const ApiError = require('../utils/ApiError')
const {Plan} = require('../models')

class PlanService {
    /**
     * Получить планы
     * @param {string} dateFrom
     * @param {string} dateTo
     * @param {string} type
     * @param {number} limit
     * @param {number} page
     * @return {Promise<{count: number, rows: Plan[]}>}
     */
    async getAll(dateFrom, dateTo, type, limit = 25, page = 1) {

        dateFrom = new Date(dateFrom)
        dateTo = new Date(dateTo)

        let where = {}

        if(type)
            where.type = type

        if (dateFrom.getTime() && dateTo.getTime())
            where.dateEnd = {
                [Op.gte]: dateFrom,
                [Op.lte]: dateTo
            }

        return await Plan.findAndCountAll({
            where,
            limit,
            offset: (page - 1) * limit
        })
    }

    async getForSelector() {
        const plans = await Plan.findAll({
            attributes: [['id', 'value'], 'type', ['name', 'label']]
        })

        const result = {
            event: [],
            visits: [],
            longRead: []
        }

        plans.forEach((plan) => {
            plan = plan.toJSON()

            result[plan.type].push(plan)
        })

        return result
    }

    /**
     * Создать план
     * @param data
     * @return {Promise<Plan>}
     */
    async create(data) {
        let {name, dateStart, dateEnd, plan, fact, type} = data

        dateStart = new Date(dateStart)
        dateEnd = new Date(dateEnd)

        if (!name || name.length < 3)
            throw ApiError.BadRequest('Название не может быть меньше 3 симвалов')

        if (!dateStart || !dateStart.getTime())
            throw ApiError.BadRequest('Введите дату начала')

        if (!dateEnd || !dateEnd.getTime())
            throw ApiError.BadRequest('Введите дату окончания')

        if (dateEnd < dateStart)
            throw ApiError.BadRequest('Дата начала не может быть больше даты окончания')

        if (!plan)
            throw ApiError.BadRequest('Введите plan')

        if (!type)
            throw ApiError.BadRequest('Введите тип')

        if (!fact)
            throw ApiError.BadRequest('Введите fact')

        return await Plan.create(data)
    }

    /**
     * Удалить планы
     * @param {[number]} planIds
     * @return {Promise<number>}
     */
    async delete(planIds) {
        if (!planIds.length)
            throw ApiError.BadRequest('planIds is empty')

        return await Plan.destroy({
            where: {
                id: {
                    [Op.in]: planIds
                }
            }
        })
    }
}

module.exports = PlanService
