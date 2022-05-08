const InvoiceConceptsControllers = require('../controllers/invoiceConceptsControllers')

const router = require('express').Router()

router.post  ('/', InvoiceConceptsControllers.addInvoiceConcept)
router.get   ('/', InvoiceConceptsControllers.getAllInvoiceConcepts)
router.get   ('/:icoId', InvoiceConceptsControllers.getOneInvoiceConceptById)
router.put   ('/:icoId', InvoiceConceptsControllers.updateInvoiceConcept)
router.delete('/:icoId', InvoiceConceptsControllers.deleteInvoiceConcept)
router.get   ('/allInvoiceConcepts/active', InvoiceConceptsControllers.getAllActiveInvoiceConcepts)



module.exports = router