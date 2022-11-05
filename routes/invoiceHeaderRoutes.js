const invoiceHeaderControllers = require('../controllers/invoiceHeaderControllers')

const router = require('express').Router()

router.post('/', invoiceHeaderControllers.addInvoiceHeader)

module.exports = router