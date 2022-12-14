const Router = require('express')
const router = new Router()
const planController = require('../controllers/PlanController')

router.get('', planController.get)
router.get('/for-selector', planController.getForSelector)
router.post('', planController.create)
router.delete('', planController.delete)

module.exports = router
