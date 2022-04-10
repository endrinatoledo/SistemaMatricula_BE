const rolController = require('../controllers/rolControllers')

const router = require('express').Router()

router.post  ('/', rolController.addRol)
router.get   ('/', rolController.getAllRoles)
router.get   ('/:rolId', rolController.getOneRolById)
router.put   ('/:rolId', rolController.updateRol)
router.delete('/:rolId', rolController.deleteRol)
router.get   ('/allRoles/active', rolController.getAllActiveRoles)



module.exports = router