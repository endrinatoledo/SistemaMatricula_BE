const { StatusCodes } = require('http-status-codes')
const { LowercaseString, FirstCapitalLetter } = require('../utils/functions')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const db = require("../models");

const InvoiceHeaderModel = db.invoiceHeaderModel
const InvoiceNumberModel = db.invoiceNumberModel
const ControlNumberModel = db.controlNumberModel
const InvoiceDetailModel = db.invoiceDetailModel

const addInvoiceDetail = async (body, inhId) => {

    let arrayRespuestas = []
    try {
        for (let index = 0; index < body.length; index++) {
            
            arrayRespuestas.push(await InvoiceDetailModel.create({
                modId: body[index].mopId,
                indStuName: body[index].student,
                indDescripcion: body[index].descripcion,
                indcosto: body[index].costo.cmeAmount,
                indpagado: body[index].restante + body[index].pago ,
                inhId: inhId

            })
                .then((res) => {
                    console.log('res', JSON.stringify(res))
                    messageRes = `Se agrego pago de mensualidades del estudiante ${body[index].indStuName}`;
                    return { messge: messageRes }
                }, (err) => {
                    console.log('err', JSON.stringify(err))
                    messageRes = `Error al cargar pago de mensualidades del estudiante ${body[index].indStuName}`;
                    return { messge: messageRes }
                }))
        }

        return arrayRespuestas


    } catch (err) {
        console.log('error al guardar factura', err)

        return { ok: false, message }

    }

}


module.exports = {
    addInvoiceDetail,
}