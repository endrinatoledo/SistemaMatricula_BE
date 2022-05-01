const {  StatusCodes } = require('http-status-codes')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const db = require("../models");

const ExchangeRatesModel = db.exchangeRatesModel

//Add exchangeRate

const addExchangeRate =  async (req, res,next) =>{

    if (req.body.amount === '' || req.body.date === '' || req.body.shift === '') return res.status(406).json({ok: false, message: 'Todos los campos son obligatorios'});
    try {
            ExchangeRatesModel.create({
              excAmount: parseFloat(req.body.amount),
              excDate: req.body.date,
              excShift: req.body.shift
            })
            .then((exchangeRate) => {
                message = 'Tasa de Cambio creada con éxito';
                res.status(StatusCodes.OK).json({ok: true,data: exchangeRate, message})
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
//get All exchangeRate
const getAllExchangeRates =  async (req, res, next) =>{

    ExchangeRatesModel.findAll({})
    .then((exchangeRates) => {
        res.status(StatusCodes.OK).json({ok: true, data: exchangeRates})
    }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
        next(err)
      })

}
//get All exchangeRate by Id
const getOneExchangeRateById =  async (req, res, next) =>{
  
    ExchangeRatesModel.findOne({
        where: {
            excId: req.params.excId
        }
      })
      .then((exchangeRate) => {
        res.status(StatusCodes.OK).json({ok: true, data: exchangeRate})
      }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
        next(err)
      })

}
//Update exchangeRate
const updateExchangeRate =  async (req, res, next) =>{

            ExchangeRatesModel.findOne({
            where: {
              excId: req.params.excId          
            }
          }).then((exchangeRate) => {
            exchangeRate.update({
                excAmount: (req.body.amount != null) ? req.body.amount : exchangeRate.excAmount,
                excDate: (req.body.date != null) ? req.body.date : exchangeRate.excDate,
                excShift: (req.body.shift != null) ? req.body.shift : exchangeRate.excShift,
                })
                .then((exchangeRate) => {
                  message = 'Tasa de Cambio actualizada con éxito';
                  res.status(StatusCodes.OK).json({ok: true, data:exchangeRate, message})
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
//Delete exchangeRate
const deleteExchangeRate =  async (req, res, next) =>{

    ExchangeRatesModel.destroy({      
        where: {
            excId: req.params.excId
          }        
        }).then((rowsDeleted) => {  
        if(rowsDeleted > 0) {
          return res.status(StatusCodes.OK).json({ok: true, message: `Tasa de Cambio eliminada con éxito`})  
        }else{
          return res.status(StatusCodes.OK).json({ok: false, message: `Error al eliminar Tasa de Cambio`})  
        }
      }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false,message})
        next(err)
      })    

}

module.exports = {
    addExchangeRate,
    getAllExchangeRates,
    getOneExchangeRateById,
    updateExchangeRate,
    deleteExchangeRate
}
