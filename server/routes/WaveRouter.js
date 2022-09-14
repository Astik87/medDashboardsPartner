const Router = require('express')
const router = new Router
const waveConstraints = require('../controllers/WaveController')

router.get('', waveConstraints.get)
router.post('', waveConstraints.create)
router.delete('', waveConstraints.delete)

module.exports = router
