const {  StatusCodes } = require('http-status-codes')
const db = require("../models");

const countriesModel = db.countriesModel


//get All country
const getAllCountries =  async (req, res, next) =>{

    countriesModel.findAll({})
    .then((countries) => {
        res.status(StatusCodes.OK).json({ok: true, data: countries})
    }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
        next(err)
      })

}
//get All country by Id
const getOneCountryById =  async (req, res, next) =>{
  
    countriesModel.findOne({
        where: {
            couId: req.params.couId
        }
      })
      .then((country) => {
        res.status(StatusCodes.OK).json({ok: true, data: country})
      }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
        next(err)
      })

}


module.exports = {
    getAllCountries,
    getOneCountryById,
}
