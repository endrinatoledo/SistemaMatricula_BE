// const { default: ModelManager } = require("sequelize/types/model-manager");
const { StatusCodes } = require('http-status-codes')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const db = require("../models");
const InscriptionsModel = db.inscriptionsModel
const PeriodLevelSectionModel = db.periodLevelSectionModel
const PeriodsModel = db.periodsModel
const StudentModel = db.studentModel
const FamilyModel = db.familyModel
const LevelsModel = db.levelsModel
const SectionsModel = db.sectionsModel
const MonthlyPaymentModel = db.monthlyPaymentModel
const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']



//Add Inscription

const addInscription = async (req, res, next) => {


  if (!req.body.famId || !req.body.plsId || !req.body.stuId || !req.body.perId) return res.status(406).json({ ok: false, message: 'Todos los campos son obligatorios' });
  try {

    console.log('req.body.perId-----', req.body.perId)
    let idExists = await InscriptionsModel.findOne({
      where: {
        stuId: req.body.stuId,
        perId: req.body.perId,
        insStatus: 1
      }
    }).catch((err) => {
      console.log('error al buscar', err)
      throw err;
    });
    console.log('******************idExists',idExists)
    if (idExists) {
      return res.status(StatusCodes.OK).json({ ok: false, message: 'Alumno posee una inscripción activa en este periodo' })
    } else {

      InscriptionsModel.create({
        plsId: req.body.plsId,
        famId: req.body.famId,
        insObservation: req.body.insObservation,
        stuId: req.body.stuId,
        perId: req.body.perId,
        insStatus: 1
      })
        .then(async (inscription) => {
          console.log('resultado al crear', inscription)

          if(inscription.dataValues.plsId){


            let existsMonthlyPayment = await MonthlyPaymentModel.findAll({
              where: {
                stuId: req.body.stuId,
                perId: req.body.perId,
              }
            }).catch((err) => {
              throw err;
            });

            if(existsMonthlyPayment.length === 0){

              let levelSection = await PeriodLevelSectionModel.findOne({
                include: [{
                  model: PeriodsModel,
                  as: 'period',
                  require: true
                }
                ,{
                  model: LevelsModel,
                  as: 'level',
                  require: true
                },{
                  model: SectionsModel,
                  as: 'section',
                  require: true
                }
              ],
                  where: {
                    plsId: inscription.dataValues.plsId
                  }
              }).catch((err) => {
                throw err;
              });
  
              if(levelSection.dataValues.plsId){
  
                let arrayRespuestas = []

                for (let index = 0; index < meses.length; index++) {
                  arrayRespuestas.push(await MonthlyPaymentModel.create({
                    perId: req.body.perId,
                    stuId: req.body.stuId,
                    famId: req.body.famId,
                    levId: levelSection.dataValues.levId,
                    secId: levelSection.dataValues.secId,
                    insId: inscription.dataValues.insId,
                    mopAmount: 0,
                    mopAmountPaid: 0,
                    mopMonth: meses[index],
                    mopStatus: 2

                  })
                    .then((res) => {
                      messageRes = `Se agrego pago de mensualidades del estudiante `;
                      // console.log(messageRes)
                      return { messge: messageRes }
                    }, (err) => {
                      // console.log(`Error al cargar pago de mensualidades del estudiante`)
                      // console.log(`Error:  ${err}`)
                      messageRes = `Error al cargar pago de mensualidades del estudiante `;
                      return { messge: messageRes }
                    }))
                }

                // console.log('-------------------------------arrayRespuestas', arrayRespuestas)

                message = 'Inscripción creada con éxito';
                res.status(StatusCodes.OK).json({ ok: true, data: inscription, message })

                // const resEliminar = eliminarInscripcion(inscription.dataValues.insId)
                //     console.log('Se elimino inscripcion',resEliminar)
                  // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, data: [], message:'Error al registrar inscripción' })
                // const respuestaRegistrarMensualidad = await pagoMensualidades({
                //   perId: req.body.perId,
                //   stuId: req.body.stuId,
                //   famId: req.body.famId,
                //   levId: levelSection.dataValues.levId,
                //   secId: levelSection.dataValues.secId,
                //   insId: inscription.dataValues.insId,
                // })


                // console.log('-------------------------------respuestaRegistrarMensualidad', respuestaRegistrarMensualidad)
              //   MonthlyPaymentModel.create({
              //     perId: levelSection.dataValues.perId,
              //     stuId: inscription.dataValues.stuId,
              //     famId: inscription.dataValues.famId,
              //     levId: levelSection.dataValues.levId,
              //     secId: levelSection.dataValues.secId,
              //     mopEne: 'NO PAGADO',
              //     mopFeb: 'NO PAGADO',
              //     mopMar: 'NO PAGADO',
              //     mopAbr: 'NO PAGADO',
              //     mopMay: 'NO PAGADO',
              //     mopJun: 'NO PAGADO',
              //     mopJul: 'NO PAGADO',
              //     mopAgo: 'NO PAGADO',
              //     mopSep: 'NO PAGADO',
              //     mopOct: 'NO PAGADO',
              //     mopNov: 'NO PAGADO',
              //     mopDic: 'NO PAGADO',
        
              // })
              // .then((respuesta) => {
              //   if(respuesta?.dataValues?.mopId){
              //     message = 'Inscripción creada con éxito';
              //     res.status(StatusCodes.OK).json({ ok: true, data: inscription, message })
              //   }else{
              //     const resEliminar =  eliminarInscripcion(inscription.dataValues.insId)
              //     console.log('Se elimino inscripcion',resEliminar)
              //     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, data: [], message:'Error al registrar inscripción' })
  
              //   }
              //   }, (err) => {
              //     console.log('error al registrar mensualidades: ',err)
              //     const resEliminar =  eliminarInscripcion(inscription.dataValues.insId)
              //     console.log('Se elimino inscripcion',resEliminar)
              //     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, data: [], message:'Error al registrar inscripción' })
              //   })
              }else{
              const resEliminar =  eliminarInscripcion(inscription.dataValues.insId)
              // console.log('Se elimino inscripcion',resEliminar)
              res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, data: [], message:'Error al registrar inscripción' })
              }  

            }else{
              message = 'Inscripción creada con éxito';
              res.status(StatusCodes.OK).json({ ok: true, data: inscription, message })
            }

          
          }else{
            const resEliminar =  eliminarInscripcion(inscription.dataValues.insId)
            // console.log('Se elimino inscripcion',resEliminar)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, data: [], message:'Error al registrar inscripción' })
          }
        }, (err) => {
          message = 'Error de conexión'
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, data: [], message })
          next(err)
        }).catch((err) => {
          console.log('error al crear', err)
          throw err;
        });
    }
  } catch (err) {
    console.log('este errorrrr', err)
    message = 'Error de conexion al registrar inscripcion';
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message });
    next(err);
  }

}
//get All inscription
const getAllInscriptions = async (req, res, next) => {

  try {
    let lastPeriod = await PeriodsModel.findOne({ order: [['per_id', 'DESC']], where: { perStatus: 1 } }).catch((err) => {
      throw err;
    });

    if (lastPeriod !== undefined && lastPeriod !== null) {
      // const date = new Date();
      InscriptionsModel.findAll({
        where: { perId: lastPeriod.perId, insStatus : 1 },
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
          , {
          model: PeriodsModel,
          as: 'period',
          require: true,
        }
        ]
      })
        .then((inscriptions) => {
          res.status(StatusCodes.OK).json({ ok: true, data: inscriptions })
        }, (err) => {
          message = err
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message })
          next(err)
        })
    } else {
      message = 'No hay un periodo configurado'
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message })
      next(err)
    }
  } catch (error) {
      message = 'Error de conexion al consultar inscripciones'
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message })
      next(err)
    
  }
}
//get All Inscription by Id
const getOneInscriptionById = async (req, res, next) => {

  InscriptionsModel.findOne({
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
    }, {
      model: PeriodsModel,
      as: 'period',
      require: true
    }
    ],
    where: {
      insId: req.params.insId
    }
  })
    .then((inscription) => {
      res.status(StatusCodes.OK).json({ ok: true, data: inscription })
    }, (err) => {
      message = err
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message })
      next(err)
    })

}
//Update Inscription
const updateInscription = async (req, res, next) => {

  if (!req.params.insId) return res.status(406).json({ ok: false, message: 'Todos los campos son obligatorios' });

  try {
    InscriptionsModel.findOne({
      where: {
        insId: req.params.insId,
        insStatus: 1
      }
    }).then((inscription) => {

      if (inscription !== undefined && inscription !== null) {
        let status = null
        if (req.body.insStatus) {
          if (req.body.insStatus === 'Activa') {
            status = 2
          }
        }
        inscription.update({
          plsId: (req.body.plsId != null) ? req.body.plsId : inscription.plsId,
          insObservation: (req.body.insObservation != null) ? req.body.insObservation : inscription.insObservation,
          insStatus: (status) ? status : inscription.insStatus,
        })
          .then((inscription) => {
            message = 'Inscripción actualizada con éxito';
            res.status(StatusCodes.OK).json({ ok: true, data: inscription, message })
          }, (err) => {
            message = err
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message })
            next(err)
          })
      } else {
        message = 'Inscripción no encontrada';
        res.status(StatusCodes.OK).json({ ok: false, data: inscription, message })
      }
    }, (err) => {

      // console.log('-------------LINEA 219',err)

      message = err
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message })
      next(err)
    })
  } catch (error) {
    // console.log('-------------LINEA 226',err)

    message = err
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message })
    next(err)
  }
}

const eliminarInscripcion = async(insId) =>{

  try {
    InscriptionsModel.destroy({
      where: {
        insId: insId
      }
    }).then((rowsDeleted) => {
      if (rowsDeleted > 0) {
        return { ok: true, message: `Inscripción eliminada con éxito` }
      } else {
        return { ok: false, message: `Error al eliminar Inscripción` }
      }
    }, (err) => {
      message = err
      return { ok: false, message: 'Error al eliminar inscripcion:  '+err }
    })
  } catch (error) {
    return { ok: false, message: 'Error al eliminar inscripcion:  '+error }
  }

  

}

//Delete Inscription
const deleteInscription = async (req, res, next) => {

  InscriptionsModel.destroy({
    where: {
      insId: req.params.insId
    }
  }).then((rowsDeleted) => {
    if (rowsDeleted > 0) {
      return res.status(StatusCodes.OK).json({ ok: true, message: `Inscripción eliminada con éxito` })
    } else {
      return res.status(StatusCodes.OK).json({ ok: false, message: `Error al eliminar Inscripción` })
    }
  }, (err) => {
    message = err
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message })
    next(err)
  })

}

//get All Inscription by Id
const getOneInscriptionByStudentByPeriod = async (req, res, next) => {

  const students = req.body.students

  if (students.length > 0) {

    var promises = students.map(function (element) {
      return InscriptionsModel.findAll({
        where: {
          perId: req.body.period.perId,
          stuId: element.stuId,
          insStatus:1
        }
      })
        .then((student) => {
          if (student.length === 0) {
            let insert = {
              stuId: element.stuId,
              stuIdType: (element.stuIdType) ? element.stuIdType : '',
              stuFirstName: element.stuFirstName,
              stuIdentificationNumber: (element.stuIdentificationNumber) ? element.stuIdentificationNumber : '',
              stuSurname: element.stuSurname,
            }
            return insert
          }
        }, (err) => {
          message = 'Error al consultar inscripcion'
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message })
          next(err)
        })
    })

    Promise.all(promises).then(function (result) {
      if (result.length > 0) {
        const endData = result.filter((item) => item !== undefined)
        return res.status(StatusCodes.OK).json({ ok: true, data: endData })
      } else {
        return res.status(StatusCodes.OK).json({ ok: true, data: result })
      }
    })
  } else {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message: 'No hay estudiantes para mostrar' })
  }
}

//get All Inscription by IdFam
const getInscriptionsByFamId = async (req, res, next) => {

  try {
    InscriptionsModel.findAll({
      where: {
        famId: req.params.famId,
        insStatus:1
      }
    })
      .then((inscription) => {
        res.status(StatusCodes.OK).json({ ok: true, data: inscription })
      }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message })
        next(err)
      })
  } catch (error) {
    message = err;
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message });
    next(err);
  }
}

const getAllInscriptionsByPeriod = async (req, res, next) => {


  try {
      InscriptionsModel.findAll({
        where: { perId: req.body.perId },
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
          , {
          model: PeriodsModel,
          as: 'period',
          require: true,
        }
        ]
      })
        .then((inscriptions) => {
          res.status(StatusCodes.OK).json({ ok: true, data: inscriptions })
        }, (err) => {
          message = err
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message })
          next(err)
        })

  } catch (error) {
    message = 'Error de conexion al consultar inscripciones'
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message })
    next(err)

  }
}

module.exports = {
  addInscription,
  getAllInscriptions,
  getOneInscriptionById,
  updateInscription,
  deleteInscription,
  getOneInscriptionByStudentByPeriod,
  getInscriptionsByFamId,
  getAllInscriptionsByPeriod

}
