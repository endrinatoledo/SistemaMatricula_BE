const {  StatusCodes } = require('http-status-codes')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const db = require("../models");

const InvoiceConceptsModel = db.invoiceConceptsModel

//Add InvoiceConcept

const addInvoiceConcept =  async (req, res,next) =>{

    if (req.body.icoName === '' || req.body.icoStatus === 0) return res.status(406).json({ok: false, message: 'Todos los campos son obligatorios'});
    try {

        let invoiceConceptExists = await InvoiceConceptsModel.findOne({
            where: { icoName: req.body.icoName }
      
          }).catch((err) => {
            throw err; 
          });

          if (invoiceConceptExists){
            return res.status(StatusCodes.OK).json({ok: false, message: 'Concepto ya se encuentra registrado'})
          }else{
            InvoiceConceptsModel.create({
                icoName: req.body.icoName,
                icoDescription: (req.body.icoDescription)?req.body.icoDescription : '',
                icoStatus: req.body.icoStatus
            })
            .then((invoiceConcept) => {
                message = 'Concepto creado con éxito';
                res.status(StatusCodes.OK).json({ok: true,data: invoiceConcept, message})
              }, (err) => {
                message = err
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message})
                next(err)
              })


          }
    } catch (err) {
        message = err;
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message });
        next(err);
      }

}
//get All invoiceConcept
const getAllInvoiceConcepts =  async (req, res, next) =>{

    InvoiceConceptsModel.findAll({})
    .then((invoiceConcepts) => {
        res.status(StatusCodes.OK).json({ok: true, data: invoiceConcepts})
    }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
        next(err)
      })

}
//get All InvoiceConcept by Id
const getOneInvoiceConceptById =  async (req, res, next) =>{
  
    InvoiceConceptsModel.findOne({
        where: {
            icoId: req.params.icoId
        }
      })
      .then((invoiceConcept) => {
        res.status(StatusCodes.OK).json({ok: true, data: invoiceConcept})
      }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
        next(err)
      })

}
//Update InvoiceConcept
const updateInvoiceConcept =  async (req, res, next) =>{

  if (req.body.icoName === '' || req.body.icoStatus === 0) return res.status(406).json({ok: false, message: 'Todos los campos son obligatorios'});

    InvoiceConceptsModel.findOne({
        where: {
            icoName: req.body.icoName,
            icoId: {
            [Op.ne]: req.params.icoId
          }
        }
      })
      .then((invoiceConcept) => {
        if(invoiceConcept){
          return res.status(StatusCodes.OK).json({ok: false, message: 'Concepto ya se encuentra registrado'})
        }else{    
            InvoiceConceptsModel.findOne({
            where: {
              icoId: req.params.icoId          
            }
          }).then((invoiceConcept) => {
            invoiceConcept.update({
                icoName: (req.body.icoName != null) ? req.body.icoName : invoiceConcept.icoName,
                icoDescription: (req.body.icoDescription != null) ? req.body.icoDescription : invoiceConcept.icoDescription,
                icoStatus: (req.body.icoStatus != null) ? req.body.icoStatus : invoiceConcept.icoStatus
                })
                .then((invoiceConcept) => {
                  message = 'Concepto actualizado con éxito';
                  res.status(StatusCodes.OK).json({ok: true, data:invoiceConcept, message})
                }, (err) => {
                  message = err
                  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
                  next(err)
                })
              }, (err) => {
                message = err
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
                next(err)
              })    
        }
      }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
        next(err)
      })

}
//Delete InvoiceConcept
const deleteInvoiceConcept =  async (req, res, next) =>{

    InvoiceConceptsModel.destroy({      
        where: {
            icoId: req.params.icoId
          }        
        }).then((rowsDeleted) => {  
        if(rowsDeleted > 0) {
          return res.status(StatusCodes.OK).json({ok: true, message: `Concepto eliminado con éxito`})  
        }else{
          return res.status(StatusCodes.OK).json({ok: false, message: `Error al eliminar Concepto`})  
        }
      }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false,message})
        next(err)
      })    

}
//get All Active InvoiceConcept
const getAllActiveInvoiceConcepts =  async (req, res, next) =>{

  InvoiceConceptsModel.findAll({
    where: {
      icoStatus: 1
      }
  })
  .then((invoiceConcepts) => {
 
    if(invoiceConcepts.length > 0){

      const lookup = invoiceConcepts.reduce(function(acc, cur) {
        acc[cur.icoId] = cur.icoName;
        return acc;
      }, {})

      res.status(StatusCodes.OK).json({ok: true, data: invoiceConcepts, lookup})
    }else{
      res.status(StatusCodes.OK).json({ok: true, data: invoiceConcepts, lookup:null})
    }

  }, (err) => {
      message = err
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
      next(err)
    })

}

module.exports = {
    addInvoiceConcept,
    getAllInvoiceConcepts,
    getOneInvoiceConceptById,
    updateInvoiceConcept,
    deleteInvoiceConcept,
    getAllActiveInvoiceConcepts
}
