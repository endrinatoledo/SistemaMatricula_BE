const conceptosAdicionalesController = require('../controllers/conceptosAdicionalesController');

const router = require('express').Router();

router.post('/', conceptosAdicionalesController.addConceptosAdicionales);
router.get('/invoiceHeader/:inhId', conceptosAdicionalesController.getConceptosAdicionalesByInhId);
router.get('/periodo/:perId/familia/:famId', conceptosAdicionalesController.getConceptosAdicionalesByPerIdFamId);

module.exports = router