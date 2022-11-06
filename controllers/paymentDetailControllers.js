
const { StatusCodes } = require('http-status-codes')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const db = require("../models");

const PaymentDetailModel = db.paymentDetailModel

const addPaymentDetail = async (invoiceHeader, body) => {

    let arrayRespuestas = []

    try {
        for (let index = 0; index < body.length; index++) {
            arrayRespuestas.push(await PaymentDetailModel.create({
                depCurrency: body[index].moneda,
                payId: body[index].metodoPago.payId,
                banId: body[index].banco != null ? body[index].banco.banId : null,
                inhId: invoiceHeader.dataValues.inhId,
                depAmount: body[index].monto,
                depCardNumber: body[index].tarjeta != null ? body[index].tarjeta : '',
                depApprovalNumber: body[index].referencia != null ? body[index].referencia : '',
                depObservation: body[index].observacion != null ? body[index].observacion : '',
            }).then((paymentDetail) => {
                message = 'Pago registrado con éxito ';
                return { ok: true, data: paymentDetail, message }
            }, (err) => {
                message = `Error al registrar pago`;
               return { ok: false, data: null, message }
            })   
            )
        }
        
    } catch (error) {
        console.log('Error al registrar pago', error)
        message = `Error de conexión al registrar pago`;
        return { ok: false, message };
    }
    return arrayRespuestas

}

module.exports = {
    addPaymentDetail
}