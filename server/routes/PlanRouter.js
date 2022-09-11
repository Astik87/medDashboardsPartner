const Router = require('express')
const router = new Router()
const planController = require('../controllers/PlanController')

router.get('', planController.get)
router.post('', planController.create)
router.delete('', planController.delete)

module.exports = router
