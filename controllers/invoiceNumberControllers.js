const {  StatusCodes } = require('http-status-codes')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const db = require("../models");

const InvoiceNumberModel = db.invoiceNumberModel

const latestInvoiceNumber = async (req, res, next) =>{
  InvoiceNumberModel.findOne({
      order:[['nui_id','DESC']],
    })
    .then((result) => {
      res.status(StatusCodes.OK).json({ok: true, data: result})
    }, (err) => {
      message = err
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
      next(err)
    })
  }

const updateInvoiceNumber = async (invoiceNumber) => {
  let res
  try {
     res = await InvoiceNumberModel.findOne({
      where: {
        nuiId: invoiceNumber
      }
    }).then((invoiceNumberRes) => {

      invoiceNumberRes.update({
        nuiValue: Number(invoiceNumberRes.dataValues.nuiValue) + 1
      })
        .then((invoiceNumberAct) => {
          message = 'Numero de factura actualizado satisfactoriamente';
          return { ok: true, data: invoiceNumberAct, message }
        }, (err) => {
          return { ok: false, message: `Error al actualizar numFact: ${err}` }
        })
    }, (err) => {

      console.log(`Error al consultar numFact: ${err}`)
      return { ok: false, message: `Error al consultar numFact: ${err}` }
    })
  } catch (error) {
    return { ok: false, message: `Error en try al consultar numFact: ${error}` }
  }

  return res
  
}
module.exports = {
    latestInvoiceNumber,
    updateInvoiceNumber
}
