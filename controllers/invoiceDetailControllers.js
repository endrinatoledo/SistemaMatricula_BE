const { StatusCodes } = require('http-status-codes')
const { LowercaseString, FirstCapitalLetter } = require('../utils/functions')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const db = require("../models");

const InvoiceHeaderModel = db.invoiceHeaderModel
const InvoiceNumberModel = db.invoiceNumberModel
const MonthlyPaymentModel = db.monthlyPaymentModel
const InvoiceDetailModel = db.invoiceDetailModel

const addInvoiceDetail = async (body, inhId,tasa) => {

    let arrayRespuestas = []
    try {
        for (let index = 0; index < body.length; index++) {
            
            arrayRespuestas.push(await InvoiceDetailModel.create({
                mopId: body[index].mopId ? body[index].mopId : null,
                indStuName: body[index].student,
                indDescripcion: body[index].descripcion,
                indcosto: body[index].costo ? body[index].costo.cmeAmount : body[index].costoNeto,
                indpagado: body[index].montoPagado ? body[index].montoPagado + body[index].pago : body[index].pago,
                inhId: inhId,
                indtasa: tasa != null && tasa != undefined ? tasa.excAmount : null,
                excId: tasa != null && tasa != undefined ? tasa.excId : null,

            })
                .then(async (res) => {

                    if (body[index].mopId){

                    
                     await MonthlyPaymentModel.findOne({
                        where: {
                            mopId: res.mopId
                        }
                    }).then((resMonthlyPayment) => {
                    resMonthlyPayment.update({
                        mopAmount: res.indcosto,
                        mopAmountPaid: res.indpagado,
                        mopStatus: res.indcosto === res.indpagado ? 1 : 2
                    })
                        .then((resUpdateMonthlyPayment) => {
                            message = 'Mensualidad actualizada satisfactoriamente';
                            return { ok: true, data: resUpdateMonthlyPayment, message }
                        }, (err) => {
                            console.log('errrorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr---48',err)

                            return { ok: false, message: `Error al actualizar num Control: ${err}` }
                        })

                    }, (err) => {
                        console.log('errrorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr---55', err)
                        return { ok: false, message: `Error al buscar registro de Mensualidad: ${err}` }
                    })
                    // )
                    }else{
                        message = 'Pago resgitrado satisfactoriamente';
                        return { ok: true, data: resUpdateMonthlyPayment, message }
                    }
                    // messageRes = `Se agrego pago de mensualidades del estudiante ${body[index].indStuName}`;
                    // return { messge: messageRes }
                }, (err) => {
                    console.log('err.......................................63', JSON.stringify(err))
                    messageRes = `Error al cargar pago de mensualidades del estudiante ${body[index].indStuName}`;
                    return { ok: false, messge: messageRes }
                }))
        }

    } catch (err) {
        console.log('error al guardar factura', err)

        return { ok: false, message: 'error al guardar detalle de factura' }

    }

    return arrayRespuestas

}


module.exports = {
    addInvoiceDetail,
}