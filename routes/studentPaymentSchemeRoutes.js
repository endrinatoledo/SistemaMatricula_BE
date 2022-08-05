const studentPaymentSchemeController = require('../controllers/studentPaymentSchemeControllers')

const router = require('express').Router()

router.post  ('/', studentPaymentSchemeController.addStudentPaymentScheme)
router.get   ('/', studentPaymentSchemeController.getAllStudentPaymentScheme)
router.get   ('/:spsId', studentPaymentSchemeController.getOneStudentPaymentSchemeById)
router.put   ('/:spsId', studentPaymentSchemeController.updateStudentPaymentScheme)
router.delete('/:spsId', studentPaymentSchemeController.deleteStudentPaymentScheme)

module.exports = router