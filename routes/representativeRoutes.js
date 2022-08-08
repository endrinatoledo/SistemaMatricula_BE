const representativeControllers = require('../controllers/representativeControllers')

const router = require('express').Router()

router.post  ('/', representativeControllers.addRepresentative)
router.get   ('/', representativeControllers.getAllRepresentatives)
router.get   ('/:repId', representativeControllers.getOneRepresentativeById)
router.put   ('/:repId', representativeControllers.updateRepresentative)
router.delete('/:repId', representativeControllers.deleteRepresentative)
router.get   ('/allRepresentatives/active', representativeControllers.getAllActiveRepresentatives)
router.post   ('/byIdentification', representativeControllers.getRepresentativeByIdentification)
router.get   ('/representative/payments/:repId', representativeControllers.getRepresentativePayments)



module.exports = router