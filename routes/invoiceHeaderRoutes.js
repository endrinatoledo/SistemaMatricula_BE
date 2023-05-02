const invoiceHeaderControllers = require('../controllers/invoiceHeaderControllers')

const router = require('express').Router()

router.post('/', invoiceHeaderControllers.addInvoiceHeader)
router.get('/invoice/family/:famId/periodo/:perId', invoiceHeaderControllers.buscarFacturasPorFamilia)
router.put('/anular/inh/:inhId', invoiceHeaderControllers.anularFactura)
module.exports = router