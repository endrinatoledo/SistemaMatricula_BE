const costoMensualidadesController = require('../controllers/costoMensualidadesControllers')

const router = require('express').Router()

router.post('/', costoMensualidadesController.addCostoMensualidad)
router.get('/', costoMensualidadesController.getAllCostoMensualidades)
router.get('/:cmeId', costoMensualidadesController.getOneCostoMensualidadById)
router.delete('/:cmeId', costoMensualidadesController.deleteCostoMensualidad)
router.get('/latest/item', costoMensualidadesController.latestCostoMensualidad)

module.exports = router