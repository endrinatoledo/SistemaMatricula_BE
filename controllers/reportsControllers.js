const { StatusCodes } = require('http-status-codes')
const Sequelize = require('sequelize');
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

const eliminarElementosRepetidos = (dataArray) => {

    let set = new Set(dataArray.map(JSON.stringify))
    let data = Array.from(set).map(JSON.parse);
    return data

}

const familyPayroll = async (req, res, next) => {

    try {

        let resultFamily = await InscriptionsModel.findAll({
            where: {
                perId: req.body.periodo.perId
            },
            include: [
                {
                    model: FamilyModel,
                    as: 'family',
                    require: true,
                },
                {
                    model: StudentModel,
                    as: 'student',
                    require: true
                },{
                    model: PeriodLevelSectionModel,
                    as: 'periodLevelSectionI',
                    require: true,
                    include:[
                      {
                        model: LevelsModel,
                        as: 'level',
                        require: true
                      },{
                        model: SectionsModel,
                        as: 'section',
                        require: true
                      }
                    ]
                  }
            ],
        })
        if (resultFamily.length > 0) {

            const arrayIdFamily = resultFamily.map((element)=>{
                return element.dataValues.famId
            })

            const familyFormateada = resultFamily.map((element) => {
                return { family: element.family.dataValues, representatives: [], students: [] }
            })

            const arraySinDuplicados = eliminarElementosRepetidos(arrayIdFamily)
            const familasSinDuplicados = eliminarElementosRepetidos(familyFormateada)

            let resultRepresentatives = await RepresentativeStudentModel.findAll({
                where: {
                    fam_id: {
                        [Op.in]: arraySinDuplicados
                    }
                },
                include: [
                    {
                    model: RepresentativeModel,
                    as: 'representative',
                    require: true
                  }
                  ],
                  group:'repId'
            })

            for (let index = 0; index < familasSinDuplicados.length; index++) {
                for (let index2 = 0; index2 < resultRepresentatives.length; index2++) {
                    if(resultRepresentatives[index2].dataValues.famId === familasSinDuplicados[index].family.famId){
                        familasSinDuplicados[index].representatives.push(resultRepresentatives[index2].dataValues.representative.dataValues)
                    }
                }
            }

            for (let indexF = 0; indexF < familasSinDuplicados.length; indexF++) {
                for (let indexE = 0; indexE < resultFamily.length; indexE++) {
                    if(resultFamily[indexE].dataValues.famId === familasSinDuplicados[indexF].family.famId){
                        const student = {
                            ...resultFamily[0].dataValues.student.dataValues,
                            level: resultFamily[0].dataValues.periodLevelSectionI.dataValues.level.dataValues,
                            section: resultFamily[0].dataValues.periodLevelSectionI.dataValues.section.dataValues
                        }
                        familasSinDuplicados[indexF].students.push(student)
                    }
                }
            }
            res.status(StatusCodes.OK).json({ ok: true, data: familasSinDuplicados })
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

module.exports = {
    reportByLevelAndSection,
    reportStatistics,
    familyPayroll,

}