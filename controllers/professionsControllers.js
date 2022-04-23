const {  StatusCodes } = require('http-status-codes')
const db = require("../models");

const professionsModel = db.professionsModel


//get All profession
const getAllProfessions =  async (req, res, next) =>{

    professionsModel.findAll({})
    .then((professions) => {
        res.status(StatusCodes.OK).json({ok: true, data: professions})
    }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
        next(err)
      })

}
//get All profession by Id
const getOneProfessionById =  async (req, res, next) =>{
  
    professionsModel.findOne({
        where: {
            proId: req.params.proId
        }
      })
      .then((profession) => {
        res.status(StatusCodes.OK).json({ok: true, data: profession})
      }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
        next(err)
      })

}


module.exports = {
    getAllProfessions,
    getOneProfessionById,
}
