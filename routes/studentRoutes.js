const studentControllers = require('../controllers/studentControllers')

const router = require('express').Router()

router.post  ('/', studentControllers.addStudent)
router.get   ('/', studentControllers.getAllStudents)
router.get   ('/:stuId', studentControllers.getOneStudentById)
router.put   ('/:stuId', studentControllers.updateStudent)
router.delete('/:stuId', studentControllers.deleteStudent)
router.get   ('/allStudents/active', studentControllers.getAllActiveStudents)



module.exports = router