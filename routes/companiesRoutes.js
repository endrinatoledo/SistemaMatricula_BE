const companiesController = require('../controllers/companiesControllers')

const router = require('express').Router()

router.post('/', companiesController.addCompany)
router.get('/', companiesController.getAllCompanies)
router.get('/:comId', companiesController.getOneCompanyById)
router.put('/:comId', companiesController.updateCompany)
router.delete('/:comId', companiesController.deleteCompany)
router.get('/allCompanies/active', companiesController.getAllActiveCompanies)



module.exports = router