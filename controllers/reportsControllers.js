const { StatusCodes } = require('http-status-codes')
const Sequelize = require('sequelize');
const { levelsModel } = require('../models');
const Op = Sequelize.Op
const db = require("../models");

const InscriptionsModel = db.inscriptionsModel
const PeriodLevelSectionModel = db.periodLevelSectionModel
const StudentModel = db.studentModel
const PeriodsModel = db.periodsModel
const LevelsModel = db.levelsModel
const SectionsModel = db.sectionsModel

const reportByLevelAndSection = async (req, res, next) => {

    try {

        let where = {
            perId: req.body.periodo.perId,
            levId: req.body.level.levId
        }
        if (req.body.section) {
            where.secId = req.body.section.secId
        }

        let resultPerLevSec = await PeriodLevelSectionModel.findAll(
            {
                where: where,
                attributes: ['pls_id']
            }
        ).catch((err) => {
            throw err;
        });

        if (resultPerLevSec.length > 0) {

            let arrayId = []

            resultPerLevSec.forEach(element => {
                arrayId.push(element.dataValues.pls_id)
            });

            InscriptionsModel.findAll({
                where: {
                    pls_id: {
                        [Op.in]: arrayId
                    }
                },
                include: [
                    {
                        model: StudentModel,
                        as: 'student',
                        require: true
                    }, {
                        model: PeriodLevelSectionModel,
                        as: 'periodLevelSectionI',
                        require: true,
                        include: [
                            {
                                model: LevelsModel,
                                as: 'level',
                                order: [['lev_id', 'ASC']],
                                require: true
                            }, {
                                model: SectionsModel,
                                as: 'section',
                                order: [['sec_id', 'ASC']],
                                require: true
                            }
                        ]
                    }]
            }).then((inscriptions) => {
                if (inscriptions.length > 0) {
                    let studentsArray = []
                    for (let index = 0; index < inscriptions.length; index++) {
                        const student = inscriptions[index].student
                        const level = inscriptions[index].periodLevelSectionI.level
                        const section = inscriptions[index].periodLevelSectionI.section

                        studentsArray.push({
                            stuId: student.stuId,
                            stuFirstName: student.stuFirstName,
                            stuSecondName: (student.stuSecondName) ? student.stuSecondName : '',
                            stuSurname: student.stuSurname,
                            stuSecondSurname: (student.stuSecondSurname) ? student.stuSecondSurname : '',
                            stuIdType: (student.stuIdType) ? student.stuIdType : '',
                            stuIdentificationNumber: (student.stuIdentificationNumber) ? student.stuIdentificationNumber : '',
                            stuDateOfBirth: student.stuDateOfBirth,
                            stuSex: student.stuSex,
                            levelName: level.dataValues.levName,
                            sectionName: section.dataValues.secName,
                        })
                    }
                    res.status(StatusCodes.OK).json({ ok: true, data: studentsArray })
                } else {
                    message = 'Sin datos para mostrar';
                    res.status(StatusCodes.OK).json({ ok: false, message })
                }

            }, (err) => {
                message = 'Error al consultar reporte'
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message })
                next(err)
            })

        } else {
            message = 'Sin resultados para mostrar';
            res.status(StatusCodes.OK).json({ ok: false, message })
        }

    } catch (error) {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message })
        next(err)
    }



}

const reportStatistics = async (req, res, next) => {
    console.log('reportStatistics')
    console.log('req', req.body)
}

const familyPayroll = async (req, res, next) => {
    console.log('familyPayroll')
    console.log('req', req.body)
}

module.exports = {
    reportByLevelAndSection,
    reportStatistics,
    familyPayroll,

}