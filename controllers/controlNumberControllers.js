const {  StatusCodes } = require('http-status-codes')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const db = require("../models");

const controlNumberModel = db.controlNumberModel

const latestControlNumber = async (req, res, next) =>{
    controlNumberModel.findOne({
      order:[['nucId','DESC']],
      limit: 1,
    })
    .then((result) => {
      res.status(StatusCodes.OK).json({ok: true, data: result})
    }, (err) => {
      message = err
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
      next(err)
    })
  }

module.exports = {
    latestControlNumber
}
