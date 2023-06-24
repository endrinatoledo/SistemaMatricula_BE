const reportsControllers = require('../controllers/reportsControllers')

const router = require('express').Router()

router.post  ('/levelsection', reportsControllers.reportByLevelAndSection)
router.post  ('/statistics', reportsControllers.reportStatistics)
router.post  ('/familypayroll', reportsControllers.familyPayroll)
router.post  ('/schoolinsurance', reportsControllers.schoolInsurance)
router.post  ('/morosos', reportsControllers.morosos)
router.post  ('/mensualidades/cobranza', reportsControllers.mensualidadesCobranza)
router.post  ('/clasificacion/pagos', reportsControllers.clasificacionPagos)
router.post  ('/morosos/filtros', reportsControllers.morososConFiltros)
router.post  ('/morosos/grafica', reportsControllers.graficaMorosos)

module.exports = router