const representativeStudentControllers = require('../controllers/representativeStudentControllers')

const router = require('express').Router()

router.post  ('/', representativeStudentControllers.addRepresentativeStudent)
router.get   ('/', representativeStudentControllers.getAllRepresentativeStudent)
router.get   ('/:rstId', representativeStudentControllers.getOneRepresentativeStudentById)
router.put   ('/:rstId', representativeStudentControllers.updateRepresentativeStudent)
router.delete('/:rstId', representativeStudentControllers.deleteRepresentativeStudent)



module.exports = router