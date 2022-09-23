const reportsControllers = require('../controllers/reportsControllers')

const router = require('express').Router()

router.post  ('/levelsection', reportsControllers.reportByLevelAndSection)
router.post  ('/statistics', reportsControllers.reportStatistics)
router.post  ('/familypayroll', reportsControllers.familyPayroll)
router.post  ('/schoolinsurance', reportsControllers.schoolInsurance)
router.post  ('/morosos', reportsControllers.morosos)
 
module.exports = router