const federalEntityController = require('../controllers/federalEntityControllers')

const router = require('express').Router()

router.get   ('/', federalEntityController.getAllFederalEntities)
router.get   ('/:fedId', federalEntityController.getOneFederalEntityById)
router.get   ('/country/:couId', federalEntityController.getFederalEntityByIdCountry)

module.exports = router