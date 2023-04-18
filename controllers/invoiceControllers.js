const { StatusCodes } = require('http-status-codes')
const Sequelize = require('sequelize');
const moment = require('moment');

const { levelsModel, familyModel } = require('../models');
const Op = Sequelize.Op
const db = require("../models");

const InscriptionsModel = db.inscriptionsModel
const PeriodLevelSectionModel = db.periodLevelSectionModel
const StudentModel = db.studentModel
const FamilyModel = db.familyModel
const PeriodsModel = db.periodsModel
const LevelsModel = db.levelsModel
const SectionsModel = db.sectionsModel
const RepresentativeModel = db.representativeModel
const RepresentativeStudentModel = db.representativeStudentModel
const MonthlyPaymentModel = db.monthlyPaymentModel
const InvoiceHeaderModel = db.invoiceHeaderModel
const PaymentDetailModel = db.paymentDetailModel
const InvoiceDetailModel = db.invoiceDetailModel
const PaymentMethodsModel = db.paymentMethodsModel
const BanksModel = db.banksModel

const getFacturasPorFiltro = async (req, res, next) => {

    try {
        let whereValue = { perId: req.body.period.perId }
        if (req.body.numCompro) whereValue = { ...whereValue, inhControlNumber: req.body.numCompro }
        if (req.body.rif) whereValue = { ...whereValue, inhRifCed: req.body.rif }
        if (req.body.razonSocial) whereValue = { ...whereValue, inhBusinessName: { [Op.substring]: req.body.razonSocial } }
        if (req.body.fechaI && req.body.fechaF) {
            const fechaI = moment(moment(req.body.fechaI, 'YYYY-MM-DD').toDate()).format("YYYY-MM-DD")
            const fechaF = moment(moment(req.body.fechaF, 'YYYY-MM-DD').toDate()).format("YYYY-MM-DD")

            whereValue = {
                ...whereValue, inhDateCreate: {
                    [Op.between]: [fechaI, fechaF]
                }
            }
        }else{
            if (req.body.fechaI || req.body.fechaF) whereValue = { ...whereValue, inhDateCreate: req.body.fechaI ? moment(moment(req.body.fechaI, 'YYYY-MM-DD').toDate()).format("YYYY-MM-DD") : moment(moment(req.body.fechaF, 'YYYY-MM-DD').toDate()).format("YYYY-MM-DD") }
        }

        InvoiceHeaderModel.findAll({
            where: whereValue
        }).then(async (resultInvoiceHeader) => {
            if (resultInvoiceHeader.length > 0) {
                const idInvoicesHeader = resultInvoiceHeader.map(item => item.dataValues.inhId)

                const invoiceDetail = await InvoiceDetailModel.findAll({
                    where: {
                        inh_id: {
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

                const ordenarData = resultInvoiceHeader.map(item => {
                    const itemsPaymentDetail = paymentDetail.filter(element => element.dataValues.inhId === item.dataValues.inhId)
                    const itemsInvoiceDetail = invoiceDetail.filter(element => {
                        if (element.dataValues.inhId === item.dataValues.inhId) {
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
                        fecha: item.dataValues.inhDate,
                        cuerpo: itemsInvoiceDetail,
                        cabecera: item,
                        pago: itemsPaymentDetail,
                        razon: item.inhBusinessName,
                        numControl: item.inhControlNumber,
                        numFact: item.inhInvoiceNumber ? item.inhInvoiceNumber : '',
                        ciRif: item.inhRifCed


                    }
                })

                res.status(StatusCodes.OK).json({ ok: true, data: ordenarData })

            } else {
                res.status(StatusCodes.OK).json({ ok: false, data: [], message: 'Sin datos para mostrar' })
            }

        }, (err) => {
            console.log('error al consultar facturas', err)
            message = 'Error al consultar facturas'
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, data: [],message })
            next(err)
        })
    } catch (error) {

    }
}

module.exports = {
    getFacturasPorFiltro
}