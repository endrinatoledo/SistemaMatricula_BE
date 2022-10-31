const {  StatusCodes } = require('http-status-codes')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const db = require("../models");

const invoiceNumberModel = db.invoiceNumberModel

const latestInvoiceNumber = async (req, res, next) =>{
    invoiceNumberModel.findOne({
      order:[['nui_id','DESC']],
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
    latestInvoiceNumber
}
