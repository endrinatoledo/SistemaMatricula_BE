const federalEntityController = require('../controllers/federalEntityControllers')

const router = require('express').Router()

router.get   ('/', federalEntityController.getAllFederalEntities)
router.get   ('/:fedId', federalEntityController.getOneFederalEntityById)

module.exports = router