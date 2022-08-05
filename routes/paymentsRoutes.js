const paymentsController = require('../controllers/paymentsControllers')

const router = require('express').Router()

router.post  ('/', paymentsController.addPayments)
router.get   ('/', paymentsController.getAllPayments)
router.get   ('/:paymId', paymentsController.getOnePaymentsById)
router.put   ('/:paymId', paymentsController.updatePayments)
router.delete('/:paymId', paymentsController.deletePayments)

module.exports = router