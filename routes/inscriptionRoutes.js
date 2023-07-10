const inscriptionControllers = require('../controllers/inscriptionControllers')

const router = require('express').Router()

router.post  ('/', inscriptionControllers.addInscription)
router.post  ('/period', inscriptionControllers.getAllInscriptionsByPeriod)
router.get   ('/', inscriptionControllers.getAllInscriptions)
router.get   ('/:insId', inscriptionControllers.getOneInscriptionById)
router.get   ('/family/:famId', inscriptionControllers.getInscriptionsByFamId)
router.post  ('/student/period/', inscriptionControllers.getOneInscriptionByStudentByPeriod)
router.put   ('/:insId', inscriptionControllers.updateInscription)
router.delete('/:insId', inscriptionControllers.deleteInscription)



module.exports = router