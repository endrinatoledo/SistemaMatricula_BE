const {  StatusCodes } = require('http-status-codes')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const db = require("../models");

const ControlNumberModel = db.controlNumberModel

const latestControlNumber = async (req, res, next) =>{
  ControlNumberModel.findOne({
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

const updateControlNumber = async (controlNumber) => {
  try {
    const res = await ControlNumberModel.findOne({
      where: {
        nucId: controlNumber
      }
    }).then((controlNumberRes) => {
      controlNumberRes.update({
        nucValue: Number(controlNumberRes.nucValue) + 1
      })
        .then((controlNumberAct) => {
          message = 'Numero de control actualizado satisfactoriamente';
          return { ok: true, data: controlNumberAct, message }
        }, (err) => {
          return { ok: false, message: `Error al actualizar num Control: ${err}` }
        })
    }, (err) => {
      return { ok: false, message: `Error al consultar num Control: ${err}` }
    })
    return res
  } catch (error) {
    return { ok: false, message: `Error en try al consultar num Control: ${err}` }

  }


}

module.exports = {
    latestControlNumber,
  updateControlNumber,
}
