const { StatusCodes } = require('http-status-codes')
const { LowercaseString, FirstCapitalLetter } = require('../utils/functions')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const db = require("../models");
const { updateInvoiceNumber } = require('./invoiceNumberControllers')
const { updateControlNumber } = require('./controlNumberControllers')
const { addInvoiceDetail } = require('./invoiceDetailControllers')
const { addPaymentDetail } = require('./paymentDetailControllers')
const InvoiceHeaderModel = db.invoiceHeaderModel
const InvoiceNumberModel = db.invoiceNumberModel
const ControlNumberModel = db.controlNumberModel
const PeriodsModel = db.periodsModel

const addInvoiceHeader = async (req, res, next) => {

    console.log('.................................................', req.body.periodo)

    // if (req.body.icoName === '' || req.body.icoStatus === 0) return res.status(406).json({ ok: false, message: 'Todos los campos son obligatorios' });
    try {

        const numComprobante = await ControlNumberModel.findOne({
            order: [['nuc_id', 'DESC']],
        })
            .then((result) => {
                return { ok: true, data: result, resultF: result.dataValues.nucValue }
            }, (err) => {
                message = err
                return { ok: false, message }
            })

        const numFactura = await InvoiceNumberModel.findOne({
            order: [['nui_id', 'DESC']],
        })
            .then((result) => {
                return { ok: true, data: result, resultF: result.dataValues.nuiValue }
            }, (err) => {
                return { ok: false, message: err }
            })

        InvoiceHeaderModel.create({
            perId: req.body.periodo.perId,
            famId :req.body.familia[0].famId,
            inhBusinessName : req.body.cabecera.razonSocial,
            inhRifCed: req.body.cabecera.identificacion,
            inhAddress :req.body.cabecera.address,
            inhPhone :req.body.cabecera.phones,
            inhDate :req.body.cabecera.date,
            inhControlNumber: numComprobante.resultF, 
            inhInvoiceNumber:  numFactura.resultF,
            inhWayToPay:''
        })
                .then(async (invoiceHeader) => {

                    if (invoiceHeader.dataValues != undefined && invoiceHeader.dataValues != null){

                        const actualizarNumFactura = await updateInvoiceNumber(numFactura.data.dataValues.nuiId)
                        const actualizarNumComprobante = await updateControlNumber(numComprobante.data.dataValues.nucId)

                        const detailInvoice = await addInvoiceDetail(req.body.cuerpo, numFactura.resultF)
                        const addPaymentDetailRes = await addPaymentDetail(invoiceHeader, req.body.detallePagos)

                        console.log('actualizarNumComprobante', actualizarNumComprobante)

                        // if (addPaymentDetailRes.length > 0 ){

                        // }
                        setTimeout(() => {
                            res.status(StatusCodes.OK).json({ ok: true, message: 'Registro Creado con éxito' })
                        }, 5000);
                        
                    }else{
                        res.status(StatusCodes.OK).json({ ok: false, message: 'Error al crear registro' })
                    }
                }, (err) => {
                    console.log('error: ', err)
                    message = 'Error al crear cabecera de factura '
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message })
                    next(err)
                })
        .catch((err) => {
            throw err;
        });


    } catch (err) {
        console.log('error al guardar factura', err)
        message = err;
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message });
        next(err);
    }

}

const buscarFacturasPorFamilia = async (req, res, next) => {
    
        let dataFinal = [
        { mes: 'Enero', data: [] },
        { mes: 'Febrero', data: [] },
        { mes: 'Marzo', data: [] },
        { mes: 'Abril', data: [] },
        { mes: 'Mayo', data: [] },
        { mes: 'Junio', data: [] },
        { mes: 'Julio', data: [] },
        { mes: 'Agosto', data: [] },
        { mes: 'Septiembre', data: [] },
        { mes: 'Octubre', data: [] },
        { mes: 'Noviembre', data: [] },
        { mes: 'Diciembre', data: [] },
    ]

    try {

        PeriodsModel.findOne({
            where: {
                perId: req.params.perId
            }
        })
            .then((period) => {
                // res.status(StatusCodes.OK).json({ ok: true, data: period })
            }, (err) => {
                console.log('error al consultar periodo por id', err)
                message = 'error al consultar periodo por id'
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message })
                next(err)
            })

        
    } catch (error) {
        console.log('error al consultar pagos de familia')
        message = 'Error al consultar pagos por familia';
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message });
        next(err);
    }

    console.log('llego a buscar facturas----------------------------------------', req.params)

}


// const getMonthlyPaymentByFamId = async (req, res, next) => {

//     let dataFinal = [
//         { mes: 'Enero', data: [] },
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

//                 if (monthlyPaymentRes.length > 0) {

//                     const arrayMopId = monthlyPaymentRes.map((item) => item.mopId)
//                     console.log('----------------', arrayMopId)

//                     InvoiceHeaderModel.findAll({
//                         where: {
//                             mop_id: {
//                                 [Op.in]: arrayMopId
//                             }
//                         },
//                     }).then((invoiceHeaderModelRes) => {

//                         if (invoiceHeaderModelRes.length > 0) {

//                         } else {
//                             message: 'Sin datos para mostrar en cabecera de facturas'
//                             console.log(message)
//                             res.status(StatusCodes.OK).json({ ok: false, message: message, data: [] })
//                         }

//                     }, (err) => {

//                         message = 'Error consultando cabecera de facturas';
//                         console.log(message, '-', err)
//                         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message })
//                         next(err)
//                     })
//                     res.status(StatusCodes.OK).json({ ok: true, data: monthlyPaymentRes })
//                 } else {
//                     message: 'Sin datos para mostrar en mensualidad de familias'
//                     console.log(message)
//                     res.status(StatusCodes.OK).json({ ok: false, message: message, data: [] })
//                 }



//             }, (err) => {
//                 console.log('Error consultando pago de mensualidades por familia', err)
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
    addInvoiceHeader,
    buscarFacturasPorFamilia,
}