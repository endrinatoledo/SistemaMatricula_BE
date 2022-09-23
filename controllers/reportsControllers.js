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
const MonthlyPaymentModel = db.monthlyPaymentModel


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
                    },
                    insStatus: 1
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
                            stuSex: student.stuSex === 'f' ? 'Femenino' : 'Masculino',
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

    try {

        let levels = await LevelsModel.findAll({})

        let resultInscription = await InscriptionsModel.findAll({
            where: {
                perId: req.body.periodo.perId,
                insStatus: 1
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
                            require: true
                        }
                    ]
                }
            ],
        })

        if (levels.length > 0 && resultInscription.length > 0) {

            const levelsFormat = levels.map((element) => {
                return { levId: element.dataValues.levId, levName: element.dataValues.levName, students: 0, boys: 0, girls: 0 }
            })

            for (let index = 0; index < levelsFormat.length; index++) {
                for (let index2 = 0; index2 < resultInscription.length; index2++) {
                    if (levelsFormat[index].levId === resultInscription[index2].dataValues.periodLevelSectionI.levId) {
                        levelsFormat[index].students = levelsFormat[index].students + 1
                        if (resultInscription[index2].dataValues.student.dataValues.stuSex === 'f') {
                            levelsFormat[index].girls = levelsFormat[index].girls + 1
                        } else {
                            levelsFormat[index].boys = levelsFormat[index].boys + 1
                        }
                    }
                }

            }
            res.status(StatusCodes.OK).json({ ok: true, data: levelsFormat })

        } else {
            res.status(StatusCodes.OK).json({ ok: false, data: null, message: 'Sin datos para mostrar' })
        }
    } catch (error) {
        message = error
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message })
        next(error)
    }
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
                perId: req.body.periodo.perId,
                insStatus: 1
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
                }, {
                    model: PeriodLevelSectionModel,
                    as: 'periodLevelSectionI',
                    require: true,
                    include: [
                        {
                            model: LevelsModel,
                            as: 'level',
                            require: true
                        }, {
                            model: SectionsModel,
                            as: 'section',
                            require: true
                        }
                    ]
                }
            ],
        })
        if (resultFamily.length > 0) {

            const arrayIdFamily = resultFamily.map((element) => {
                return element.dataValues.famId
            })

            const arraySinDuplicados = eliminarElementosRepetidos(arrayIdFamily)

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
                group: 'repId'
            })

            // for (let index = 0; index < familasSinDuplicados.length; index++) {
            //     for (let index2 = 0; index2 < resultRepresentatives.length; index2++) {
            //         if(resultRepresentatives[index2].dataValues.famId === familasSinDuplicados[index].family.famId){
            //             familasSinDuplicados[index].representatives.push(resultRepresentatives[index2].dataValues.representative.dataValues)
            //         }
            //     }
            // }

            // for (let indexF = 0; indexF < familasSinDuplicados.length; indexF++) {
            //     for (let indexE = 0; indexE < resultFamily.length; indexE++) {
            //         if(resultFamily[indexE].dataValues.famId === familasSinDuplicados[indexF].family.famId){
            //             const student = {
            //                 ...resultFamily[0].dataValues.student.dataValues,
            //                 level: resultFamily[0].dataValues.periodLevelSectionI.dataValues.level.dataValues,
            //                 section: resultFamily[0].dataValues.periodLevelSectionI.dataValues.section.dataValues
            //             }
            //             familasSinDuplicados[indexF].students.push(student)
            //         }
            //     }
            // }

            // --------------------------------formato nuevo--------------------------------

            const familyFormateada2 = resultFamily.map((element) => {

                return { famId: element.family.dataValues.famId, family: `${element.family.dataValues.famCode} - ${element.family.dataValues.famName}`, IdentificationRep: '', representatives: '', IdentificationStu: '', students: '', level: '' }
            })

            const familasSinDuplicados2 = eliminarElementosRepetidos(familyFormateada2)

            for (let index = 0; index < familasSinDuplicados2.length; index++) {
                for (let index2 = 0; index2 < resultRepresentatives.length; index2++) {

                    if (resultRepresentatives[index2].dataValues.famId === familasSinDuplicados2[index].famId) {
                        if (familasSinDuplicados2[index].IdentificationRep === '') {
                            familasSinDuplicados2[index].IdentificationRep = `${resultRepresentatives[index2].dataValues.representative.dataValues.repIdType} - ${resultRepresentatives[index2].dataValues.representative.dataValues.repIdentificationNumber}`
                            familasSinDuplicados2[index].representatives = `${resultRepresentatives[index2].dataValues.representative.dataValues.repFirstName} ${resultRepresentatives[index2].dataValues.representative.dataValues.repSurname}`
                        } else {
                            familasSinDuplicados2[index].IdentificationRep = `${familasSinDuplicados2[index].IdentificationRep} \n
 ${resultRepresentatives[index2].dataValues.representative.dataValues.repIdType} - ${resultRepresentatives[index2].dataValues.representative.dataValues.repIdentificationNumber}`
                            familasSinDuplicados2[index].representatives = `${familasSinDuplicados2[index].representatives} \n
 ${resultRepresentatives[index2].dataValues.representative.dataValues.repFirstName} ${resultRepresentatives[index2].dataValues.representative.dataValues.repSurname}`
                        }
                    }
                }
            }

            for (let indexF = 0; indexF < familasSinDuplicados2.length; indexF++) {
                for (let indexE = 0; indexE < resultFamily.length; indexE++) {
                    if (resultFamily[indexE].dataValues.famId === familasSinDuplicados2[indexF].famId) {
                        if (familasSinDuplicados2[indexF].IdentificationStu === '') {
                            familasSinDuplicados2[indexF].IdentificationStu = `${(resultFamily[indexE].dataValues.student.dataValues.stuIdType) ? resultFamily[indexE].dataValues.student.dataValues.stuIdType : ''} - ${(resultFamily[indexE].dataValues.student.dataValues.stuIdentificationNumber) ? resultFamily[indexE].dataValues.student.dataValues.stuIdentificationNumber : ''}`
                            familasSinDuplicados2[indexF].students = `${resultFamily[indexE].dataValues.student.dataValues.stuFirstName} ${(resultFamily[indexE].dataValues.student.dataValues.stuSecondName !== null && resultFamily[indexE].dataValues.student.dataValues.stuSecondName !== '') ? resultFamily[indexE].dataValues.student.dataValues.stuSecondName : ''} ${resultFamily[indexE].dataValues.student.dataValues.stuSurname} ${(resultFamily[indexE].dataValues.student.dataValues.stuSecondSurname !== null && resultFamily[indexE].dataValues.student.dataValues.stuSecondSurname !== '') ? resultFamily[indexE].dataValues.student.dataValues.stuSecondSurname : ''}`
                            familasSinDuplicados2[indexF].level = `${resultFamily[indexE].dataValues.periodLevelSectionI.level.dataValues.levName}`
                        } else {
                            familasSinDuplicados2[indexF].IdentificationStu = `${familasSinDuplicados2[indexF].IdentificationStu} \n 
${(resultFamily[indexE].dataValues.student.dataValues.stuIdType) ? resultFamily[indexE].dataValues.student.dataValues.stuIdType : ''} - ${(resultFamily[indexE].dataValues.student.dataValues.stuIdentificationNumber) ? resultFamily[indexE].dataValues.student.dataValues.stuIdentificationNumber : ''}`
                            familasSinDuplicados2[indexF].students = `${familasSinDuplicados2[indexF].students} \n 
${resultFamily[indexE].dataValues.student.dataValues.stuFirstName} ${(resultFamily[indexE].dataValues.student.dataValues.stuSecondName !== null && resultFamily[indexE].dataValues.student.dataValues.stuSecondName !== '') ? resultFamily[indexE].dataValues.student.dataValues.stuSecondName : ''} ${resultFamily[indexE].dataValues.student.dataValues.stuSurname} ${(resultFamily[indexE].dataValues.student.dataValues.stuSecondSurname !== null && resultFamily[indexE].dataValues.student.dataValues.stuSecondSurname !== '') ? resultFamily[indexE].dataValues.student.dataValues.stuSecondSurname : ''}`
                            familasSinDuplicados2[indexF].level = `${familasSinDuplicados2[indexF].level} \n 
${resultFamily[indexE].dataValues.periodLevelSectionI.level.dataValues.levName}`
                        }
                    }
                }
            }
            res.status(StatusCodes.OK).json({ ok: true, data: familasSinDuplicados2 })
        } else {
            message = 'Sin resultados para mostrar';
            res.status(StatusCodes.OK).json({ ok: false, message })
        }
    } catch (error) {
        message = error
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message })
        next(error)
    }
}
const schoolInsurance = async (req, res, next) => {

    try {
        let resultInscription = await InscriptionsModel.findAll({
            where: {
                perId: req.body.periodo.perId,
                insStatus: 1
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
                }, {
                    model: PeriodLevelSectionModel,
                    as: 'periodLevelSectionI',
                    require: true,
                    include: [
                        {
                            model: LevelsModel,
                            as: 'level',
                            require: true
                        }, {
                            model: SectionsModel,
                            as: 'section',
                            require: true
                        }
                    ]
                }
            ],
        })

        if (resultInscription.length > 0) {
            const data = resultInscription.map((element) => {
                var date = new Date(element.dataValues.student.dataValues.stuDateOfBirth);
                const day = `${(date.getDate())}`.padStart(2, '0');
                const month = `${(date.getMonth() + 1)}`.padStart(2, '0');
                const year = date.getFullYear();
                const formatted_date = `${day}/${month}/${year}`

                return {
                    famId: element.dataValues.family.dataValues.famId,
                    identificationNumberStu: element.dataValues.student.dataValues.stuIdentificationNumber ? element.dataValues.student.dataValues.stuIdentificationNumber : '',
                    surnameStu: element.dataValues.student.dataValues.stuSurname,
                    secondSurnameStu: element.dataValues.student.dataValues.stuSecondSurname ? element.dataValues.student.dataValues.stuSecondSurname : '',
                    firstNameStu: element.dataValues.student.dataValues.stuFirstName,
                    secondNameStu: element.dataValues.student.dataValues.stuSecondName ? element.dataValues.student.dataValues.stuSecondName : '',
                    dateOfBirthStu: formatted_date,
                    sexStu: (element.dataValues.student.dataValues.stuSex).toUpperCase(),
                    levelSection: element.dataValues.periodLevelSectionI.dataValues.level.dataValues.levName,
                }
            })

            const arrayIdFamily = resultInscription.map((element) => {
                return element.dataValues.famId
            })
            const arraySinDuplicados = eliminarElementosRepetidos(arrayIdFamily)

            const resultRepresentatives = await RepresentativeStudentModel.findAll({
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
                group: 'repId'
            })
            for (let indexF = 0; indexF < data.length; indexF++) {
                for (let indexE = 0; indexE < resultRepresentatives.length; indexE++) {
                    if (resultRepresentatives[indexE].dataValues.famId === data[indexF].famId) {
                        data[indexF].repIdentificationNumber = `${resultRepresentatives[indexE].dataValues.representative.dataValues.repIdentificationNumber}`
                        data[indexF].surnamesRep = `${resultRepresentatives[indexE].dataValues.representative.dataValues.repSurname} ${resultRepresentatives[indexE].dataValues.representative.dataValues.repSecondSurname ? resultRepresentatives[indexE].dataValues.representative.dataValues.repSecondSurname : ''}`
                        data[indexF].namesRep = `${resultRepresentatives[indexE].dataValues.representative.dataValues.repFirstName} ${resultRepresentatives[indexE].dataValues.representative.dataValues.repSecondName ? resultRepresentatives[indexE].dataValues.representative.dataValues.repSecondName : ''}`
                    }
                }
            }
            res.status(StatusCodes.OK).json({ ok: true, data: data })
        }
    } catch (error) {
        message = error
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message })
        next(error)
    }
}

const morosos = async (req, res, next) => {

    let where = {
        perId: req.body.periodo.perId,
        levId: req.body.level.levId
    }
    if (req.body.section) {
        where.secId = req.body.section.secId
    }

    MonthlyPaymentModel.findAll({
        where: where,
        include: [
            {
                model: StudentModel,
                as: 'student',
                require: true
            }, {
                model: LevelsModel,
                as: 'level',
                order: [['lev_id', 'ASC']],
                require: true
            },
            {
                model: SectionsModel,
                as: 'section',
                order: [['sec_id', 'ASC']],
                require: true
            }
        ]
    }).then((monthlyPayment) => {

        if (monthlyPayment.length > 0) {

            const datosEstudiante = monthlyPayment.map(item => {
                return {
                    level: item.dataValues.level.dataValues.levName,
                    section: item.dataValues.section.dataValues.secName,
                    stuId: item.dataValues.stuId,
                    stuIdType: item.student.dataValues.stuIdType,
                    stuIdentificationNumber: item.student.dataValues.stuIdentificationNumber,
                    stuFirstName: item.student.dataValues.stuFirstName,
                    stuSecondName: item.student.dataValues.stuSecondName,
                    stuSurname: item.student.dataValues.stuSurname,
                    stuSecondSurname: item.student.dataValues.stuSecondSurname,
                    stuSex: item.student.dataValues.stuSex,
                    mopEne: item.dataValues.mopEne,
                    mopFeb: item.dataValues.mopFeb,
                    mopMar: item.dataValues.mopMar,
                    mopAbr: item.dataValues.mopAbr,
                    mopMay: item.dataValues.mopMay,
                    mopJun: item.dataValues.mopJun,
                    mopJul: item.dataValues.mopJul,
                    mopAgo: item.dataValues.mopAgo,
                    mopSep: item.dataValues.mopSep,
                    mopOct: item.dataValues.mopOct,
                    mopNov: item.dataValues.mopNov,
                    mopDic: item.dataValues.mopDic,
                }
            })

            res.status(StatusCodes.OK).json({ ok: true, data: datosEstudiante })
        } else {
            message = 'Sin datos para mostrar';
            res.status(StatusCodes.OK).json({ ok: false, message })
        }

    }, (err) => {
        message = 'Error al consultar reporte'
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message })
        next(err)
    })


}
module.exports = {
    reportByLevelAndSection,
    reportStatistics,
    familyPayroll,
    schoolInsurance,
    morosos,

}