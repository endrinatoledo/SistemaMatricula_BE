const schoolDataController = require('../controllers/schoolDataControllers')

const router = require('express').Router()

router.get   ('/', schoolDataController.getOneSchoolData)

module.exports = router