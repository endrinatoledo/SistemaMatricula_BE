const paymentSchemeConceptsControllers = require('../controllers/paymentSchemeConceptsControllers')

const router = require('express').Router()

router.post  ('/', paymentSchemeConceptsControllers.addPaymentSchemeConcepts)
router.get   ('/', paymentSchemeConceptsControllers.getAllPaymentSchemeConcepts)
router.get   ('/:pcoId', paymentSchemeConceptsControllers.getOnePaymentSchemeConceptsById)
router.put   ('/:pcoId', paymentSchemeConceptsControllers.updatePaymentSchemeConcepts)
router.delete('/:pcoId', paymentSchemeConceptsControllers.deletePaymentSchemeConcepts)

module.exports = router