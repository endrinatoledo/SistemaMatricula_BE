const { StatusCodes } = require('http-status-codes')
const { LowercaseString, FirstCapitalLetter } = require('../utils/functions')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const db = require("../models");
const moment = require('moment');

const { updateInvoiceNumber } = require('./invoiceNumberControllers')
const { updateControlNumber } = require('./controlNumberControllers')
const { addInvoiceDetail2, addInvoiceDetailConceptosAdicionales } = require('./invoiceDetailControllers')
const { addPaymentDetail } = require('./paymentDetailControllers')
const { addConceptosAdicionales } = require('./conceptosAdicionalesController')
const InvoiceHeaderModel = db.invoiceHeaderModel
const InvoiceNumberModel = db.invoiceNumberModel
const ControlNumberModel = db.controlNumberModel
const PeriodsModel = db.periodsModel
const InvoiceDetailModel = db.invoiceDetailModel
const PaymentDetailModel = db.paymentDetailModel
const PaymentMethodsModel = db.paymentMethodsModel
const BanksModel = db.banksModel
const MonthlyPaymentModel = db.monthlyPaymentModel

// Update matricula7.invoice_header Set inh_status_fact = 'ACTIVA'

const addInvoiceHeader = async (req, res, next) => {

    // console.log('---------------------------',req.body)
   try {

        let numComprobante = ''

        if (req.body.cabecera.voucherType !== 'FACTURA FISCAL'){
            numComprobante = await ControlNumberModel.findOne({
                order: [['nuc_id', 'DESC']],
            })
                .then((result) => {
                    return { ok: true, data: result, resultF: result.dataValues.nucValue }
                }, (err) => {
                    message = err
                    return { ok: false, message }
                })
        }

        const numFactura = await InvoiceNumberModel.findOne({
            order: [['nui_id', 'DESC']],
        })
            .then((result) => {
                return { ok: true, data: result, resultF: result.dataValues.nuiValue }
            }, (err) => {
                return { ok: false, message: err }
            })
       const fechaActual = new Date();
       const fechaISO = fechaActual.toISOString().slice(0, 10);
        InvoiceHeaderModel.create({
            perId: req.body.periodo.perId,
            famId :req.body.familia[0].famId,
            inhBusinessName : req.body.cabecera.razonSocial,
            inhRifCed: req.body.cabecera.identificacion,
            inhAddress :req.body.cabecera.address,
            inhPhone :req.body.cabecera.phones,
            inhDate :req.body.cabecera.date,
            inhControlNumber: (req.body.cabecera.voucherType !== 'FACTURA FISCAL') ? numComprobante.resultF : '', 
            inhInvoiceNumber:  numFactura.resultF,
            inhWayToPay:'',
            inhDateCreate: fechaISO,  


            // inhDateCreate: moment(new Date(req.body.cabecera.date)).format("DD/MM/YYYY"),
            inhStatusFact:'ACTIVA'
        })
                .then(async (invoiceHeader) => {

                    if (invoiceHeader.dataValues != undefined && invoiceHeader.dataValues != null){

                        const actualizarNumFactura = await updateInvoiceNumber(numFactura.data.dataValues.nuiId)
                        if (req.body.cabecera.voucherType !== 'FACTURA FISCAL') {
                            const actualizarNumComprobante = await updateControlNumber(numComprobante.data.dataValues.nucId)
                        }


                    
                        //--- validar aqui si viene el cuerpo
                        if (Array.isArray(req.body.conceptosAdicionales) && req.body.conceptosAdicionales.length > 0){
                            console.log('entro aquii')
                            const detailInvoiceConAdi = await addInvoiceDetailConceptosAdicionales(req.body.conceptosAdicionales, invoiceHeader.dataValues.inhId, req.body.tasa)
                            const addConAdi = await addConceptosAdicionales(req.body.conceptosAdicionales, invoiceHeader.dataValues.inhId, req.body.tasa, req.body.periodo.perId)
                        }
                        if (Array.isArray(req.body.cuerpo) && req.body.cuerpo.length > 0) {
                            const detailInvoice = await addInvoiceDetail2(req.body.cuerpo, invoiceHeader.dataValues.inhId, req.body.tasa)
                        }

                        const addPaymentDetailRes = await addPaymentDetail(invoiceHeader, req.body.detallePagos, req.body.tasa)
                        
                        setTimeout(() => {
                            res.status(StatusCodes.OK).json({ ok: true, message: 'Registro Creado con éxito' })
                        }, 5000);
                        
                    }else{
                        res.status(StatusCodes.OK).json({ ok: false, message: 'Error al crear registro' })
                    }
                }, (err) => {
                    // console.log('errorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr7+6: ', err)
                    message = 'Error al crear cabecera de factura '
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message })
                    next(err)
                })
        .catch((err) => {
            throw err;
        });


    } catch (err) {
        // console.log('error al guardar factura', err)
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
                famId: req.params.famId,
                inhStatusFact: 'ACTIVA'
            }
        })
            .then(async (resultInvoiceHeader) => {

                if (resultInvoiceHeader.length > 0) {
                    const idInvoicesHeader = resultInvoiceHeader.map( item => item.dataValues.inhId)

                    const invoiceDetail = await InvoiceDetailModel.findAll({
                        where: {
                            inh_id:{
                                [Op.in]: idInvoicesHeader
                            }                            
                        }
                    })
                    const paymentDetail = await PaymentDetailModel.findAll({
                        where: {
                            inh_id: {
                                [Op.in]: idInvoicesHeader
                            }
                        },
                        include: [
                            {
                            model: PaymentMethodsModel,
                            as: 'paymentMethodsPay',
                            require: true
                        },
                        {
                            model: BanksModel,
                            as: 'banksPay',
                            require: true
                        }
                    ]
                    })

                    const ordenarData = resultInvoiceHeader.map(item =>{
                        const itemsPaymentDetail = paymentDetail.filter(element => element.dataValues.inhId === item.dataValues.inhId)
                        const itemsInvoiceDetail = invoiceDetail.filter(element => {
                            if (element.dataValues.inhId === item.dataValues.inhId){
                                return {
                                    montoRealDetalle: (Number(itemsPaymentDetail[0].dataValues.depAmount) * parseFloat(itemsPaymentDetail[0].dataValues.deptasa)).toFixed(2),
                                        indId: element.dataValues.indId,
                                        mopId: element.dataValues.mopId,
                                        indStuName: element.dataValues.indStuName,
                                        indDescripcion: element.dataValues.indDescripcion,
                                        indcosto: element.dataValues.indcosto,
                                        indpagado: element.dataValues.indpagado,
                                        indtasa: element.dataValues.indtasa,
                                        excId: element.dataValues.excId,
                                        inhId: element.dataValues.inhId,
                                    }
                            }
                            
                        })
                        return {
                            fecha:item.dataValues.inhDate,
                            cuerpo: itemsInvoiceDetail,
                            cabecera: item,
                            pago: itemsPaymentDetail
                        }
                        })
                    
                    res.status(StatusCodes.OK).json({ ok: true, data: ordenarData}) 

                }else{
                    res.status(StatusCodes.OK).json({ ok: false, data: [], message: 'Sin datos para mostrar' }) 
                }
                
            }, (err) => {
                // console.log('error al consultar periodo y familia', err)
                message = 'error al consultar periodo y familia'
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message })
                // next(err)
            })

        
    } catch (error) {
        // console.log('error al consultar pagos de familia')
        message = 'Error al consultar pagos por familia';
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message });
        next(err);
    }

}

const anularFactura= async (req, res, next) => {

    const arrayIdMop = req.body.arrayIdMop
    try {
        InvoiceHeaderModel.findOne({
            where: {
                inhId: req.params.inhId
            }
        }).then((invoice) => {
            invoice.update({
                inhStatusFact: 'ANULADA',
            })
                .then(async (resultUpdateInvoice) => {
                    if (resultUpdateInvoice?.dataValues?.inhStatusFact == 'ANULADA'){
                        
                        const actualizarArrayEstatusMeses = await actualizarEstatusMeses(arrayIdMop)
                        
                        message = 'Anulacion realizada con éxito';
                    res.status(StatusCodes.OK).json({ ok: true, message })
                    }else{
                        message = 'U - Error al anular factura'
                        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message })
                        next(err)
                    }
                    
                }, (err) => {
                    message = 'T - Error al anular factura'
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message })
                    next(err)
                })
        }, (err) => {
            message = err
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message })
            next(err)
        })
    } catch (error) {
        message = 'C - Error al anular factura'
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message })
        next(err)
    }
}

const actualizarEstatusMeses = async (array) => {

    try {
        const promises = array.map(function (element) {
            return MonthlyPaymentModel.findOne({
                where: {
                    mopId: element.mopId
                }
            })
                .then((resMonthlyPayment) => {
                    const monto = resMonthlyPayment.dataValues.mopAmountPaid - parseFloat(element.montoDol)
                    resMonthlyPayment.update({
                        mopStatus: 2,
                        mopAmountPaid: monto - 1 ? 0 : monto
                    }).then((resUpdateMonthlyPayment) => {
                        message = 'actualizado satisfactoriamente';
                        return { ok: true, data: resUpdateMonthlyPayment, message }
                    }, (err) => {
                        return { ok: false, message: `T - Error al actualizar ${err}` }
                    })
                }, (err) => {
                    return { ok: false, message: `C - Error al actualizar ${err}` }                    
                })
        })

        Promise.all(promises).then(function (result) {
            if (result.length > 0) {
                const endData = result.filter((item) => item !== undefined)
                return { ok: true, data: endData }
            } else {
                return { ok: true, data: result }
            }
        })
    } catch (error) {
        return { ok: false, message: `Error en catch al actualizar registro: ${err}` }
    }
}

module.exports = {
    addInvoiceHeader,
    buscarFacturasPorFamilia,
    anularFactura,
}