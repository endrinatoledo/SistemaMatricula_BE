const countryController = require('../controllers/countryControllers')

const router = require('express').Router()

router.get   ('/', countryController.getAllCountries)
router.get   ('/:couId', countryController.getOneCountryById)

module.exports = router