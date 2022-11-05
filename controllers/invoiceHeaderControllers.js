const { StatusCodes } = require('http-status-codes')
const { LowercaseString, FirstCapitalLetter } = require('../utils/functions')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const db = require("../models");

const InvoiceHeaderModel = db.invoiceHeaderModel

const addInvoiceHeader = async (req, res, next) => {

    console.log('llego aquiiii-----------------------------------------------', req.body)
    // if (req.body.icoName === '' || req.body.icoStatus === 0) return res.status(406).json({ ok: false, message: 'Todos los campos son obligatorios' });
    try {

        InvoiceHeaderModel.create({
            repId :req.body.familia[0].repId,
            inhBusinessName : req.body.cabecera.razonSocial,
            inhRifCed: req.body.cabecera.identificacion,
            inhAddress :req.body.cabecera.address,
            inhPhone :req.body.cabecera.phones,
            inhDate :req.body.cabecera.date,
            inhControlNumber :11,
            inhInvoiceNumber : 11,
            inhWayToPay:''
        })
                .then((invocideHeader) => {
                 console.log('*****************************invocideHeader', invocideHeader)
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