const {  StatusCodes } = require('http-status-codes')
const db = require("../models");

const SchoolDataModel = db.schoolDataModel

//get All schoolData by Id
const getOneSchoolData =  async (req, res, next) =>{
  
    SchoolDataModel.findOne({
      })
      .then((schoolData) => {
        res.status(StatusCodes.OK).json({ok: true, data: schoolData})
      }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
        next(err)
      })
}

module.exports = {
    getOneSchoolData,
}
