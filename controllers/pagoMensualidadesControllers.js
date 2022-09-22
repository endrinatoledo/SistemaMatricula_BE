
const {  StatusCodes } = require('http-status-codes')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const db = require("../models");
const meses = ['Enero','Febrero','Marzo','Abril','Mayo', 'Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

const MonthlyPaymentModel = db.monthlyPaymentModel
const PeriodsModel = db.periodsModel
const InscriptionsModel = db.inscriptionsModel
const PeriodLevelSectionModel = db.periodLevelSectionModel
const StudentModel = db.studentModel
const FamilyModel = db.familyModel
const LevelsModel = db.levelsModel
const SectionsModel = db.sectionsModel


const agregarPagosMensuales =  async (objData) =>{

    let arrayRespuestas = []

    meses.forEach(async element => {

        arrayRespuestas.push(await MonthlyPaymentModel.create({
            perId: objData.perId,
            mopMonth: element,
            stuId: objData.stuId,
            famId: objData.famId,
            mopStatus: 2,
            levId: objData.levId,
            secId: objData.secId,
        })
        .then((res) => {
            messageRes = `Se agrego mes ${element} del estudiante ${objData.student}`;
            return {messge: messageRes}
          }, (err) => {
            messageRes = `Error al cargar mes ${element} del estudiante ${objData.student}`;
            return {messge: messageRes}
          }))
    });
 }

const validarTodosEstudiantes =  async () =>{

 PeriodsModel.findOne({
    order:[['per_id','DESC']],
    where: {
      perStatus: 1
    }
  }).then((period) => {


     InscriptionsModel.findAll({
        where: {
            perId: period.dataValues.perId
        },
        include: [{
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
            , {
            model: StudentModel,
            as: 'student',
            require: true
          }, {
            model: FamilyModel,
            as: 'family',
            require: true
          }
          ]
      }).then((inscripciones) => {

        if(inscripciones.length > 0){

            inscripciones.forEach(async element => {
                
                const objData = {
                    perId : element.dataValues.perId,
                    stuId : element.dataValues.stuId,
                    famId : element.dataValues.famId,
                    levId : element.dataValues.periodLevelSectionI.dataValues.levId,
                    secId : element.dataValues.periodLevelSectionI.dataValues.secId,
                    student :`CI: ${element.dataValues.student.dataValues.stuIdType}-${element.dataValues.student.dataValues.stuIdentificationNumber}: ${element.dataValues.student.dataValues.stuFirstName} ${element.dataValues.student.dataValues.stuSecondName} ${element.dataValues.student.dataValues.stuSurname} ${element.dataValues.student.dataValues.stuSecondSurname}` 
                }
                
                const respPagoMensualidades = await agregarPagosMensuales(objData)

            });
            
        }else{
            message = 'Sin inscripciones para mostrar';
            return{statusCode : 400, ok: false, message}
        }

      })
      .catch((err) => {
        console.log('..........................ERROR...............',err)
        message = `Error al consultar Inscripciones ${err}`;
        return{statusCode : 500, ok: false, message}
      });

  }).catch((err) => {
    console.log('..........................ERROR...............',err)

    message = `Error al consultar periodo ${err}`;
    return{statusCode : 500, ok: false, message}

  });

}

const consultarTablaPagoMensualidades = async() => {

}
const consultarTablaPagoMensualidadesPorEstudiante = async() => {

}

validarTodosEstudiantes()

module.export = {
    agregarPagosMensuales,
    validarTodosEstudiantes,
    consultarTablaPagoMensualidades,
    consultarTablaPagoMensualidadesPorEstudiante,
}