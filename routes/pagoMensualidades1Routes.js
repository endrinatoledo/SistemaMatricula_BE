const pagoMensualidadesControllers = require('../controllers/pagoMensualidadesControllers')

const router = require('express').Router()

router.get('/familia/:famId/periodo/:perId', pagoMensualidadesControllers.getTablaPagoMensualidadesPorFamilia)
router.get   ('/estudiante/stuId', pagoMensualidadesControllers.getTablaPagoMensualidadesPorEstudiante)
router.post   ('/estudiante/datos', pagoMensualidadesControllers.getMensualidadesPorEstudiante)

module.exports = router