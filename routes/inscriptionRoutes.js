const inscriptionControllers = require('../controllers/inscriptionControllers')

const router = require('express').Router()

router.post  ('/', inscriptionControllers.addInscription)
router.get   ('/', inscriptionControllers.getAllInscriptions)
router.get   ('/:insId', inscriptionControllers.getOneInscriptionById)
router.put   ('/:insId', inscriptionControllers.updateInscription)
router.delete('/:insId', inscriptionControllers.deleteInscription)



module.exports = router