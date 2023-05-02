const invoiceControllers = require('../controllers/invoiceControllers')

const router = require('express').Router()

router.post('/filtro', invoiceControllers.getFacturasPorFiltro)

module.exports = router