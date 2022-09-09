const Router = require('express')
const router = new Router
const authMiddleware = require('../middleware/authMiddleware')
const userRouter = require('./UserRouter')

router.use('/user', userRouter)

module.exports = router
