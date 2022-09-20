const bankController = require('../controllers/banksControllers')

const router = require('express').Router()

router.post  ('/', bankController.addBank)
router.get   ('/', bankController.getAllBanks)
router.get   ('/:banId', bankController.getOneBankById)
router.put   ('/:banId', bankController.updateBank)
router.delete('/:banId', bankController.deleteBank)
router.get   ('/allBanks/active', bankController.getAllActiveBanks)



module.exports = router