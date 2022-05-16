const {  StatusCodes } = require('http-status-codes')
const db = require("../models");

const FederalEntityModel = db.federalEntityModel


//get All FederalEntity
const getAllFederalEntities =  async (req, res, next) =>{

    FederalEntityModel.findAll({})
    .then((federalEntities) => {
        res.status(StatusCodes.OK).json({ok: true, data: federalEntities})
    }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
        next(err)
      })

}
//get All FederalEntity by Id
const getOneFederalEntityById =  async (req, res, next) =>{
  
    FederalEntityModel.findOne({
        where: {
            fedId: req.params.fedId
        }
      })
      .then((federalEntity) => {
        res.status(StatusCodes.OK).json({ok: true, data: federalEntity})
      }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
        next(err)
      })

}

//get All FederalEntity by Id Country
const getFederalEntityByIdCountry =  async (req, res, next) =>{

  let extranjero = 1 
  

  FederalEntityModel.findAll({
      where: {
          couId: (req.params.couId == 232) ? couId = req.params.couId : extranjero
      }
    })
    .then((federalEntities) => {
      res.status(StatusCodes.OK).json({ok: true, data: federalEntities})
    }, (err) => {
      message = err
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
      next(err)
    })

}


module.exports = {
    getAllFederalEntities,
    getOneFederalEntityById,
    getFederalEntityByIdCountry
}
