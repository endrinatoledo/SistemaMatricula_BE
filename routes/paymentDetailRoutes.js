const paymentDetailControllers = require('../controllers/paymentDetailControllers')

const router = require('express').Router()

router.post  ('/', paymentDetailControllers.addPaymentDetail)
 
module.exports = router