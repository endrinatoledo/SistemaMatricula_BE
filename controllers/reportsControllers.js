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

    // console.log('llego morososssssssssssssssssssssssssssssssssssssssss', req.body)

    let where = {
        perId: req.body.periodo.perId,
        levId: req.body.level.levId,
        secId: req.body.section.secId
    }

    MonthlyPaymentModel.findAll({
        where: where,
        include: [
            {
                model: StudentModel,
                as: 'student',
                require: true
            }
            // , {
            //     model: LevelsModel,
            //     as: 'level',
            //     order: [['lev_id', 'ASC']],
            //     require: true
            // },
            // {
            //     model: SectionsModel,
            //     as: 'section',
            //     order: [['sec_id', 'ASC']],
            //     require: true
            // }
        ]
    })
    .then((monthlyPayment) => {

        if (monthlyPayment.length > 0) {

            let hash = {};
            const eliminarEstudiantesRepetidos = monthlyPayment.filter(o => hash[o.dataValues.stuId] ? false : hash[o.dataValues.stuId] = true);
            const estudiantesOrdenados = eliminarEstudiantesRepetidos.map((item) => {
                return {
                    stuId: item.dataValues.stuId,
                    nombre: `${item.student.dataValues.stuFirstName} ${item.student.dataValues.stuSecondName} ${item.student.dataValues.stuSurname} ${item.student.dataValues.stuSecondSurname}`,
                    mopEne: null,
                    mopFeb: null,
                    mopMar: null,
                    mopAbr: null,
                    mopMay: null,
                    mopJun: null,
                    mopJul: null,
                    mopAgo: null,
                    mopSep: null,
                    mopOct: null,
                    mopNov: null,
                    mopDic: null,
                }
            })

            let dataEspejo = estudiantesOrdenados
            // console.log('estudiantesOrdenados', estudiantesOrdenados)

            const dataFinal = estudiantesOrdenados.map((item, index )=> {
                const dataEne = monthlyPayment.find((element) => item.stuId === element.dataValues.stuId && element.dataValues.mopMonth === 'enero')
                const dataFeb = monthlyPayment.find((element) => item.stuId === element.dataValues.stuId && element.dataValues.mopMonth === 'febrero')
                const dataMar = monthlyPayment.find((element) => item.stuId === element.dataValues.stuId && element.dataValues.mopMonth === 'marzo')
                const dataAbr = monthlyPayment.find((element) => item.stuId === element.dataValues.stuId && element.dataValues.mopMonth === 'abril')
                const dataMay = monthlyPayment.find((element) => item.stuId === element.dataValues.stuId && element.dataValues.mopMonth === 'mayo')
                const dataJun = monthlyPayment.find((element) => item.stuId === element.dataValues.stuId && element.dataValues.mopMonth === 'junio')
                const dataJul = monthlyPayment.find((element) => item.stuId === element.dataValues.stuId && element.dataValues.mopMonth === 'julio')
                const dataAgo = monthlyPayment.find((element) => item.stuId === element.dataValues.stuId && element.dataValues.mopMonth === 'agosto')
                const dataSep = monthlyPayment.find((element) => item.stuId === element.dataValues.stuId && element.dataValues.mopMonth === 'septiembre')
                const dataOct = monthlyPayment.find((element) => item.stuId === element.dataValues.stuId && element.dataValues.mopMonth === 'octubre')
                const dataNov = monthlyPayment.find((element) => item.stuId === element.dataValues.stuId && element.dataValues.mopMonth === 'noviembre')
                const dataDic = monthlyPayment.find((element) => item.stuId === element.dataValues.stuId && element.dataValues.mopMonth === 'diciembre')

                return {
                    stuId: item.stuId,
                    nombre: item.nombre,
                    mopEne : dataEne.mopStatus == 2 ? 'X' : '+',
                    mopFeb : dataFeb.mopStatus == 2 ? 'X' : '+',
                    mopMar : dataMar.mopStatus == 2 ? 'X' : '+',
                    mopAbr : dataAbr.mopStatus == 2 ? 'X' : '+',
                    mopMay : dataMay.mopStatus == 2 ? 'X' : '+',
                    mopJun : dataJun.mopStatus == 2 ? 'X' : '+',
                    mopJul : dataJul.mopStatus == 2 ? 'X' : '+',
                    mopAgo : dataAgo.mopStatus == 2 ? 'X' : '+',
                    mopSep : dataSep.mopStatus == 2 ? 'X' : '+',
                    mopOct : dataOct.mopStatus == 2 ? 'X' : '+',
                    mopNov : dataNov.mopStatus == 2 ? 'X' : '+',
                    mopDic : dataDic.mopStatus == 2 ? 'X' : '+',
                }
                                
            })
            console.log('dataFinal..........................................', dataFinal)           
            res.status(StatusCodes.OK).json({ ok: true, data: dataFinal })
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

const mensualidadesCobranza = async (req, res, next) => {


    console.log('llegoooooooooooooooooooooooooooooooooooooo mensualidadesCobranza')

}

const clasificacionPagos = async (req, res, next) => {
    const fechaI = moment(moment(req.body.fechas.fechaI, 'YYYY-MM-DD').toDate()).format("YYYY-MM-DD")
    const fechaF = moment(moment(req.body.fechas.fechaF, 'YYYY-MM-DD').toDate()).format("YYYY-MM-DD")
    try {
        PaymentDetailModel.findAll({
            include: [{
                model: InvoiceHeaderModel,
                as: 'invoiceHeaderPay',
                require: true,
                where: {
                    inhDateCreate: {
                        [Op.between]: [fechaI, fechaF]
                    },
                },
                order: [['inhDate', 'ASC']],
            }],
        })
        .then(async (resultInvoiceHeader) => {
            // console.log('-----------------',resultInvoiceHeader);
            if (resultInvoiceHeader.length > 0){
                let array = resultInvoiceHeader
                let hash = {};
                array = array.filter(o => hash[o.invoiceHeaderPay.inhDateCreate] ? false : hash[o.invoiceHeaderPay.inhDateCreate] = true)
                const arrayFechas = array.map(item => item.invoiceHeaderPay.inhDateCreate)
                const arrayFechasOrdenado = arrayFechas.sort()

                const dataFinal = arrayFechasOrdenado.map(item => {
                    const dolaresEfectivo = resultInvoiceHeader.reduce((valorAnterior, valorActual) => {
                        if (valorActual.dataValues.depCurrency == 'Dólares' && valorActual.dataValues.payId == 1 && item == valorActual.dataValues.invoiceHeaderPay.dataValues.inhDateCreate){
                            return valorAnterior + valorActual.dataValues.depAmount;
                        }else{
                            return valorAnterior + 0;
                        }                        
                    }, 0);
                    const dolaresTransferencia = resultInvoiceHeader.reduce((valorAnterior, valorActual) => {
                        if (valorActual.dataValues.depCurrency == 'Dólares' && valorActual.dataValues.payId == 2 && item == valorActual.dataValues.invoiceHeaderPay.dataValues.inhDateCreate) {
                            return valorAnterior + valorActual.dataValues.depAmount;
                        } else {
                            return valorAnterior + 0;
                        }

                    }, 0);
                    const dolaresPunto = resultInvoiceHeader.reduce((valorAnterior, valorActual) => {
                        if (valorActual.dataValues.depCurrency == 'Dólares' && valorActual.dataValues.payId == 3 && item == valorActual.dataValues.invoiceHeaderPay.dataValues.inhDateCreate) {
                            return valorAnterior + valorActual.dataValues.depAmount;
                        } else {
                            return valorAnterior + 0;
                        }
                    }, 0);
                    const bolivaresEfectivo = resultInvoiceHeader.reduce((valorAnterior, valorActual) => {
                        if (valorActual.dataValues.depCurrency == 'Bolívares' && valorActual.dataValues.payId == 1 && item == valorActual.dataValues.invoiceHeaderPay.dataValues.inhDateCreate) {
                            return valorAnterior + valorActual.dataValues.depAmount;
                        } else {
                            return valorAnterior + 0;
                        }
                    }, 0);
                    const bolivaresTransferencia = resultInvoiceHeader.reduce((valorAnterior, valorActual) => {
                        if (valorActual.dataValues.depCurrency == 'Bolívares' && valorActual.dataValues.payId == 2 && item == valorActual.dataValues.invoiceHeaderPay.dataValues.inhDateCreate) {
                            return valorAnterior + valorActual.dataValues.depAmount;
                        } else {
                            return valorAnterior + 0;
                        }
                    }, 0);
                    const bolivaresPunto = resultInvoiceHeader.reduce((valorAnterior, valorActual) => {
                        if (valorActual.dataValues.depCurrency == 'Bolívares' && valorActual.dataValues.payId == 3 && item == valorActual.dataValues.invoiceHeaderPay.dataValues.inhDateCreate) {
                            return valorAnterior + valorActual.dataValues.depAmount;
                        } else {
                            return valorAnterior + 0;
                        }
                    }, 0);

                    return {
                        fecha : item,
                        dolEfect: parseFloat(dolaresEfectivo).toFixed(2),
                        dolTran : parseFloat(dolaresTransferencia).toFixed(2),
                        dolPun: parseFloat(dolaresPunto).toFixed(2),
                        bolEfect:parseFloat(bolivaresEfectivo).toFixed(2),
                        bolTran: parseFloat(bolivaresTransferencia).toFixed(2),
                        bolPun: parseFloat(bolivaresPunto).toFixed(2)
                    }
                })
                res.status(StatusCodes.OK).json({ ok: true, data: dataFinal })

            }else{
                res.status(StatusCodes.OK).json({ ok: true, data: [] })

            }
        }, (err) => {
            console.log('Error al generar reporte de clasificacion de pagos', err)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message:'Error al generar reporte de clasificacion de pagos',data:[] })
            next(err)
        })
    } catch (error) {
        
    }
}

const morososConFiltros = async (req, res, next) => {

    console.log('llegoa morososConFiltros', req.body)
    try {
        const etapasArray = [[], [], [1, 2, 3], [4, 5, 6, 7, 8, 9], [10, 11, 12, 13, 14]]
        const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
        const mesActual = new Date().getMonth();
        let includeValue = []
        let where = {
            perId: req.body.periodo.perId,
            mopStatus: 2,
            mopMonth: meses[mesActual]
        }
        if (req.body.etapa != 1) {
            if (req.body.level == null && req.body.section == null) {
                where.secId = {
                    [Op.in]: [1, 2]
                }
                where.levId = {
                    [Op.in]: etapasArray[req.body.etapa]
                }
            } else {
                if (req.body.level != null) where.levId = req.body.level.levId;
                if (req.body.section != null) where.secId = req.body.section.secId;
            }

        }

        if (req.body.clasificacion == 2) { //busqueda por estudiantes
            includeValue = [
                {
                    model: StudentModel,
                    as: 'student',
                    require: true
                }
                , {
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
                }, {
                    model: FamilyModel,
                    as: 'family',
                    // order: [['sec_id', 'ASC']],
                    require: true
                },
            ]
        } else { // busqueda por familias

        }
        MonthlyPaymentModel.findAll({
            where: where,
            include: includeValue
        })
            .then((monthlyPayment) => {
                console.log('------------------', monthlyPayment.length)
                if (monthlyPayment.length > 0) {
                    if (req.body.clasificacion == 2) { //organizar por estudiantes
                        const result = monthlyPayment.map((item, index) => {
                            return {
                                numer: index,
                                mes: meses[mesActual],
                                familia: item.dataValues.family.dataValues.famName,
                                pName: item.dataValues.student.dataValues.stuFirstName,
                                sNmae: item.dataValues.student.dataValues.stuSecondName,
                                pSurname: item.dataValues.student.dataValues.stuSurname,
                                sSurname: item.dataValues.student.dataValues.stuSecondSurname,
                                typeInd: item.dataValues.student.dataValues.stuIdType,
                                identificacion: item.dataValues.student.dataValues.stuIdentificationNumber,
                                level: item.dataValues.level.dataValues.levName,
                                section: item.dataValues.section.dataValues.secName,
                            }
                        });
                        res.status(StatusCodes.OK).json({ ok: true, data: result })
                    } else { // organizar por familias

                    }
                } else {
                    message = 'Sin datos para mostrar';
                    res.status(StatusCodes.OK).json({ ok: false, data: [], message })
                }
            }, (err) => {
                message = 'Error al consultar reporte de Morosos con filtro'
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message })
                next(err)
            })
    } catch (error) {
        console.log('este error', error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message: 'Error al consultar reporte de Morosos con filtro' })
    }


}



module.exports = {
    reportByLevelAndSection,
    reportStatistics,
    familyPayroll,
    schoolInsurance,
    morosos,
    mensualidadesCobranza,
    clasificacionPagos,
    morososConFiltros,
}