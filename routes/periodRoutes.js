const periodController = require('../controllers/periodControllers')

const router = require('express').Router()

router.post  ('/', periodController.addPeriod)
router.get   ('/', periodController.getAllPeriods)
router.get   ('/:perId', periodController.getOnePeriodById)
router.get   ('/onePeriod/active', periodController.getOneActivePeriod)
router.put   ('/:perId', periodController.updatePeriod)
router.delete('/:perId', periodController.deletePeriod)
router.get   ('/allPeriods/active', periodController.getAllActivePeriods)
router.get   ('/startYear/:perStartYear', periodController.getOnePeriodByStartYear)

module.exports = router