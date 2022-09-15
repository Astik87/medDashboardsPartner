const PlanService = require('../services/PlanService')

class PlanController {
    async get(req, res, next) {
        try {
            let {dateFrom, dateTo, type, limit, page} = req.query

            if(!limit)
                limit = 25

            if(!page)
                page = 1

            const planService = new PlanService()
            const plans = await planService.getAll(dateFrom, dateTo, type, +limit, +page)

            return res.json(plans)
        } catch (error) {
            next(error)
        }
    }

    async getForSelector(req, res, next) {
        try {
            const planService = new PlanService()
            return res.json(await planService.getForSelector())
        } catch (error) {

        }
    }

    async create(req, res, next) {
        try {
            const planService = new PlanService()
            const result = await planService.create(req.body)

            return res.json(result)
        } catch (error) {
            next(error)
        }
    }

    async delete(req, res, next) {
        try {
            const {planIds} = req.body

            const planService = new PlanService()
            const result = await planService.delete(planIds)
            return res.json({deletedCount: result})
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new PlanController
