const professionsController = require('../controllers/professionsControllers')

const router = require('express').Router()

router.get   ('/', professionsController.getAllProfessions)
router.get   ('/:proId', professionsController.getOneProfessionById)

module.exports = router