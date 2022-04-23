const periodController = require('../controllers/periodControllers')

const router = require('express').Router()

router.post  ('/', periodController.addPeriod)
router.get   ('/', periodController.getAllPeriods)
router.get   ('/:perId', periodController.getOnePeriodById)
router.put   ('/:perId', periodController.updatePeriod)
router.delete('/:perId', periodController.deletePeriod)
router.get   ('/allPeriods/active', periodController.getAllActivePeriods)



module.exports = router