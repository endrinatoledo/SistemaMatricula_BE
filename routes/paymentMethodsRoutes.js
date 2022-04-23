const paymentMethodsController = require('../controllers/paymentMethodsControllers')

const router = require('express').Router()

router.post  ('/', paymentMethodsController.addPaymentMethod)
router.get   ('/', paymentMethodsController.getAllPaymentMethods)
router.get   ('/:payId', paymentMethodsController.getOnePaymentMethodById)
router.put   ('/:payId', paymentMethodsController.updatePaymentMethod)
router.delete('/:payId', paymentMethodsController.deletePaymentMethod)
router.get   ('/allpaymentMethods/active', paymentMethodsController.getAllActivePaymentMethods)


 
module.exports = router