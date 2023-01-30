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
const PaymentMethodsModel = db.paymentMethodsModel
const BanksModel = db.banksModel

const addInvoiceHeader = async (req, res, next) => {

    // if (req.body.icoName === '' || req.body.icoStatus === 0) return res.status(406).json({ ok: false, message: 'Todos los campos son obligatorios' });
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
            inhWayToPay:''
        })
                .then(async (invoiceHeader) => {

                    if (invoiceHeader.dataValues != undefined && invoiceHeader.dataValues != null){

                        const actualizarNumFactura = await updateInvoiceNumber(numFactura.data.dataValues.nuiId)
                        if (req.body.cabecera.voucherType !== 'FACTURA FISCAL') {
                            const actualizarNumComprobante = await updateControlNumber(numComprobante.data.dataValues.nucId)
                        }
                        const detailInvoice = await addInvoiceDetail(req.body.cuerpo, invoiceHeader.dataValues.inhId, req.body.tasa )
                        const addPaymentDetailRes = await addPaymentDetail(invoiceHeader, req.body.detallePagos, req.body.tasa)

                        // console.log('detailInvoice***************************************************', detailInvoice) 
                        console.log('addPaymentDetailRes------------------------------------', addPaymentDetailRes)

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
                        const itemsInvoiceDetail = invoiceDetail.filter(element => element.dataValues.inhId === item.dataValues.inhId )
                        const itemsPaymentDetail = paymentDetail.filter(element => element.dataValues.inhId === item.dataValues.inhId)

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
                console.log('error al consultar periodo y familia', err)
                message = 'error al consultar periodo y familia'
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message })
                // next(err)
            })

        
    } catch (error) {
        console.log('error al consultar pagos de familia')
        message = 'Error al consultar pagos por familia';
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message });
        next(err);
    }

}

module.exports = {
    addInvoiceHeader,
    buscarFacturasPorFamilia,
}