const {  StatusCodes } = require('http-status-codes')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const db = require("../models");

const PaymentsConceptsStudentsModel = db.paymentsConceptsStudentsModel

//Add PaymentsConceptsStudents

const addPaymentsConceptsStudents =  async (req, res,next) =>{

    if (req.body.spsId === null || req.body.famId === null ) return res.status(406).json({ok: false, message: 'Todos los campos son obligatorios'});
    try {

            PaymentsConceptsStudentsModel.create({
              spsId: req.body.spsId,
              famId: req.body.famId,
            })
            .then((paymentsConceptsStudents) => {
                message = 'pagos conceptos estudiantes creado con éxito';
                res.status(StatusCodes.OK).json({ok: true,data: paymentsConceptsStudents, message})
              }, (err) => {
                message = err
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message})
                next(err)
              })


    } catch (err) {
        message = err;
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message });
        next(err);
      }

}
//get All PaymentsConceptsStudents
const getAllPaymentsConceptsStudents =  async (req, res, next) =>{

    PaymentsConceptsStudentsModel.findAll({})
    .then((paymentsConceptsStudents) => {
        res.status(StatusCodes.OK).json({ok: true, data: paymentsConceptsStudents})
    }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
        next(err)
      })

}
//get All PaymentsConceptsStudents by Id
const getOnePaymentsConceptsStudentsById =  async (req, res, next) =>{
  
    PaymentsConceptsStudentsModel.findOne({
        where: {
          pcsId: req.params.pcsId
        }
      })
      .then((paymentsConceptsStudents) => {
        res.status(StatusCodes.OK).json({ok: true, data: paymentsConceptsStudents})
      }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
        next(err)
      })

}
//Update PaymentsConceptsStudents
const updatePaymentsConceptsStudents =  async (req, res, next) =>{
   
            PaymentsConceptsStudentsModel.findOne({
            where: {
              pcsId: req.params.pcsId          
            }
          }).then((paymentsConceptsStudents) => {
            paymentsConceptsStudents.update({
              spsId: (req.body.spsId != null) ? req.body.spsId : paymentsConceptsStudents.spsId,
              famId: (req.body.famId != null) ? req.body.famId : paymentsConceptsStudents.famId,
            })
                .then((paymentsConceptsStudents) => {
                  message = 'pagos conceptos estudiantes actualizado con éxito';
                  res.status(StatusCodes.OK).json({ok: true, data:paymentsConceptsStudents, message})
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
//Delete PaymentsConceptsStudents
const deletePaymentsConceptsStudents =  async (req, res, next) =>{

    PaymentsConceptsStudentsModel.destroy({      
        where: {
          pcsId: req.params.pcsId
          }        
        }).then((rowsDeleted) => {  
        if(rowsDeleted > 0) {
          return res.status(StatusCodes.OK).json({ok: true, message: `pagos conceptos estudiantes eliminado con éxito`})  
        }else{
          return res.status(StatusCodes.OK).json({ok: false, message: `Error al eliminar pagos conceptos estudiantes`})  
        }
      }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false,message})
        next(err)
      })    

}


module.exports = {
    addPaymentsConceptsStudents,
    getAllPaymentsConceptsStudents,
    getOnePaymentsConceptsStudentsById,
    updatePaymentsConceptsStudents,
    deletePaymentsConceptsStudents,

}
