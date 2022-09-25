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


//Add Inscription

const addInscription = async (req, res, next) => {

  if (!req.body.famId || !req.body.plsId || !req.body.stuId || !req.body.perId) return res.status(406).json({ ok: false, message: 'Todos los campos son obligatorios' });
  try {

    let idExists = await InscriptionsModel.findOne({
      where: {
        stuId: req.body.stuId,
        perId: req.body.perId,
        insStatus: 1
      }
    }).catch((err) => {
      throw err;
    });
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
          if(inscription.dataValues.plsId){

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

              MonthlyPaymentModel.create({
                perId: levelSection.dataValues.perId,
                stuId: inscription.dataValues.stuId,
                famId: inscription.dataValues.famId,
                levId: levelSection.dataValues.levId,
                secId: levelSection.dataValues.secId,
                mopEne: 'NO PAGADO',
                mopFeb: 'NO PAGADO',
                mopMar: 'NO PAGADO',
                mopAbr: 'NO PAGADO',
                mopMay: 'NO PAGADO',
                mopJun: 'NO PAGADO',
                mopJul: 'NO PAGADO',
                mopAgo: 'NO PAGADO',
                mopSep: 'NO PAGADO',
                mopOct: 'NO PAGADO',
                mopNov: 'NO PAGADO',
                mopDic: 'NO PAGADO',
      
            })
            .then((respuesta) => {
              if(respuesta?.dataValues?.mopId){
                message = 'Inscripción creada con éxito';
                res.status(StatusCodes.OK).json({ ok: true, data: inscription, message })
              }else{
                const resEliminar =  eliminarInscripcion(inscription.dataValues.insId)
                console.log('Se elimino inscripcion',resEliminar)
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, data: [], message:'Error al registrar inscripción' })

              }
              }, (err) => {
                console.log('error al registrar mensualidades: ',err)
                const resEliminar =  eliminarInscripcion(inscription.dataValues.insId)
                console.log('Se elimino inscripcion',resEliminar)
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, data: [], message:'Error al registrar inscripción' })
              })
            }else{
            const resEliminar =  eliminarInscripcion(inscription.dataValues.insId)
            console.log('Se elimino inscripcion',resEliminar)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, data: [], message:'Error al registrar inscripción' })
            }            
          }else{
            const resEliminar =  eliminarInscripcion(inscription.dataValues.insId)
            console.log('Se elimino inscripcion',resEliminar)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, data: [], message:'Error al registrar inscripción' })
          }
        }, (err) => {
          message = 'Error de conexión'
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, data: [], message })
          next(err)
        })
    }
  } catch (err) {
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
    console.log('eor3...............................................',error)
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

console.log('ENTRO A ACTUALIZAD body',req.body)
  try {
    InscriptionsModel.findOne({
      where: {
        insId: req.params.insId,
        insStatus: 1
      }
    }).then((inscription) => {

      console.log('---********************************************---inscription 189',inscription)
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

            console.log('resultado de buscar inscripcion',inscription)

            message = 'Inscripción actualizada con éxito';
            res.status(StatusCodes.OK).json({ ok: true, data: inscription, message })
          }, (err) => {
            message = err
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message })
            next(err)
          })
      } else {
        console.log('-------------Inscripción no encontrada')
        message = 'Inscripción no encontrada';
        res.status(StatusCodes.OK).json({ ok: false, data: inscription, message })
      }
    }, (err) => {

      console.log('-------------LINEA 219',err)

      message = err
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message })
      next(err)
    })
  } catch (error) {
    console.log('-------------LINEA 226',err)

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
          perId: element.stuId
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
        famId: req.params.famId
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

module.exports = {
  addInscription,
  getAllInscriptions,
  getOneInscriptionById,
  updateInscription,
  deleteInscription,
  getOneInscriptionByStudentByPeriod,
  getInscriptionsByFamId,

}
