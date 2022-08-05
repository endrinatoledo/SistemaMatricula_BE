const {  StatusCodes } = require('http-status-codes')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const db = require("../models");

const PaymentSchemaModel = db.paymentSchemeModel

//Add PaymentSchema

const addPaymentScheme =  async (req, res,next) =>{

    if (req.body.pscName === '' || req.body.pscStatus === 0) return res.status(406).json({ok: false, message: 'Todos los campos son obligatorios'});
    try {

        let pscExists = await PaymentSchemaModel.findOne({
            where: { pscName: req.body.pscName }
      
          }).catch((err) => {
            throw err; 
          });

          if (pscExists){
            return res.status(StatusCodes.OK).json({ok: false, message: 'Esquema de Pago ya se encuentra registrado'})
          }else{
            PaymentSchemaModel.create({
                pscName: req.body.pscName,
                pscDescription: req.body.pscDescription,
                pscStatus: req.body.pscStatus
            })
            .then((paymentSchema) => {
                message = 'Esquema de Pago creado con éxito';
                res.status(StatusCodes.OK).json({ok: true,data: paymentSchema, message})
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
//get All PaymentSchema
const getAllPaymentSchema =  async (req, res, next) =>{

    PaymentSchemaModel.findAll({})
    .then((paymentSchemes) => {
        res.status(StatusCodes.OK).json({ok: true, data: paymentSchemes})
    }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
        next(err)
      })

}
//get All PaymentSchema by Id
const getOnePaymentSchemeById =  async (req, res, next) =>{
  
    PaymentSchemaModel.findOne({
        where: {
            pscId: req.params.pscId
        }
      })
      .then((paymentSchema) => {
        res.status(StatusCodes.OK).json({ok: true, data: paymentSchema})
      }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
        next(err)
      })

}
//Update PaymentSchema
const updatePaymentScheme =  async (req, res, next) =>{

    PaymentSchemaModel.findOne({
        where: {
            pscName: req.body.pscName,
            pscId: {
            [Op.ne]: req.params.pscId
          }
        }
      })
      .then((paymentSchema) => {
        if(paymentSchema){
          return res.status(StatusCodes.OK).json({ok: false, message: 'Esquema de Pago ya se encuentra registrado'})
        }else{    
            PaymentSchemaModel.findOne({
            where: {
              pscId: req.params.pscId          
            }
          }).then((paymentSchema) => {
            paymentSchema.update({
                pscName: (req.body.pscName != null) ? req.body.pscName : paymentSchema.pscName,
                pscDescription: (req.body.pscDescription != null) ? req.body.pscDescription : paymentSchema.pscDescription,
                pscStatus: (req.body.pscStatus != null) ? req.body.pscStatus : paymentSchema.pscStatus
                })
                .then((paymentSchema) => {
                  message = 'Esquema de Pago actualizado con éxito';
                  res.status(StatusCodes.OK).json({ok: true, data:paymentSchema, message})
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
//Delete PaymentSchema
const deletePaymentScheme =  async (req, res, next) =>{

    PaymentSchemaModel.destroy({      
        where: {
            pscId: req.params.pscId
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
//get All Active PaymentSchema
const getAllActivePaymentScheme =  async (req, res, next) =>{

  PaymentSchemaModel.findAll({
    where: {
      pscStatus: 1
      }
  })
  .then((paymentSchemes) => {
 
    if(paymentSchemes.length > 0){

      res.status(StatusCodes.OK).json({ok: true, data: paymentSchemes})
    }else{
      res.status(StatusCodes.OK).json({ok: true, data: paymentSchemes })
    }

  }, (err) => {
      message = err
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
      next(err)
    })

}

module.exports = {
    addPaymentScheme,
    getAllPaymentSchema,
    getOnePaymentSchemeById,
    updatePaymentScheme,
    deletePaymentScheme,
    getAllActivePaymentScheme
}
