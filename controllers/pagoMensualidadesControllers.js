
const {  StatusCodes } = require('http-status-codes')
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
const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']


const agregarPagosMensuales =  async (objData) =>{

    let arrayRespuestas = []

    try {
      for (let index = 0; index < meses.length; index++) {
        console.log('*******************************************', objData)
        arrayRespuestas.push(await MonthlyPaymentModel.create({
          perId: objData.perId,
          stuId: objData.stuId,
          famId: objData.famId,
          levId: objData.levId,
          secId: objData.secId,
          insId: objData.insId,
          mopAmount: 0,
          mopAmountPaid: 0,
          mopMonth: meses[index],
          mopStatus: 2

        })
          .then((res) => {
            messageRes = `Se agrego pago de mensualidades del estudiante ${objData.student}`;
            return { messge: messageRes }
          }, (err) => {
            messageRes = `Error al cargar pago de mensualidades del estudiante ${objData.student}`;
            return { messge: messageRes }
          }))
      }
    } catch (error) {
      console.log('..........................................', error)
    }

        

 }

const validarTodosEstudiantes =  async () =>{

  console.log('entroooooooooooooooooooooo')
  try {
    
    PeriodsModel.findOne({
      order: [['per_id', 'DESC']],
      where: {
        perStatus: 1
      }
    }).then((period) => {


      InscriptionsModel.findAll({
        where: {
          perId: period.dataValues.perId,
          insId: { [Op.between]: [901, 800] } // repetir de 100 en 100
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

        if (inscripciones.length > 0) {

          inscripciones.forEach(async (element, index) => {

            let existsMonthlyPayment = await MonthlyPaymentModel.findAll({
              where: {
                stuId: element.dataValues.stuId,
                perId: element.dataValues.perId,
              }
            }).catch((err) => {
              throw err;
            });


            if (existsMonthlyPayment.length === 0) {
              const objData = {
                perId: element.dataValues.perId,
                stuId: element.dataValues.stuId,
                famId: element.dataValues.famId,
                levId: element.dataValues.periodLevelSectionI.dataValues.levId,
                secId: element.dataValues.periodLevelSectionI.dataValues.secId,
                student: `CI: ${element.dataValues.student.dataValues.stuIdType}-${element.dataValues.student.dataValues.stuIdentificationNumber}: ${element.dataValues.student.dataValues.stuFirstName} ${element.dataValues.student.dataValues.stuSecondName} ${element.dataValues.student.dataValues.stuSurname} ${element.dataValues.student.dataValues.stuSecondSurname}`,
                insId: element.dataValues.insId
              }

              const respPagoMensualidades = await agregarPagosMensuales(objData)

              console.log('---respPagoMensualidades---------------index-----------', JSON.stringify(respPagoMensualidades) )

            } else {
              console.log('---inscripciones---------------index-----------',index)
            }
          });

          message = 'Operación finalizada';
          return { statusCode: 400, ok: false, message }

        } else {
          message = 'Sin inscripciones para mostrar';
          return { statusCode: 400, ok: false, message }
        }

      })
        .catch((err) => {
          console.log('..........................ERROR...............', err)
          message = `Error al consultar Inscripciones ${err}`;
          return { statusCode: 500, ok: false, message }
        });

    }).catch((err) => {
      console.log('..........................ERROR...............', err)

      message = `Error al consultar periodo ${err}`;
      return { statusCode: 500, ok: false, message }

    });

  } catch (error) {
    console.log('errorrrrrrrrrrrrrrrrrrrrrrrrrrrrrr 156', error)
  }


}

const getTablaPagoMensualidadesPorFamilia = async(req, res) => {

  try {
    MonthlyPaymentModel.findAll({
      where: {
          famId: req.params.famId
      },
      include: [
        {
          model: StudentModel,
          as: 'student',
          require: true
        }, {
          model: LevelsModel,
          as: 'level',
          require: true
        }
      ]
    })
    .then((monthlyPayment) => {    

      console.log('******************************',monthlyPayment[0])
      if(monthlyPayment.length > 0){
        let hash = {};
        const data3 = monthlyPayment.filter(o => hash[o.stuId] ? false : hash[o.stuId] = true);

        const listadoEstudiantesPorFamilia = data3.map(estudiante => {
          // console.log('....estudiante.........................', estudiante)

          const studentData = estudiante.dataValues.student.dataValues

          return {
            // mopId: estudiante.dataValues.mopId,
            perId: estudiante.dataValues.perId,
            stuId: estudiante.dataValues.stuId,
            insId: estudiante.dataValues.insId,
            student: `${studentData.stuFirstName} ${studentData.stuSecondName ? studentData.stuSecondName : ''} ${studentData.stuSurname} ${studentData.stuSecondSurname ? studentData.stuSecondSurname : ''}`,          
            ene: null,
            feb: null,
            mar: null,
            abr: null,
            may: null,
            jun: null,
            jul: null,
            ago: null,
            sep: null,
            oct: null,
            nov: null,
            dic: null
          }
        })
        // console.log('.........eliminarRepetidos.....................', listadoEstudiantesPorFamilia)

        for (let index = 0; index < listadoEstudiantesPorFamilia.length; index++) {

          for (let index2 = 0; index2 < monthlyPayment.length; index2++) {

            if (listadoEstudiantesPorFamilia[index].stuId === monthlyPayment[index2].dataValues.stuId){
              if (monthlyPayment[index2].dataValues.mopMonth === 'enero') listadoEstudiantesPorFamilia[index].ene = { mopId: monthlyPayment[index2].dataValues.mopId ,mopStatus : monthlyPayment[index2].dataValues.mopStatus}
              if (monthlyPayment[index2].dataValues.mopMonth === 'febrero') listadoEstudiantesPorFamilia[index].feb = { mopId: monthlyPayment[index2].dataValues.mopId, mopStatus: monthlyPayment[index2].dataValues.mopStatus}
              if (monthlyPayment[index2].dataValues.mopMonth === 'marzo') listadoEstudiantesPorFamilia[index].mar = { mopId: monthlyPayment[index2].dataValues.mopId, mopStatus: monthlyPayment[index2].dataValues.mopStatus}
              if (monthlyPayment[index2].dataValues.mopMonth === 'abril') listadoEstudiantesPorFamilia[index].abr = { mopId: monthlyPayment[index2].dataValues.mopId, mopStatus: monthlyPayment[index2].dataValues.mopStatus}
              if (monthlyPayment[index2].dataValues.mopMonth === 'mayo') listadoEstudiantesPorFamilia[index].may = { mopId: monthlyPayment[index2].dataValues.mopId, mopStatus: monthlyPayment[index2].dataValues.mopStatus}
              if (monthlyPayment[index2].dataValues.mopMonth === 'junio') listadoEstudiantesPorFamilia[index].jun = { mopId: monthlyPayment[index2].dataValues.mopId, mopStatus: monthlyPayment[index2].dataValues.mopStatus}
              if (monthlyPayment[index2].dataValues.mopMonth === 'julio') listadoEstudiantesPorFamilia[index].jul = { mopId: monthlyPayment[index2].dataValues.mopId, mopStatus: monthlyPayment[index2].dataValues.mopStatus}
              if (monthlyPayment[index2].dataValues.mopMonth === 'agosto') listadoEstudiantesPorFamilia[index].ago = { mopId: monthlyPayment[index2].dataValues.mopId, mopStatus: monthlyPayment[index2].dataValues.mopStatus}
              if (monthlyPayment[index2].dataValues.mopMonth === 'septiembre') listadoEstudiantesPorFamilia[index].sep = { mopId: monthlyPayment[index2].dataValues.mopId, mopStatus: monthlyPayment[index2].dataValues.mopStatus}
              if (monthlyPayment[index2].dataValues.mopMonth === 'octubre') listadoEstudiantesPorFamilia[index].oct = { mopId: monthlyPayment[index2].dataValues.mopId, mopStatus: monthlyPayment[index2].dataValues.mopStatus}
              if (monthlyPayment[index2].dataValues.mopMonth === 'noviembre') listadoEstudiantesPorFamilia[index].nov = { mopId: monthlyPayment[index2].dataValues.mopId, mopStatus: monthlyPayment[index2].dataValues.mopStatus}
              if (monthlyPayment[index2].dataValues.mopMonth === 'diciembre') listadoEstudiantesPorFamilia[index].dic = { mopId: monthlyPayment[index2].dataValues.mopId, mopStatus: monthlyPayment[index2].dataValues.mopStatus}

            }

          }
          
        }

        // const dataForm = monthlyPayment.map(item =>{

        //   const student = item.dataValues.student.dataValues
        //   return {
        //     mopId : item.dataValues.mopId,
        //     student : `${student.stuFirstName} ${student.stuSecondName ? student.stuSecondName : ''} ${student.stuSurname} ${student.stuSecondSurname ? student.stuSecondSurname : ''}`,          
        //     ene : item.dataValues.mopEne === 'NO PAGADO' ? 2 : 1,
        //     feb : item.dataValues.mopFeb === 'NO PAGADO' ? 2 : 1,
        //     mar : item.dataValues.mopMar === 'NO PAGADO' ? 2 : 1,
        //     abr : item.dataValues.mopAbr === 'NO PAGADO' ? 2 : 1,
        //     may : item.dataValues.mopMay === 'NO PAGADO' ? 2 : 1,
        //     jun : item.dataValues.mopJun === 'NO PAGADO' ? 2 : 1,
        //     jul : item.dataValues.mopJul === 'NO PAGADO' ? 2 : 1,
        //     ago : item.dataValues.mopAgo === 'NO PAGADO' ? 2 : 1,
        //     sep : item.dataValues.mopSep === 'NO PAGADO' ? 2 : 1,
        //     oct : item.dataValues.mopOct === 'NO PAGADO' ? 2 : 1,
        //     nov : item.dataValues.mopNov === 'NO PAGADO' ? 2 : 1,
        //     dic : item.dataValues.mopDic === 'NO PAGADO' ? 2 : 1
        //   }
        // })

        res.status(StatusCodes.OK).json({ ok: true, data: listadoEstudiantesPorFamilia, dataDetalle: monthlyPayment})
      }else{
        res.status(StatusCodes.OK).json({ok: false, data: [], dataDetalle:[], message:'Sin mensualidades para mostrar'})
      }
      
    }, (err) => {
      console.log('Error al consultar mensualidades por familia: ',err)
      message = 'Error al consultar mensualidades por familia'
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false,data:[], message})
    })

  } catch (error) {
    console.log('Error al consultar mensualidades por familia: ',error)
    message = 'Error de conexión al consultar mensualidades por familia'
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false,data:[], message})
  }

}
const getTablaPagoMensualidadesPorEstudiante = async(req, res) => {
  
  try {
    MonthlyPaymentModel.findAll({
      where: {
          stuId: req.params.stuId
      }
    })
    .then((monthlyPayment) => {
      res.status(StatusCodes.OK).json({ok: true, data: monthlyPayment})
    }, (err) => {
      console.log('Error al consultar mensualidades por estudiante: ',err)
      message = 'Error al consultar mensualidades por estudiante'
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false,data:[], message})
    })

  } catch (error) {
    console.log('Error al consultar mensualidades por estudiante: ',error)
    message = 'Error de conexión al consultar mensualidades por estudiante'
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false,data:[], message})
  }

}

// validarTodosEstudiantes()

module.exports = {
    getTablaPagoMensualidadesPorFamilia,
    getTablaPagoMensualidadesPorEstudiante,
}