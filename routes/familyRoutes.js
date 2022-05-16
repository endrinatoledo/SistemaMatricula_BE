const familyController = require('../controllers/familyControllers')

const router = require('express').Router()

router.post('/', familyController.addFamily)
router.get('/', familyController.getAllFamilies)
router.get('/allFamilies/active', familyController.getAllActiveFamilies)
router.get('/:famId', familyController.getOneFamilyById)
router.put('/:famId', familyController.updateFamily)
router.delete('/:famId', familyController.deleteFamily)

module.exports = router