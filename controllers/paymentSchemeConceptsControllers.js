const {  StatusCodes } = require('http-status-codes')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const db = require("../models");

const PaymentSchemeConceptsModel = db.paymentSchemeConceptsModel

//Add PaymentSchemeConcepts

const addPaymentSchemeConcepts =  async (req, res,next) =>{

    if (req.body.pscId === null || req.body.plsId === null || req.body.icoId === null || req.body.pcoAmount === null) return res.status(406).json({ok: false, message: 'Todos los campos son obligatorios'});
    try {

            PaymentSchemeConceptsModel.create({
              pscId: req.body.pscId,
              plsId: req.body.plsId,
              icoId: req.body.icoId,
              pcoAmount : req.body.pcoAmount
            })
            .then((paymentSchemeConcepts) => {
                message = 'Esquema de Pago creado con éxito';
                res.status(StatusCodes.OK).json({ok: true,data: paymentSchemeConcepts, message})
              }, (err) => {
                message = err
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message})
                next(err)
              })

    } catch (err) {
        message = err;
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message });
        next(err);
      }

}
//get All PaymentSchemeConcepts
const getAllPaymentSchemeConcepts =  async (req, res, next) =>{

    PaymentSchemeConceptsModel.findAll({})
    .then((paymentSchemeConcepts) => {
        res.status(StatusCodes.OK).json({ok: true, data: paymentSchemeConcepts})
    }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
        next(err)
      })

}
//get All PaymentSchemeConcepts by Id
const getOnePaymentSchemeConceptsById =  async (req, res, next) =>{
  
    PaymentSchemeConceptsModel.findOne({
        where: {
          pcoId: req.params.pcoId
        }
      })
      .then((paymentSchemeConcepts) => {
        res.status(StatusCodes.OK).json({ok: true, data: paymentSchemeConcepts})
      }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
        next(err)
      })

}
//Update PaymentSchemeConcepts
const updatePaymentSchemeConcepts =  async (req, res, next) =>{
    
            PaymentSchemeConceptsModel.findOne({
            where: {
              pcoId: req.params.pcoId          
            }
          }).then((paymentSchemeConcepts) => {
            paymentSchemeConcepts.update({

              pscId: (req.body.pscId != null) ? req.body.pscId : paymentSchemeConcepts.pscId,
              plsId: (req.body.plsId != null) ? req.body.plsId : paymentSchemeConcepts.plsId,
              icoId: (req.body.icoId != null) ? req.body.icoId : paymentSchemeConcepts.icoId,
              pcoAmount: (req.body.pcoAmount != null) ? req.body.pcoAmount : paymentSchemeConcepts.pcoAmount

                })
                .then((paymentSchemeConcepts) => {
                  message = 'Esquema de Pago actualizado con éxito';
                  res.status(StatusCodes.OK).json({ok: true, data:paymentSchemeConcepts, message})
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
//Delete PaymentSchemeConcepts
const deletePaymentSchemeConcepts =  async (req, res, next) =>{

    PaymentSchemeConceptsModel.destroy({      
        where: {
          pcoId: req.params.pcoId
          }        
        }).then((rowsDeleted) => {  
        if(rowsDeleted > 0) {
          return res.status(StatusCodes.OK).json({ok: true, message: `Esquema de Pago eliminado con éxito`})  
        }else{
          return res.status(StatusCodes.OK).json({ok: false, message: `Error al eliminar Esquema de Pago`})  
        }
      }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false,message})
        next(err)
      })    

}


module.exports = {
    addPaymentSchemeConcepts,
    getAllPaymentSchemeConcepts,
    getOnePaymentSchemeConceptsById,
    updatePaymentSchemeConcepts,
    deletePaymentSchemeConcepts,
}
