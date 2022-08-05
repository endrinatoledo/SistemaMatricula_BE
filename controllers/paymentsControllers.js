const {  StatusCodes } = require('http-status-codes')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const db = require("../models");

const PaymentsModel = db.paymentsModel

//Add Payments

const addPayments =  async (req, res,next) =>{

    if (req.body.payId === null || req.body.paymAmount === null || req.body.paymReference === null || req.body.paymDate === null) return res.status(406).json({ok: false, message: 'Todos los campos son obligatorios'});
    try {

            PaymentsModel.create({
              payId: req.body.payId,
              paymAmount: req.body.paymAmount,
              paymReference: req.body.paymReference,
              paymDate: req.body.paymDate,
            })
            .then((payment) => {
                message = 'Pago creado con éxito';
                res.status(StatusCodes.OK).json({ok: true,data: payment, message})
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
//get All Payments
const getAllPayments =  async (req, res, next) =>{

    PaymentsModel.findAll({})
    .then((payments) => {
        res.status(StatusCodes.OK).json({ok: true, data: payments})
    }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
        next(err)
      })

}
//get All Payments by Id
const getOnePaymentsById =  async (req, res, next) =>{
  
    PaymentsModel.findOne({
        where: {
          paymId: req.params.paymId
        }
      })
      .then((payment) => {
        res.status(StatusCodes.OK).json({ok: true, data: payment})
      }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
        next(err)
      })

}
//Update Payments
const updatePayments =  async (req, res, next) =>{
   
            PaymentsModel.findOne({
            where: {
              paymId: req.params.paymId          
            }
          }).then((payment) => {
            payment.update({
              payId: (req.body.payId != null) ? req.body.payId : payment.payId,
              paymAmount: (req.body.paymAmount != null) ? req.body.paymAmount : payment.paymAmount,
              paymReference: (req.body.paymReference != null) ? req.body.paymReference : payment.paymReference,
              paymDate: (req.body.paymDate != null) ? req.body.paymDate : payment.paymDate
                })
                .then((payment) => {
                  message = 'Pago actualizado con éxito';
                  res.status(StatusCodes.OK).json({ok: true, data:payment, message})
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
//Delete Payments
const deletePayments =  async (req, res, next) =>{

    PaymentsModel.destroy({      
        where: {
          paymId: req.params.paymId
          }        
        }).then((rowsDeleted) => {  
        if(rowsDeleted > 0) {
          return res.status(StatusCodes.OK).json({ok: true, message: `Pago eliminado con éxito`})  
        }else{
          return res.status(StatusCodes.OK).json({ok: false, message: `Error al eliminar Pago`})  
        }
      }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false,message})
        next(err)
      })    

}


module.exports = {
    addPayments,
    getAllPayments,
    getOnePaymentsById,
    updatePayments,
    deletePayments,

}
