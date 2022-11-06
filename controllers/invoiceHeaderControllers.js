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
            repId :req.body.familia[0].repId,
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

                    }else{
                        console.log('entro por 57')
                        //manejar error
                    }
                    // message = 'Concepto creado con éxito';
                    // res.status(StatusCodes.OK).json({ ok: true, data: invocideHeader, message })
                }, (err) => {
                    message = err
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message })
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


module.exports = {
    addInvoiceHeader,
}