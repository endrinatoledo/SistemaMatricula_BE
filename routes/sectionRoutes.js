const sectionController = require('../controllers/sectionControllers')

const router = require('express').Router()

router.post  ('/', sectionController.addSection)
router.get   ('/', sectionController.getAllSections)
router.get   ('/:secId', sectionController.getOneSectionById)
router.put   ('/:secId', sectionController.updateSection)
router.delete('/:secId', sectionController.deleteSection)
router.get   ('/allSections/active', sectionController.getAllActiveSections)


 
module.exports = router