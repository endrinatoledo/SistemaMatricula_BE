const periodLevelSectionControllers = require('../controllers/periodLevelSectionControllers')

const router = require('express').Router()

router.post  ('/', periodLevelSectionControllers.addPeriodLevelSection)
router.get   ('/', periodLevelSectionControllers.getAllPeriodLevelSection)
router.get   ('/:plsId', periodLevelSectionControllers.getOnePeriodLevelSectionById)
router.put   ('/:plsId', periodLevelSectionControllers.updatePeriodLevelSection)
router.delete('/:plsId', periodLevelSectionControllers.deletePeriodLevelSection)
router.get   ('/period/:perId', periodLevelSectionControllers.getOnePeriodLevelSectionByPerId)



module.exports = router