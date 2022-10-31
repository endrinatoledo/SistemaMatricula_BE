const controlNumberController = require('../controllers/controlNumberControllers')

const router = require('express').Router()

router.get   ('/lastest', controlNumberController.latestControlNumber)

module.exports = router