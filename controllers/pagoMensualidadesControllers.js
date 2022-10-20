
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
          insId: { [Op.between]: [0, 100] } // repetir de 100 en 100
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

              // console.log('---respPagoMensualidades---------------index-----------', JSON.stringify(respPagoMensualidades) )

            } else {
              // console.log('---inscripciones---------------index-----------',index)
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
        }
      ]
    })
    .then((monthlyPayment) => {

      if(monthlyPayment.length > 0){
        const dataForm = monthlyPayment.map(item =>{

          const student = item.dataValues.student.dataValues
          return {
            mopId : item.dataValues.mopId,
            student : `${student.stuFirstName} ${student.stuSecondName ? student.stuSecondName : ''} ${student.stuSurname} ${student.stuSecondSurname ? student.stuSecondSurname : ''}`,          
            ene : item.dataValues.mopEne === 'NO PAGADO' ? 2 : 1,
            feb : item.dataValues.mopFeb === 'NO PAGADO' ? 2 : 1,
            mar : item.dataValues.mopMar === 'NO PAGADO' ? 2 : 1,
            abr : item.dataValues.mopAbr === 'NO PAGADO' ? 2 : 1,
            may : item.dataValues.mopMay === 'NO PAGADO' ? 2 : 1,
            jun : item.dataValues.mopJun === 'NO PAGADO' ? 2 : 1,
            jul : item.dataValues.mopJul === 'NO PAGADO' ? 2 : 1,
            ago : item.dataValues.mopAgo === 'NO PAGADO' ? 2 : 1,
            sep : item.dataValues.mopSep === 'NO PAGADO' ? 2 : 1,
            oct : item.dataValues.mopOct === 'NO PAGADO' ? 2 : 1,
            nov : item.dataValues.mopNov === 'NO PAGADO' ? 2 : 1,
            dic : item.dataValues.mopDic === 'NO PAGADO' ? 2 : 1
          }
        })

        res.status(StatusCodes.OK).json({ok: true, data: dataForm})
      }else{
        res.status(StatusCodes.OK).json({ok: false, data: [], message:'Sin mensualidades para mostrar'})
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

validarTodosEstudiantes()

module.exports = {
    getTablaPagoMensualidadesPorFamilia,
    getTablaPagoMensualidadesPorEstudiante,
}