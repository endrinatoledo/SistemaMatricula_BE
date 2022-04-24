const exchangeRatesController = require('../controllers/exchangeRatesControllers')

const router = require('express').Router()

router.post  ('/', exchangeRatesController.addExchangeRate)
router.get   ('/', exchangeRatesController.getAllExchangeRates)
router.get   ('/:excId', exchangeRatesController.getOneExchangeRateById)
router.put   ('/:excId', exchangeRatesController.updateExchangeRate)
router.delete('/:excId', exchangeRatesController.deleteExchangeRate)

module.exports = router