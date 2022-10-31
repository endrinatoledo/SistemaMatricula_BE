const invoiceNumberController = require('../controllers/invoiceNumberControllers')

const router = require('express').Router()

router.get   ('/lastest', invoiceNumberController.latestInvoiceNumber)

module.exports = router