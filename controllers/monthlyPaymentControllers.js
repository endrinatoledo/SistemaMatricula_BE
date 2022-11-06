const { StatusCodes } = require('http-status-codes')
const { LowercaseString, FirstCapitalLetter } = require('../utils/functions')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const db = require("../models");

const MonthlyPaymentModel = db.monthlyPaymentModel

const updateMonthlyPayment = async (body) => {

    let arrayRespuestas = []
    try {
        for (let index = 0; index < body.length; index++) {

            arrayRespuestas.push(await MonthlyPaymentModel.findOne({
                where: {
                    mopId: body[index].mopId
                }
            })
                .then((resMonthlyPayment) => {


                    resMonthlyPayment.update({
                        mopAmount: 'mopAmount',
                        mopAmountPaid: 'mopAmountPaid',
                        mopStatus: 'mopStatus'
                    })
                        .then((resUpdateMonthlyPayment) => {
                            message = 'Mensualidad actualizada satisfactoriamente';
                            return { ok: true, data: resUpdateMonthlyPayment, message }
                        }, (err) => {
                            return { ok: false, message: `Error al actualizar num Control: ${err}` }
                        })


                    console.log('res', JSON.stringify(res))
                    messageRes = `Se agrego pago de mensualidades del estudiante ${body[index].indStuName}`;
                    return { messge: messageRes }
                }, (err) => {
                    console.log('err', JSON.stringify(err))
                    messageRes = `Error al consultar mensualidades del estudiante ${body[index].indStuName}`;
                    return { messge: messageRes }
                }))
        }

        return arrayRespuestas
    } catch (error) {
        return { ok: false, message: `Error en try al consultar num Control: ${err}` }

    }

}


module.exports = {
    updateMonthlyPayment,
}