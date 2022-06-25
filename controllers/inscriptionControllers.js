// const { default: ModelManager } = require("sequelize/types/model-manager");
const {  StatusCodes } = require('http-status-codes')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const db = require("../models");

const InscriptionsModel = db.inscriptionsModel
const PeriodLevelSectionModel = db.periodLevelSectionModel
const RepresentativeStudentModel = db.representativeStudentModel
const PeriodsModel = db.periodsModel
const StudentModel = db.studentModel
const FamilyModel = db.familyModel


//Add Inscription

const addInscription =  async (req, res, next) =>{

    if ( !req.body.famId|| !req.body.plsId || !req.body.stuId ) return res.status(406).json({ok: false, message: 'Todos los campos son obligatorios'});
    try {

        let idExists = await InscriptionsModel.findOne({
            where: { 
              stuId: req.body.stuId,
              perId : req.body.perId
            }
          }).catch((err) => {
            throw err; 
          });
          if (idExists){
            return res.status(StatusCodes.OK).json({ok: false, message: 'Alumno ya inscrito en este periodo'})
          }else{

            InscriptionsModel.create({
              plsId: req.body.plsId,
              famId: req.body.famId,
              insObservation: req.body.insObservation,
              stuId: req.body.stuId,
              perId : req.body.perId
            })
            .then((inscription) => {

                message = 'Inscripción creada con éxito';
                res.status(StatusCodes.OK).json({ok: true,data: inscription, message})
              }, (err) => {
                message = 'Error de conexión'
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false,data: [], message})
                next(err)
              })
          }
    } catch (err) {
        message = err;
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message });
        next(err);
      }

}
//get All inscription
const getAllInscriptions =  async (req, res, next) =>{

    InscriptionsModel.findAll({
      include: [{
        model: PeriodLevelSectionModel,
        as: 'periodLevelSectionI',
        require: true
      }
      ,{
        model: StudentModel,
        as: 'student',
        require: true
      },{
        model: FamilyModel,
        as: 'family',
        require: true
      },{
        model: PeriodsModel,
        as: 'period',
        require: true
      }  
    ]
    })
    .then((inscriptions) => {
        res.status(StatusCodes.OK).json({ok: true, data: inscriptions})
    }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
        next(err)
      })

}
//get All Inscription by Id
const getOneInscriptionById =  async (req, res, next) =>{

    InscriptionsModel.findOne({
      include: [{
        model: PeriodLevelSectionModel,
        as: 'periodLevelSectionI',
        require: true
      }
      ,{
        model: StudentModel,
        as: 'student',
        require: true
      },{
        model: FamilyModel,
        as: 'family',
        require: true
      },{
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
        res.status(StatusCodes.OK).json({ok: true, data: inscription})
      }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
        next(err)
      })

}
//Update Inscription
const updateInscription =  async (req, res, next) =>{

    InscriptionsModel.findOne({
        where: {
          stuId: req.body.stuId,
          perId : req.body.perId,
          insId: {
            [Op.ne]: req.params.insId
          }
        },
        include: [{
          model: PeriodLevelSectionModel,
          as: 'periodLevelSectionI',
          require: true
        }
        ,{
          model: StudentModel,
          as: 'student',
          require: true
        },{
          model: FamilyModel,
          as: 'family',
          require: true
        },{
          model: PeriodsModel,
          as: 'period',
          require: true
        }  
      ]
      })
      .then((inscription) => {

        if(inscription){
          return res.status(StatusCodes.OK).json({ok: false, message: 'Inscripción ya se encuentra registrada'})
        }else{    
            InscriptionsModel.findOne({
            where: {
              insId: req.params.insId          
            }
          }).then((inscription) => {
                inscription.update({
                  // rstId: (req.body.rstId != null) ? req.body.rstId : inscription.rstId,
                  plsId: (req.body.plsId != null) ? req.body.plsId : inscription.plsId,
                  insObservation: (req.body.insObservation != null) ? req.body.insObservation : inscription.insObservation,

                })
                .then((inscription) => {
                  message = 'Inscripción actualizada con éxito';
                  res.status(StatusCodes.OK).json({ok: true, data:inscription, message})
                }, (err) => {
                  message = err
                  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
                  next(err)
                })
              }, (err) => {
                message = err
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
                next(err)
              })    
        }
      }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
        next(err)
      })

}

//Delete Inscription
const deleteInscription =  async (req, res, next) =>{

    InscriptionsModel.destroy({      
        where: {
          insId: req.params.insId
          }        
        }).then((rowsDeleted) => {  
        if(rowsDeleted > 0) {
          return res.status(StatusCodes.OK).json({ok: true, message: `Inscripción eliminada con éxito`})  
        }else{
          return res.status(StatusCodes.OK).json({ok: false, message: `Error al eliminar Inscripción`})  
        }
      }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false,message})
        next(err)
      })    

}


module.exports = {
    addInscription,
    getAllInscriptions,
    getOneInscriptionById,
    updateInscription,
    deleteInscription
}
