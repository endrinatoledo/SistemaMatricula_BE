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
const InvoiceDetailModel = db.invoiceDetailModel
const PaymentDetailModel = db.paymentDetailModel

const addInvoiceHeader = async (req, res, next) => {

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
                        
                        const detailInvoice = await addInvoiceDetail(req.body.cuerpo, invoiceHeader.dataValues.inhId )
                        const addPaymentDetailRes = await addPaymentDetail(invoiceHeader, req.body.detallePagos)

                        setTimeout(() => {
                            res.status(StatusCodes.OK).json({ ok: true, message: 'Registro Creado con éxito' })
                        }, 5000);
                        
                    }else{
                        res.status(StatusCodes.OK).json({ ok: false, message: 'Error al crear registro' })
                    }
                }, (err) => {
                    console.log('errorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr7+6: ', err)
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
            { mes: 'Enero', data: [] }, // posicion 0
            { mes: 'Febrero', data: [] },// posicion 1
            { mes: 'Marzo', data: [] },// posicion 2
            { mes: 'Abril', data: [] },// posicion 3
            { mes: 'Mayo', data: [] },// posicion 4
            { mes: 'Junio', data: [] },// posicion 5
            { mes: 'Julio', data: [] },// posicion 6
            { mes: 'Agosto', data: [] },// posicion 7
            { mes: 'Septiembre', data: [] },// posicion 8
            { mes: 'Octubre', data: [] },// posicion 9
            { mes: 'Noviembre', data: [] },// posicion 10
            { mes: 'Diciembre', data: [] },// posicion 11
    ]

    // let dataFinal = []

    try {

        InvoiceHeaderModel.findAll({
            where: {
                perId: req.params.perId,
                famId: req.params.famId
            }
        })
            .then((resultInvoiceHeader) => {

                if (resultInvoiceHeader.length > 0){

                    resultInvoiceHeader.forEach(async element => {
                        const fechaC = (element.dataValues.inhDate).split('/')

                        const cabecera = {
                            inhId: element.dataValues.inhId,
                            famId: element.dataValues.famId,
                            perId: element.dataValues.perId,
                            inhBusinessName: element.dataValues.inhBusinessName,
                            inhRifCed: element.dataValues.inhRifCed,
                            inhAddress: element.dataValues.inhAddress,
                            inhPhone: element.dataValues.inhPhone,
                            inhDate: element.dataValues.inhDate,
                            inhControlNumber: element.dataValues.inhControlNumber,
                            inhInvoiceNumber: element.dataValues.inhInvoiceNumber,
                            inhWayToPay: element.dataValues.inhWayToPay,
                        }

                        InvoiceDetailModel.findAll({
                            where: {
                                inhId: element.dataValues.inhId
                            }
                        })
                            .then((respuestaInvoiceDetailModel) => {
                                if (respuestaInvoiceDetailModel.length > 0){

                                    const cuerpoFactura = respuestaInvoiceDetailModel.map(cuerpo => {                                                                           
                                        return {
                                            indId: cuerpo.dataValues.indId,
                                            mopId: cuerpo.dataValues.mopId,
                                            indStuName: cuerpo.dataValues.indStuName,
                                            indDescripcion: cuerpo.dataValues.indDescripcion,
                                            indcosto: cuerpo.dataValues.indcosto,
                                            indpagado: cuerpo.dataValues.indpagado,
                                            inhId: cuerpo.dataValues.inhId,
                                        }
                                       } )

                                    PaymentDetailModel.findAll({
                                        where: {
                                            inhId: element.dataValues.inhId
                                        }
                                    }).then((respuestaPaymentDetailModel) => { 
                                        if (respuestaPaymentDetailModel.length > 0) {
                                            const detalleDePago = respuestaPaymentDetailModel.map(detalle => {
                                                return {
                                                    depId: detalle.dataValues.depId,
                                                    depCurrency: detalle.dataValues.depCurrency,
                                                    payId: detalle.dataValues.payId,
                                                    banId: detalle.dataValues.banId,
                                                    inhId: detalle.dataValues.inhId,
                                                    depAmount: detalle.dataValues.depAmount,
                                                    depCardNumber: detalle.dataValues.depCardNumber,
                                                    depApprovalNumber: detalle.dataValues.depApprovalNumber,
                                                    depObservation: detalle.dataValues.depObservation,
                                                }
                                            })
                                            const facturaObjeto = {
                                                cabecera: cabecera,
                                                cuerpoFactura: cuerpoFactura,
                                                detalleDePago: detalleDePago
                                            }

                                            // dataFinal.push(facturaObjeto)

                                            if (fechaC[1] === '1' || fechaC[1] === '01') {
                                                dataFinal[0].data.push(facturaObjeto)
                                            }
                                            if (fechaC[1] === '2' || fechaC[1] === '02') {
                                                dataFinal[1].data.push(facturaObjeto)
                                            }
                                            if (fechaC[1] === '3' || fechaC[1] === '03') {
                                                dataFinal[2].data.push(facturaObjeto)
                                            }
                                            if (fechaC[1] === '4' || fechaC[1] === '04') {
                                                dataFinal[3].data.push(facturaObjeto)
                                            }
                                            if (fechaC[1] === '5' || fechaC[1] === '05') {
                                                dataFinal[4].data.push(facturaObjeto)
                                            }
                                            if (fechaC[1] === '6' || fechaC[1] === '06') {
                                                dataFinal[5].data.push(facturaObjeto)
                                            }
                                            if (fechaC[1] === '7' || fechaC[1] === '07') {
                                                dataFinal[6].data.push(facturaObjeto)
                                            }
                                            if (fechaC[1] === '8' || fechaC[1] === '08') {
                                                dataFinal[7].data.push(facturaObjeto)
                                            }
                                            if (fechaC[1] === '9' || fechaC[1] === '09') {
                                                dataFinal[8].data.push(facturaObjeto)
                                            }
                                            if (fechaC[1] === '10' || fechaC[1] === '10') {
                                                dataFinal[9].data.push(facturaObjeto)
                                            }
                                            if (fechaC[1] === '11' || fechaC[1] === '11') {
                                                dataFinal[10].data.push(facturaObjeto)
                                            }
                                            if (fechaC[1] === '12' || fechaC[1] === '12') {
                                                dataFinal[11].data.push(facturaObjeto)
                                            }

                                            res.status(StatusCodes.OK).json({ ok: true, data: dataFinal }) 

                                        }else{
                                            console.log('sin datos de detalle de pago de factura para mostrar')
                                            res.status(StatusCodes.OK).json({ ok: false, data: [], message: 'sin datos de detalle de pago de factura para mostrar'}) 
                                        }
                                    }, (err) => {
                                        console.log('error consultando detalle de pago de factura por inhId :', err)
                                        message = 'error consultando detalle de pago de factura por inhId '
                                        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message })
                                    })

                                }else{
                                    console.log('sin datos de cuerpo de factura para mostrar')
                                    res.status(StatusCodes.OK).json({ ok: false, data: [], message: 'Sin datos para mostrar' }) 
                                }
                                // res.status(StatusCodes.OK).json({ ok: true, data: respuesta })
                            }, (err) => {
                                console.log('error consultando detalle de factura por inhId :', err)
                                message = 'error consultando detalle de factura por inhId '
                                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message })
                                // result = { ok: false, message: message, data: null }

                            })


                        

                        // console.log('.................................dataFinal', dataFinal[10])
                        
                    });
                }else{
                    res.status(StatusCodes.OK).json({ ok: false, data: [], message:'Sin datos para mostrar' }) 
                }
                
            }, (err) => {
                console.log('error al consultar periodo y familia', err)
                message = 'error al consultar periodo y familia'
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

module.exports = {
    addInvoiceHeader,
    buscarFacturasPorFamilia,
}