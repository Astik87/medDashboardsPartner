const Router = require('express')
const router = new Router
const adminMiddleware = require('../middleware/adminMiddleware')
const UserController = require('../controllers/UserController')

router.post('/registration', adminMiddleware, UserController.registration)
router.post('/login', UserController.login)
router.get('/logout', UserController.logout)
router.get('/refresh', UserController.refresh)

router.get('', adminMiddleware, UserController.getUsers)
router.delete('', adminMiddleware, UserController.deleteUsers)

module.exports = router
