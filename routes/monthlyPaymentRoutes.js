const monthlyPaymentControllers = require('../controllers/monthlyPaymentControllers')

const router = require('express').Router()

// router.get('/family/:famId', monthlyPaymentControllers.getMonthlyPaymentByFamId)

router.post('/exoneracion/mensualidades', monthlyPaymentControllers.mensualidadesExoneradas)

module.exports = router