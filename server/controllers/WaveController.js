const WaveService = require('../services/WaveService')

class WaveController {
    async get(req, res, next) {
        try {
            let {limit, page} = req.query

            if(!limit)
                limit = 25

            if(!page)
                page = 1

            const waveService = new WaveService()
            const result = await waveService.get(+limit, +page)

            return res.json(result)
        } catch (error) {
            next(error)
        }
    }

    async create(req,res, next) {
        try {
            const {name, visitPlanId, eventPlanId, longReadPlanId} = req.body

            const waveService = new WaveService()
            const result = await waveService.create(name, visitPlanId, eventPlanId, longReadPlanId)

            return res.json(result)
        } catch (error) {
            next(error)
        }
    }

    async delete(req,res, next) {
        try {
            const {waveIds} = req.body

            const waveService = new WaveService
            const result = waveService.delete(waveIds)

            return res.json(result)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new WaveController
