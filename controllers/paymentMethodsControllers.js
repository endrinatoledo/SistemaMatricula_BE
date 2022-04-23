const {  StatusCodes } = require('http-status-codes')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const db = require("../models");

const paymentMethodsModel = db.paymentMethodsModel

//Add payMethod

const addPaymentMethod =  async (req, res,next) =>{

    if (req.body.name === '' || req.body.status === 0) return res.status(406).json({ok: false, message: 'Todos los campos son obligatorios'});
    try {

        let payMethodExists = await paymentMethodsModel.findOne({
            where: { payName: req.body.name }
      
          }).catch((err) => {
            throw err; 
          });

          if (payMethodExists){
            return res.status(StatusCodes.OK).json({ok: false, message: 'Método de Pago ya se encuentra registrado'})
          }else{
            paymentMethodsModel.create({
                payName: req.body.name,
                payStatus: req.body.status
            })
            .then((payMethod) => {
                message = 'Método de Pago creado con éxito';
                res.status(StatusCodes.OK).json({ok: true,data: payMethod, message})
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
//get All payMethod
const getAllPaymentMethods =  async (req, res, next) =>{

    paymentMethodsModel.findAll({})
    .then((paymentMethods) => {
        res.status(StatusCodes.OK).json({ok: true, data: paymentMethods})
    }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
        next(err)
      })

}
//get All payMethod by Id
const getOnePaymentMethodById  =  async (req, res, next) =>{
  
    paymentMethodsModel.findOne({
        where: {
            payId: req.params.payId
        }
      })
      .then((payMethod) => {
        res.status(StatusCodes.OK).json({ok: true, data: payMethod})
      }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
        next(err)
      })

}
//Update payMethod
const updatePaymentMethod  =  async (req, res, next) =>{

    paymentMethodsModel.findOne({
        where: {
            payName: req.body.name,
            payId: {
            [Op.ne]: req.params.payId
          }
        }
      })
      .then((payMethod) => {
        if(payMethod){
          return res.status(StatusCodes.OK).json({ok: false, message: 'Método de Pago ya se encuentra registrado'})
        }else{    
            paymentMethodsModel.findOne({
            where: {
              payId: req.params.payId          
            }
          }).then((payMethod) => {
            payMethod.update({
                payName: (req.body.name != null) ? req.body.name : payMethod.payName,
                payStatus: (req.body.status != null) ? req.body.status : payMethod.payStatus
                })
                .then((payMethod) => {
                  message = 'Método de Pago editado con éxito';
                  res.status(StatusCodes.OK).json({ok: true, data:payMethod, message})
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
//Delete payMethod
const deletePaymentMethod  =  async (req, res, next) =>{

    paymentMethodsModel.destroy({      
        where: {
            payId: req.params.payId
          }        
        }).then((rowsDeleted) => {  
        if(rowsDeleted > 0) {
          return res.status(StatusCodes.OK).json({ok: true, message: `Método de Pago eliminado con éxito`})  
        }else{
          return res.status(StatusCodes.OK).json({ok: false, message: `Error al eliminar Método de Pago`})  
        }
      }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false,message})
        next(err)
      })    

}
//get All Active payMethod
const getAllActivePaymentMethods =  async (req, res, next) =>{

  paymentMethodsModel.findAll({
    where: {
      payStatus: 1
      }
  })
  .then((paymentMethods) => {
      res.status(StatusCodes.OK).json({ok: true, data: paymentMethods})
  }, (err) => {
      message = err
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
      next(err)
    })

}

module.exports = {
    addPaymentMethod,
    getAllPaymentMethods,
    getOnePaymentMethodById ,
    updatePaymentMethod ,
    deletePaymentMethod ,
    getAllActivePaymentMethods
}
