const levelController = require('../controllers/levelControllers')

const router = require('express').Router()

router.post  ('/', levelController.addLevel)
router.get   ('/', levelController.getAllLevels)
router.get   ('/:levId', levelController.getOneLevelById)
router.put   ('/:levId', levelController.updateLevel)
router.delete('/:levId', levelController.deleteLevel)
router.get   ('/allLevels/active', levelController.getAllActiveLevels)


 
module.exports = router