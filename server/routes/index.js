const Router = require('express')
const router = new Router
const authMiddleware = require('../middleware/authMiddleware')
const userRouter = require('./UserRouter')
const planRouter = require('./PlanRouter')

router.use('/user', userRouter)
router.use('/plan', planRouter)

module.exports = router
