const { StatusCodes } = require('http-status-codes')
const { LowercaseString, FirstCapitalLetter } = require('../utils/functions')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const db = require("../models");
const data = require('../../SistemaMatricula_FE/src/components/config/config');

const MonthlyPaymentModel = db.monthlyPaymentModel
const InvoiceHeaderModel = db.invoiceHeaderModel

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


                    // console.log('res', JSON.stringify(res))
                    messageRes = `Se agrego pago de mensualidades del estudiante ${body[index].indStuName}`;
                    return { messge: messageRes }
                }, (err) => {
                    // console.log('err', JSON.stringify(err))
                    messageRes = `Error al consultar mensualidades del estudiante ${body[index].indStuName}`;
                    return { messge: messageRes }
                }))
        }

        return arrayRespuestas
    } catch (error) {
        return { ok: false, message: `Error en try al consultar num Control: ${err}` }
    }

}

const mensualidadesExoneradas =  async (req, res, next) => {
    
    let arrayRespuestas = []
    try {
        for (let index = 0; index < req.body.length; index++) {
            arrayRespuestas.push(await MonthlyPaymentModel.findOne({
                where: {
                    mopId: req.body[index].mopId
                }
            })
                .then((resMonthlyPayment) => {

                    resMonthlyPayment.update({
                        mopStatus: 1,
                        mopExonerated: 1
                    })
                        .then((resUpdateMonthlyPayment) => {
                            message = 'Mensualidad exonerada satisfactoriamente';
                            return { ok: true, data: resUpdateMonthlyPayment, message }
                        }, (err) => {
                            return { ok: false, message: `Error exonerando mensualidad: ${err}` }
                        })
                    messageRes = `Se agrego pago de mensualidades del estudiante`;
                    return { messge: messageRes }
                }, (err) => {
                    messageRes = `Error al consultar mensualidades del estudiante `;
                    return { messge: messageRes }
                }))
        }
        return res.status(StatusCodes.OK).json({ ok: true, data: arrayRespuestas, message:'Mesualidades exoneradas correctamemte' })

    } catch (error) {
        let message = `Error al actualizar la exoneracion de mensualidades:`
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message });
    }

}

// const getMonthlyPaymentByFamId = async (req, res, next) => {

//     let dataFinal = [
//         {mes: 'Enero', data:[]},
//         { mes: 'Febrero', data: [] },
//         { mes: 'Marzo', data: [] },
//         { mes: 'Abril', data: [] },
//         { mes: 'Mayo', data: [] },
//         { mes: 'Junio', data: [] },
//         { mes: 'Julio', data: [] },
//         { mes: 'Agosto', data: [] },
//         { mes: 'Septiembre', data: [] },
//         { mes: 'Octubre', data: [] },
//         { mes: 'Noviembre', data: [] },
//         { mes: 'Diciembre', data: [] },
//     ]

//     try {

//         MonthlyPaymentModel.findAll({
//             where: {
//                 famId: req.params.famId
//             }
//         })
//             .then((monthlyPaymentRes) => {

//                 if (monthlyPaymentRes.length > 0){

//                     const arrayMopId = monthlyPaymentRes.map((item) => item.mopId)
//                     console.log('----------------', arrayMopId)

//                     InvoiceHeaderModel.findAll({
//                         where: {
//                             mop_id: {
//                                     [Op.in]: arrayMopId
//                             }
//                     },
//                     }).then((invoiceHeaderModelRes) => {

//                         if (invoiceHeaderModelRes.length > 0) {
                            
//                         }else{
//                             message: 'Sin datos para mostrar en cabecera de facturas'
//                             console.log(message)
//                             res.status(StatusCodes.OK).json({ ok: false, message: message, data: [] })
//                         }

//                      }, (err) => {
                        
//                         message = 'Error consultando cabecera de facturas';
//                         console.log(message,'-', err)
//                         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message })
//                         next(err)
//                     })
//                     res.status(StatusCodes.OK).json({ ok: true, data: monthlyPaymentRes })
//                 }else{
//                     message: 'Sin datos para mostrar en mensualidad de familias'
//                     console.log(message)
//                     res.status(StatusCodes.OK).json({ ok: false, message: message, data:[] })
//                 }
                

                
//             }, (err) => {
//                 console.log('Error consultando pago de mensualidades por familia',err)
//                 message = 'Error consultando pago de mensualidades por familia';
//                 res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message })
//                 next(err)
//             })

        
//     } catch (error) {
//         console.log('error al consultar getMonthlyPaymentByFamId', error)
//         message = 'Error al consultar pago de mensualidades por familia';
//         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message });
//         next(err);
//     }
// }


module.exports = {
    updateMonthlyPayment,
    mensualidadesExoneradas,
    // getMonthlyPaymentByFamId,
}