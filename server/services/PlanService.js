const {Op} = require('sequelize')

const ApiError = require('../utils/ApiError')
const {Plan} = require('../models')

class PlanService {
    /**
     * Получить планы
     * @param {number} limit
     * @param {number} page
     * @return {Promise<{count: number, rows: Plan[]}>}
     */
    async getAll(limit = 25, page = 1) {
        console.log('asdf')
        return await Plan.findAndCountAll({
            limit,
            offset: (page-1)*limit
        })
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

        if(!name || name.length < 3)
            throw ApiError.BadRequest('Название не может быть меньше 3 симвалов')

        if(!dateStart || !dateStart.getTime())
            throw ApiError.BadRequest('Введите дату начала')

        if(!dateEnd || !dateEnd.getTime())
            throw ApiError.BadRequest('Введите дату окончания')

        if(dateEnd < dateStart)
            throw ApiError.BadRequest('Дата начала не может быть больше даты окончания')

        if(!plan)
            throw ApiError.BadRequest('Введите plan')

        if(!type)
            throw ApiError.BadRequest('Введите тип')

        if(!fact)
            throw ApiError.BadRequest('Введите fact')

        return await Plan.create(data)
    }

    /**
     * Удалить планы
     * @param {[number]} planIds
     * @return {Promise<number>}
     */
    async delete(planIds) {
        if(!planIds.length)
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
