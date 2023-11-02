const { StatusCodes } = require('http-status-codes')
const Sequelize = require('sequelize');
const moment = require('moment');

const Op = Sequelize.Op
const db = require("../models");
const ConceptosAdicionalesModel = db.conceptosAdicionalesModel
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
            console.log('arraySinDuplicados', arraySinDuplicados.length)

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

    try {
        let consulta = {};
        const etapasArray = [[], [], [1, 2, 3], [4, 5, 6, 7, 8, 9], [10, 11, 12, 13, 14]];
        let where = { perId: req.body.periodo.perId };
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
            consulta.include = [
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
            }
            ]
        } else { // busqueda por familias
            consulta.group = ["famId"] 
            consulta.include = [
                {
                    model: FamilyModel,
                    as: 'family',
                    require: true
                },
            ]
        }

        consulta.where = where
        MonthlyPaymentModel.findAll(consulta)
            .then((monthlyPayment) => {
                if (monthlyPayment.length > 0) {
                    if (req.body.clasificacion == 2) { //organizar por estudiantes
                        let hash = {};
                        const eliminarEstudiantesRepetidos = monthlyPayment.filter(o => hash[o.dataValues.stuId] ? false : hash[o.dataValues.stuId] = true);
                        const estudiantesOrdenados = eliminarEstudiantesRepetidos.map((item) => {
                            return {
                                stuId: item.dataValues.stuId,
                                level: item.dataValues.level.dataValues.levName,
                                section: item.dataValues.section.dataValues.secName,
                                nombre: `${item.student.dataValues.stuFirstName} ${item.student.dataValues.stuSecondName} ${item.student.dataValues.stuSurname} ${item.student.dataValues.stuSecondSurname}`,
                                mopSep: null,
                                mopOct: null,
                                mopNov: null,
                                mopDic: null,
                                mopEne: null,
                                mopFeb: null,
                                mopMar: null,
                                mopAbr: null,
                                mopMay: null,
                                mopJun: null,
                                mopJul: null,
                                mopAgo: null,
                                
                            }
                        })

                        const dataFinal = estudiantesOrdenados.map((item, index) => {
                            const dataSep = monthlyPayment.find((element) => item.stuId === element.dataValues.stuId && element.dataValues.mopMonth === 'septiembre')
                            const dataOct = monthlyPayment.find((element) => item.stuId === element.dataValues.stuId && element.dataValues.mopMonth === 'octubre')
                            const dataNov = monthlyPayment.find((element) => item.stuId === element.dataValues.stuId && element.dataValues.mopMonth === 'noviembre')
                            const dataDic = monthlyPayment.find((element) => item.stuId === element.dataValues.stuId && element.dataValues.mopMonth === 'diciembre')

                            const dataEne = monthlyPayment.find((element) => item.stuId === element.dataValues.stuId && element.dataValues.mopMonth === 'enero')
                            const dataFeb = monthlyPayment.find((element) => item.stuId === element.dataValues.stuId && element.dataValues.mopMonth === 'febrero')
                            const dataMar = monthlyPayment.find((element) => item.stuId === element.dataValues.stuId && element.dataValues.mopMonth === 'marzo')
                            const dataAbr = monthlyPayment.find((element) => item.stuId === element.dataValues.stuId && element.dataValues.mopMonth === 'abril')
                            const dataMay = monthlyPayment.find((element) => item.stuId === element.dataValues.stuId && element.dataValues.mopMonth === 'mayo')
                            const dataJun = monthlyPayment.find((element) => item.stuId === element.dataValues.stuId && element.dataValues.mopMonth === 'junio')
                            const dataJul = monthlyPayment.find((element) => item.stuId === element.dataValues.stuId && element.dataValues.mopMonth === 'julio')
                            const dataAgo = monthlyPayment.find((element) => item.stuId === element.dataValues.stuId && element.dataValues.mopMonth === 'agosto')
                            
                            return {
                                stuId: item.stuId,
                                level: item.level,
                                section: item.section,
                                nombre: item.nombre,
                                mopSep: dataSep.mopStatus == 2 ? 'PEN' : 'PAG',
                                mopOct: dataOct.mopStatus == 2 ? 'PEN' : 'PAG',
                                mopNov: dataNov.mopStatus == 2 ? 'PEN' : 'PAG',
                                mopDic: dataDic.mopStatus == 2 ? 'PEN' : 'PAG',
                                mopEne: dataEne.mopStatus == 2 ? 'PEN' : 'PAG',
                                mopFeb: dataFeb.mopStatus == 2 ? 'PEN' : 'PAG',
                                mopMar: dataMar.mopStatus == 2 ? 'PEN' : 'PAG',
                                mopAbr: dataAbr.mopStatus == 2 ? 'PEN' : 'PAG',
                                mopMay: dataMay.mopStatus == 2 ? 'PEN' : 'PAG',
                                mopJun: dataJun.mopStatus == 2 ? 'PEN' : 'PAG',
                                mopJul: dataJul.mopStatus == 2 ? 'PEN' : 'PAG',
                                mopAgo: dataAgo.mopStatus == 2 ? 'PEN' : 'PAG',                            
                            }
                        })
                        res.status(StatusCodes.OK).json({ ok: true, data: dataFinal })


                    } else { // organizar por familias
                        
                    }
                } else {
                    message = 'Sin datos para mostrar';
                    res.status(StatusCodes.OK).json({ ok: false, data: [], message })
                }
            }, (err) => {
                message = 'Error al consultar Resumen de mensualidades'
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message })
                next(err)
            })

    } catch (error) {
        console.log('este error', error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message: 'Error al consultar Resumen de mensualidades' })

    }
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
                    inhStatusFact: 'ACTIVA'
                },
                order: [['inhDate', 'ASC']],
            }],
        })
        .then(async (resultInvoiceHeader) => {
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

function extraerPlsIdsPromesa(arreglo) {
    return new Promise((resolve, reject) => {
        if (Array.isArray(arreglo)) {
            const plsIds = arreglo.map(item => item.plsId);
            resolve(plsIds);
        } else {
            reject(new Error("Entrada no es un arreglo válido"));
        }
    });
}

const morososConFiltros = async (req, res, next) => {

    try {
        const etapasArray = [[], [], [1, 2, 3], [4, 5, 6, 7, 8, 9], [10, 11, 12, 13, 14]]
        const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
        const mesActual = new Date().getMonth();
        let consulta = {};
        let perLevSecResultantes;
        
        let where = {
            perId: req.body.periodo.perId,
            mopStatus: 2,
            mopMonth: meses[mesActual]
        }
        if (req.body.etapa != 1) {
            if (req.body.level == null && req.body.section == null) {
                // where.secId = {
                //     [Op.in]: [1, 2]
                // }
                // where.levId = {
                //     [Op.in]: etapasArray[req.body.etapa]
                // }

                perLevSecResultantes = await PeriodLevelSectionModel.findAll({
                    where: {
                        perId: req.body.periodo.perId,
                        secId: {
                            [Op.in]: [1, 2]
                        },
                        levId: {
                            [Op.in]: etapasArray[req.body.etapa]
                        }
                    }
                })

            } else {
                let where2 = {
                    perId: req.body.periodo.perId,
                }
                if (req.body.level != null) where2.levId = req.body.level.levId;
                if (req.body.section != null) where2.secId = req.body.section.secId;

                perLevSecResultantes = await PeriodLevelSectionModel.findAll({
                    where: where2
                })

                // if (req.body.level != null) where.levId = req.body.level.levId;
                // if (req.body.section != null) where.secId = req.body.section.secId;
            }

            
        }

        if (req.body.clasificacion == 2) { //busqueda por estudiantes
            consulta.include =[
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
                    require: true
                },
            ]
        } else { // busqueda por familias
            consulta.group = ["famId"]
            consulta.include = [
                {
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
                    require: true
                },
            ]
        }

        
        const plsIds = await extraerPlsIdsPromesa(perLevSecResultantes);

        consulta.where = where 
        if (consulta.include){
            consulta.include.push({
                model: InscriptionsModel,
                as: 'inscriptionMonthly',
                require: true,
                where: {
                    perId: req.body.periodo.perId,
                    plsId: {
                        [Op.in]: plsIds
                    }
                },
                include: [
                    {
                        model: PeriodLevelSectionModel,
                        as: 'periodLevelSectionI',
                        require: true,
                        include: [{
                            model: LevelsModel,
                            as: 'level',
                            require: true
                        }, {
                            model: SectionsModel,
                            as: 'section',
                            require: true
                        }]
                    }
                ]
            })
        }else{
            consulta.include = [
                {
                    model: InscriptionsModel,
                    as: 'inscriptionMonthly',
                    require: true,
                    where: {
                        perId: req.body.periodo.perId,
                        plsId: {
                            [Op.in]: plsIds
                        }
                    },
                    include: [
                        {
                            model: PeriodLevelSectionModel,
                            as: 'periodLevelSectionI',
                            require: true,
                            include: [{
                                model: LevelsModel,
                                as: 'level',
                                require: true
                            }, {
                                model: SectionsModel,
                                as: 'section',
                                require: true
                            }]
                        }
                    ]
                }
            ]
        }
        MonthlyPaymentModel.findAll(consulta)
            .then((monthlyPayment) => {
                if (monthlyPayment.length > 0) {
                    if (req.body.clasificacion == 2) { //organizar por estudiantes
                        const result = monthlyPayment.map((item, index) => {
                            const periodLevelSectionI = item.dataValues.inscriptionMonthly.dataValues.periodLevelSectionI.dataValues
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
                                level: periodLevelSectionI.level.dataValues.levName,
                                section: periodLevelSectionI.section.dataValues.secName,
                            }
                        });
                        res.status(StatusCodes.OK).json({ ok: true, data: result })
                    } else { // organizar por familias

                        const result = monthlyPayment.map((item, index) => {
                            const periodLevelSectionI = item.dataValues.inscriptionMonthly.dataValues.periodLevelSectionI.dataValues

                            return {
                                numer: index,
                                mes: meses[mesActual],
                                familia: item.dataValues.family.dataValues.famName,
                                level: periodLevelSectionI.level.dataValues.levName,
                                section: periodLevelSectionI.section.dataValues.secName,
                            }
                        });
                        res.status(StatusCodes.OK).json({ ok: true, data: result })
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

function crearArregloDePagosPorEstudiante(estudiantes) {
    const estudiantesConPagos = estudiantes.reduce((acc, estudiante) => {
        const { idEstudiante, pName, pSurname, sSurname } = estudiante;
        const estudianteExistente = acc.find((e) => e.idEstudiante === idEstudiante);

        if (estudianteExistente) {
            return acc;
        }

        const pagos = [];

        acc.push({
            idEstudiante,
            nombre: `${pName} ${pSurname} ${sSurname}`,
            pagos,
        });

        return acc;
    }, []);

    estudiantesConPagos.forEach((estudianteConPagos) => {
        const { idEstudiante, pagos } = estudianteConPagos;

        estudiantes
            .filter((estudiante) => estudiante.idEstudiante === idEstudiante)
            .forEach((estudiante) => {
                const { mes, mopStatus } = estudiante;
                pagos.push({
                    mes,
                    mopStatus,
                });
            });
    });

    return estudiantesConPagos;
}

function ordenarPagosDesdeSeptiembreHastaAgosto(estudiantes) {
    const mesesOrdenados = ['septiembre', 'octubre', 'noviembre', 'diciembre', 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto'];

    const estudiantesOrdenados = estudiantes.map((estudiante) => {
        const pagosOrdenados = estudiante.pagos.sort((a, b) => {
            const mesA = a.mes.toLowerCase();
            const mesB = b.mes.toLowerCase();
            return mesesOrdenados.indexOf(mesA) - mesesOrdenados.indexOf(mesB);
        });

        return { ...estudiante, pagos: pagosOrdenados };
    });

    return estudiantesOrdenados;
}

function validarPagosEstudiantes(estudiantes) {

    const fechaActual = new Date();
    const mesActual = fechaActual.toLocaleString('default', { month: 'long' }).toLowerCase();
    // Restar un mes a la fecha actual
    fechaActual.setMonth(fechaActual.getMonth() - 1);

    // Obtener el nombre del mes anterior
    const mesAnterior = fechaActual.toLocaleString('default', { month: 'long' }).toLowerCase();

    const estatusEstudiantes = estudiantes.map((estudiante) => {
        const pagosEstudiante = estudiante.pagos;

        // Buscar el pago correspondiente al mes actual
        const pagoMesActual = pagosEstudiante.find((pago) => pago.mes.toLowerCase() === mesActual);
        const pagoMesAnterior = pagosEstudiante.find((pago) => pago.mes.toLowerCase() === mesAnterior);

        if (pagoMesActual) {
            // Si el estudiante tiene el pago del mes actual, validar si está al día
            if (pagoMesActual.mopStatus === 1) {
                return { idEstudiante: estudiante.idEstudiante,nombre:estudiante.nombre ,estatus: 'al dia' };
            } else if (pagoMesActual.mopStatus === 2) {
                if (pagoMesAnterior.mopStatus === 1){
                    return { idEstudiante: estudiante.idEstudiante, nombre: estudiante.nombre, estatus: 'un mes moroso' };
                }else{
                    return { idEstudiante: estudiante.idEstudiante, nombre: estudiante.nombre, estatus: 'mas de un mes moroso' };
                }
            }
        } 
    });

    return estatusEstudiantes;
}

function contarEstatusEstudiantes(estudiantes) {
    let alDia = 0;
    let unMesMoroso = 0;
    let masDeUnMesMoroso = 0;

    estudiantes.forEach(estudiante => {
        switch (estudiante.estatus) {
            case 'al dia':
                alDia++;
                break;
            case 'un mes moroso':
                unMesMoroso++;
                break;
            case 'mas de un mes moroso':
                masDeUnMesMoroso++;
                break;
            default:
                break;
        }
    });

    return { alDia, unMesMoroso, masDeUnMesMoroso };
}

function ArrayDataParaGrafica(objetct) {
    const valoresEstatusEstudiantes = Object.values(objetct);
    return valoresEstatusEstudiantes;
}


const graficaMorosos = async (req, res, next) => {

    let consulta = {}; 
    try {
        
        let where = {
            perId: req.body.periodo.perId,
            levId:req.body.level.levId,
            secId:req.body.section.secId
        }
        consulta.include = [
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
                require: true
            },
        ]
        consulta.where = where 

        MonthlyPaymentModel.findAll(consulta)
            .then((monthlyPayment) => {
                if (monthlyPayment.length > 0) {
                    const result = monthlyPayment.map((item, index) => {
                        return {
                            numer: index,
                            idEstudiante: item.dataValues.stuId,
                            familia: item.dataValues.family.dataValues.famName,
                            pName: item.dataValues.student.dataValues.stuFirstName,
                            sNmae: item.dataValues.student.dataValues.stuSecondName,
                            pSurname: item.dataValues.student.dataValues.stuSurname,
                            sSurname: item.dataValues.student.dataValues.stuSecondSurname,
                            typeInd: item.dataValues.student.dataValues.stuIdType,
                            identificacion: item.dataValues.student.dataValues.stuIdentificationNumber,
                            mopStatus: item.dataValues.mopStatus,
                            mes: item.dataValues.mopMonth,
                        }
                    });

                    const resultEstudiantesPagos = crearArregloDePagosPorEstudiante(result)
                    const resultEstudiantesPagosOrdenados = ordenarPagosDesdeSeptiembreHastaAgosto(resultEstudiantesPagos)
                    const resultadoEstudianteEstatusPago = validarPagosEstudiantes(resultEstudiantesPagosOrdenados) // estatus por estudiante para tabla
                    const conteoEstatusEstudiantes = contarEstatusEstudiantes(resultadoEstudianteEstatusPago) // conteo de estatus por estudiante para grafica
                    const arrayDataGrafica = ArrayDataParaGrafica(conteoEstatusEstudiantes) //arreglo para data de grafica

                    const dataFinal = {
                        arrayDataGrafica,
                        labelsGrafica: ['Solventes', '1 Mes Moroso', '+1 Mes Morosos'],
                        arrayEstudiantesEstatusPago: resultadoEstudianteEstatusPago,
                        nombreReporte: `Estatus de pago de estudiantes de ${req.body.level.levName} sección ${req.body.section.secName}`,
                    }
                    res.send({ ok: true, message: 'Consulta exitosa', data: [dataFinal] })

                } else {
                    res.send({ ok: falsa, message: 'Sin resultados para mostrar', data: [] })
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

const conceptosFacturaSeguroEscolar = async (req, res, next) => {

    try {
        InvoiceHeaderModel.findAll({
            where: {
                perId: req.body.periodo.perId,
            },
            include:[{
                model: InvoiceDetailModel,
                as: 'inh_ind',
                require: true,
                where:{
                    indDescripcion: { [Op.like]:`%${req.body.conceptoFacura}%` }
                }
            },{
                model: FamilyModel,
                as: 'familyInvoice',
                require: true
            }]
            }).then(async (invoiceDetailResult) => {

                const resultMapeado = invoiceDetailResult.map((item, index) => {
                    return {
                        idFam: item.familyInvoice.dataValues.famId,
                        familia: item.familyInvoice.dataValues.famName,
                        concepto: item.inh_ind,
                    }
                });

                const resultMapeado2 = await transformarDatos(resultMapeado);

                const arrayIdFamily = resultMapeado2.map((element) => {
                    return element.idFamily
                })

                const arraySinDuplicados = eliminarElementosRepetidos(arrayIdFamily)

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
                            where: {
                                fam_id: {
                                    [Op.in]: arraySinDuplicados
                                }
                            },
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

                    // const arrayIdFamily = resultInscription.map((element) => {
                    //     return element.dataValues.famId
                    // })
                    // const arraySinDuplicados = eliminarElementosRepetidos(arrayIdFamily)

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

                // const resultRepresentatives = await RepresentativeStudentModel.findAll({
                //     where: {
                //         fam_id: {
                //             [Op.in]: arraySinDuplicados
                //         }
                //     },
                //     include: [
                //         {
                //             model: RepresentativeModel,
                //             as: 'representative',
                //             require: true
                //         }
                //     ],
                //     group: 'repId'
                // });

                // RepresentativeStudentModel.findAll({
                //     where: {
                //         fam_id: {
                //             [Op.in]: arraySinDuplicados
                //         }
                //     },
                //     include: [
                //         {
                //             model: RepresentativeModel,
                //             as: 'representative',
                //             require: true
                //         }
                //     ],
                //     group: 'repId'
                // }).then((resultRepresentatives) => {

                //     // let data = []
                //     // for (let indexF = 0; indexF < resultMapeado2.length; indexF++) {
                //     //     for (let indexE = 0; indexE < resultRepresentatives.length; indexE++) {
                //     //         if (resultRepresentatives[indexE].dataValues.famId === resultMapeado2[indexF].famId) {
                //     //             data.repIdentificationNumber = `${resultRepresentatives[indexE].dataValues.representative.dataValues.repIdentificationNumber}`
                //     //             data.surnamesRep = `${resultRepresentatives[indexE].dataValues.representative.dataValues.repSurname} ${resultRepresentatives[indexE].dataValues.representative.dataValues.repSecondSurname ? resultRepresentatives[indexE].dataValues.representative.dataValues.repSecondSurname : ''}`
                //     //             data.namesRep = `${resultRepresentatives[indexE].dataValues.representative.dataValues.repFirstName} ${resultRepresentatives[indexE].dataValues.representative.dataValues.repSecondName ? resultRepresentatives[indexE].dataValues.representative.dataValues.repSecondName : ''}`
                //     //             data.family = resultMapeado2[indexF].familia
                //     //             data.concepto = resultMapeado2[indexF].concepto
                //     //         }
                //     //     }
                //     // }

                //     const transformedData = resultMapeado2.map((resultMapeado) => {
                //         const match = resultRepresentatives.find((resultRepresentative) => {
                //             return resultRepresentative.dataValues.famId === resultMapeado.idFamily;
                //         });

                //         if (match) {
                //             const representative = match.dataValues.representative;
                //             const repIdentificationNumber = representative.dataValues.repIdentificationNumber;
                //             const surnamesRep = `${representative.dataValues.repSurname} ${representative.dataValues.repSecondSurname ? representative.dataValues.repSecondSurname : ''}`;
                //             const namesRep = `${representative.dataValues.repFirstName} ${representative.dataValues.repSecondName ? representative.dataValues.repSecondName : ''}`;
                //             const filtrarNombre = resultMapeado.concepto.split('SEGURO ESCOLAR  ')
                //             const nombreStudiante = filtrarNombre.join("");
                //             const palabras = resultMapeado.concepto.split(" "); // Dividir la cadena en palabras por espacios en blanco
                //             const Grado = palabras.pop(); // Extraer la última palabra
                //             return {
                //                 concepto: nombreStudiante.toUpperCase(),
                //                 repIdentificationNumber,
                //                 surnamesRep: surnamesRep.toUpperCase(),
                //                 namesRep: namesRep.toUpperCase(),
                //                 family: resultMapeado.familia.toUpperCase(),
                //             };
                //         }

                //         return null;
                //     });

                //     console.log('transformedData', transformedData[0])
                //     res.status(StatusCodes.OK).json({ ok: true, data: transformedData })

                // })





        })
    } catch (error) {
        console.log('este error en concepotos de factura', error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message: 'Error al consultar reporte por conceptos de factura' })

    }
}

async function transformarDatos(entrada) {
    const ejemplosalida = [];
    for (const item of entrada) {

        for (const concepto of item.concepto) {

            ejemplosalida.push({
                idFamily: item.idFam,
                familia: item.familia,
                concepto: concepto.dataValues.indDescripcion
            });
        }
    }

    return ejemplosalida;
}

function ordenarArregloPorFamilia(arr) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(arr)) {
            reject(new Error('El argumento debe ser un arreglo.'));
        }

        arr.sort((a, b) => {
            const familiaA = a.familia.toLowerCase();
            const familiaB = b.familia.toLowerCase();
            if (familiaA < familiaB) {
                return -1;
            }
            if (familiaA > familiaB) {
                return 1;
            }
            return 0;
        });

        resolve(arr);
    });
}


const conceptosFacturaPintura = async (req, res, next) => {

    try {
        ConceptosAdicionalesModel.findAll({
            where: {
                perId: req.body.periodo.perId,
                icoName: 'PRIMERA FASE DE PINTURA'
            },
            include: [
                {
                    model: InvoiceHeaderModel,
                    as: 'conceptosAdicionalesInvoiceHeader',
                    require: true,
                    include: [
                        {
                            model: FamilyModel,
                            as: 'familyInvoice',
                            require: true
                        }]
                },
            ]
        }).then(async (invoiceDetailResult) => {

            console.log('invoiceDetailResult*********', invoiceDetailResult[0].dataValues)

            const resultMapeado = invoiceDetailResult.map((item, index) => {

                const date = new Date(item.dataValues.cadCreationDate);
                const dia = date.getUTCDate();
                const mes = date.getUTCMonth() + 1; // Se suma 1 porque los meses comienzan desde 0 (enero).
                const año = date.getUTCFullYear();
                return {
                    idFam: item.dataValues.conceptosAdicionalesInvoiceHeader?.dataValues.familyInvoice.famId,
                    familia: item.dataValues.conceptosAdicionalesInvoiceHeader?.dataValues.familyInvoice.famName,
                    montoPagado: item.cadMontoPagadoDolares,
                    costo: item.dataValues.cadCostoDolares,
                    fecha: `${dia.toString().padStart(2, '0')}-${mes.toString().padStart(2, '0')}-${año}`,
                }
            });

            const dataOrdenada = await ordenarArregloPorFamilia(resultMapeado)

            console.log('invoiceDetailResult*********', dataOrdenada[0])
            res.status(StatusCodes.OK).json({ ok: true, data: dataOrdenada })

        })
    } catch (error) {
        console.log('este error en pintura', error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message: 'Error al consultar reporte por conceptos de primera fase de pintura' })

    }
}

const conceptosReparacionSUM = async (req, res, next) => {

    try {
        ConceptosAdicionalesModel.findAll({
            where: {
                perId: req.body.periodo.perId,
                icoName:'REPARACION SUM'
            },
            include: [
                {
                model: InvoiceHeaderModel,
                as: 'conceptosAdicionalesInvoiceHeader',
                require: true,
                include: [
                {
                    model: FamilyModel,
                    as: 'familyInvoice',
                    require: true
                }]
            },
        ]
        }).then(async (invoiceDetailResult) => {

            console.log('invoiceDetailResult*********', invoiceDetailResult[0].dataValues)

            const resultMapeado = invoiceDetailResult.map((item, index) => {

                const date = new Date(item.dataValues.cadCreationDate);
                const dia = date.getUTCDate();
                const mes = date.getUTCMonth() + 1; // Se suma 1 porque los meses comienzan desde 0 (enero).
                const año = date.getUTCFullYear();
                return {
                    idFam: item.dataValues.conceptosAdicionalesInvoiceHeader?.dataValues.familyInvoice.famId,
                    familia: item.dataValues.conceptosAdicionalesInvoiceHeader?.dataValues.familyInvoice.famName,
                    montoPagado: item.cadMontoPagadoDolares,
                    costo: item.dataValues.cadCostoDolares,
                    fecha: `${dia.toString().padStart(2, '0')}-${mes.toString().padStart(2, '0')}-${año}`,
                }
            });

            const dataOrdenada = await ordenarArregloPorFamilia(resultMapeado)

            console.log('invoiceDetailResult*********', dataOrdenada[0])      
            res.status(StatusCodes.OK).json({ ok: true, data: dataOrdenada })

        })
    } catch (error) {
        console.log('este error en pintura', error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message: 'Error al consultar reporte por conceptos de primera fase de pintura' })

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
    graficaMorosos,
    conceptosFacturaSeguroEscolar,
    conceptosFacturaPintura,
    conceptosReparacionSUM
}