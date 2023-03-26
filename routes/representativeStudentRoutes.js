const representativeStudentControllers = require('../controllers/representativeStudentControllers')

const router = require('express').Router()

router.post  ('/', representativeStudentControllers.addRepresentativeStudent)
router.get   ('/', representativeStudentControllers.getAllRepresentativeStudent)
router.get   ('/groupedByFamily/', representativeStudentControllers.getAllRepresentativeStudentGroupByFamily)
router.get   ('/byFam/:famId', representativeStudentControllers.getOneRepresentativeStudentByFamId)
router.get   ('/:rstId', representativeStudentControllers.getOneRepresentativeStudentById)
router.put   ('/:rstId', representativeStudentControllers.updateRepresentativeStudent)
router.delete('/:rstId', representativeStudentControllers.deleteRepresentativeStudent)
router.put   ('/status/representative/:rstId', representativeStudentControllers.updateStatusRepresentative)
router.put   ('/status/student/:rstId', representativeStudentControllers.updateStatusStudent)
router.get   ('/family/representativeId/:repId', representativeStudentControllers.getRepresentativeStudentByIdRepresentative)
router.get('/family/studentId/:stuId', representativeStudentControllers.getRepresentativeStudentByIdStudent)





module.exports = router