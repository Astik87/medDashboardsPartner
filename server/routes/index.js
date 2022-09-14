const Router = require('express')
const router = new Router
const authMiddleware = require('../middleware/authMiddleware')
const userRouter = require('./UserRouter')
const planRouter = require('./PlanRouter')
const waveRouter = require('./WaveRouter')

router.use('/user', userRouter)
router.use('/plan', planRouter)
router.use('/wave', waveRouter)

module.exports = router
