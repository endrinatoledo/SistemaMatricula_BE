const paymentSchemaController = require('../controllers/paymentSchemaControllers')

const router = require('express').Router()

router.post  ('/', paymentSchemaController.addPaymentScheme)
router.get   ('/', paymentSchemaController.getAllPaymentSchema)
router.get   ('/:pscId', paymentSchemaController.getOnePaymentSchemeById)
router.put   ('/:pscId', paymentSchemaController.updatePaymentScheme)
router.delete('/:pscId', paymentSchemaController.deletePaymentScheme)
router.get   ('/allPaymentScheme/active', paymentSchemaController.getAllActivePaymentScheme)

module.exports = router