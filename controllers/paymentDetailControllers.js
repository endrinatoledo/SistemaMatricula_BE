
const { StatusCodes } = require('http-status-codes')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const db = require("../models");
const MonthlyPaymentModel = db.monthlyPaymentModel
const PeriodsModel = db.periodsModel
const InscriptionsModel = db.inscriptionsModel
const PeriodLevelSectionModel = db.periodLevelSectionModel
const StudentModel = db.studentModel
const FamilyModel = db.familyModel
const LevelsModel = db.levelsModel
const SectionsModel = db.sectionsModel
const PaymentDetailModel = db.paymentDetailModel

const addPaymentDetail = async (req, res) => {

    try {
        PaymentDetailModel.create({
            mopId: req.body.mopId,
            payId: req.body.payId,
            banId: req.body.banId,
            repId: req.body.repId,
            depAmount: req.body.depAmount,
            depCardNumber: req.body.depCardNumber,
            depApprovalNumber: req.body.depApprovalNumber,
            depDate: req.body.depDate,
            depObservation: req.body.depObservation,
            depInvoiceDescription: req.body.depInvoiceDescription,
            depStatus: req.body.depStatus,
        }).then((paymentDetail) => {
            message = 'Pago registrado con éxito ';
            res.status(StatusCodes.OK).json({ ok: true, data: paymentDetail, message })
        }, (err) => {
            message = `Error al registrar pago`;
            res.status(StatusCodes.OK).json({ ok: false, data: null, message })
        })
    } catch (error) {
        console.log('Error al registrar pago', error)
        message = `Error de conexión al registrar pago`;
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message });
        next(err);
    }

}

module.exports = {
    addPaymentDetail
}