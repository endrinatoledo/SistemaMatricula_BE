const paymentsConceptsStudentsController = require('../controllers/paymentsConceptsStudentsControllers')

const router = require('express').Router()

router.post  ('/', paymentsConceptsStudentsController.addPaymentsConceptsStudents)
router.get   ('/', paymentsConceptsStudentsController.getAllPaymentsConceptsStudents)
router.get   ('/:pcsId', paymentsConceptsStudentsController.getOnePaymentsConceptsStudentsById)
router.put   ('/:pcsId', paymentsConceptsStudentsController.updatePaymentsConceptsStudents)
router.delete('/:pcsId', paymentsConceptsStudentsController.deletePaymentsConceptsStudents)

module.exports = router