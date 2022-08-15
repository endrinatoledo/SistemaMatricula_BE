const {  StatusCodes } = require('http-status-codes')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const db = require("../models");

const StudentPaymentSchemeModel = db.studentPaymentSchemeModel

//Add PaymentSchema

const addStudentPaymentScheme =  async (req, res,next) =>{

    if (req.body.icoId === null || req.body.insId === null|| req.body.plsId === null) return res.status(406).json({ok: false, message: 'Todos los campos son obligatorios'});
    try {

            StudentPaymentSchemeModel.create({
              // stuId: req.body.stuId,
              // pcoId: req.body.pcoId,
              // pscId: req.body.pscId,
              icoId: req.body.icoId,
              spsAmount: req.body.spsAmount,
              spsAmountPaid: req.body.spsAmountPaid,
              insId: req.body.insId,
              plsId: req.body.plsId,
            })
            .then((studentPaymentSchema) => {
                message = 'Esquema de Pago de Estudiante creado con éxito';
                res.status(StatusCodes.OK).json({ok: true,data: studentPaymentSchema, message})
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
//get All PaymentSchema
const getAllStudentPaymentScheme =  async (req, res, next) =>{

    StudentPaymentSchemeModel.findAll({})
    .then((studentPaymentSchemes) => {
        res.status(StatusCodes.OK).json({ok: true, data: studentPaymentSchemes})
    }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
        next(err)
      })

}
//get All PaymentSchema by Id
const getOneStudentPaymentSchemeById =  async (req, res, next) =>{
  
    StudentPaymentSchemeModel.findOne({
        where: {
          spsId: req.params.spsId
        }
      })
      .then((studentPaymentSchema) => {
        res.status(StatusCodes.OK).json({ok: true, data: studentPaymentSchema})
      }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
        next(err)
      })

}
//Update PaymentSchema
const updateStudentPaymentScheme =  async (req, res, next) =>{
   
            StudentPaymentSchemeModel.findOne({
            where: {
              spsId: req.params.spsId          
            }
          }).then((studentPaymentSchema) => {
            studentPaymentSchema.update({
              // stuId: (req.body.stuId != null) ? req.body.stuId : studentPaymentSchema.stuId,
              // pcoId: (req.body.pcoId != null) ? req.body.pcoId : studentPaymentSchema.pcoId,
              // pscId: (req.body.pscId != null) ? req.body.pscId : studentPaymentSchema.pscId,
              icoId: (req.body.icoId != null) ? req.body.icoId : studentPaymentSchema.icoId,
              spsAmount: (req.body.spsAmount != null) ? req.body.spsAmount : studentPaymentSchema.spsAmount,
              spsAmountPaid: (req.body.spsAmountPaid != null) ? req.body.spsAmountPaid : studentPaymentSchema.spsAmountPaid,
              insId: (req.body.insId != null) ? req.body.insId : studentPaymentSchema.insId,
              plsId: (req.body.plsId != null) ? req.body.plsId : studentPaymentSchema.plsId,
            })
                .then((studentPaymentSchema) => {
                  message = 'Esquema de Pago de Estudiante actualizado con éxito';
                  res.status(StatusCodes.OK).json({ok: true, data:studentPaymentSchema, message})
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
//Delete PaymentSchema
const deleteStudentPaymentScheme =  async (req, res, next) =>{

    StudentPaymentSchemeModel.destroy({      
        where: {
          spsId: req.params.spsId
          }        
        }).then((rowsDeleted) => {  
        if(rowsDeleted > 0) {
          return res.status(StatusCodes.OK).json({ok: true, message: `Esquema de Pago de Estudiante eliminado con éxito`})  
        }else{
          return res.status(StatusCodes.OK).json({ok: false, message: `Error al eliminar Esquema de Pago de Estudiante`})  
        }
      }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false,message})
        next(err)
      })    

}

//get All PaymentSchema by Id
const getOneStudentPaymentSchemeByIdInscription =  async (req, res, next) =>{
  
  StudentPaymentSchemeModel.findAll({
      where: {
        insId: req.params.insId
      }
    })
    .then((studentPaymentSchema) => {
      res.status(StatusCodes.OK).json({ok: true, data: studentPaymentSchema})
    }, (err) => {
      message = err
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
      next(err)
    })

}

//get All PaymentSchema by Id
const deleteOneStudentPaymentSchemeByIdInscription =  async (req, res, next) =>{
  
  StudentPaymentSchemeModel.findOne({
    where: {
      spsId: req.params.spsId
    }
  })
  .then((result) => {

    if (result.spsAmountPaid === null){
      StudentPaymentSchemeModel.destroy({ 
        where: {
          spsId: req.params.spsId
        }
      })
      .then((studentPaymentSchema) => {
        console.log('esto traeeeee',studentPaymentSchema)
        res.status(StatusCodes.OK).json({ok: true,message:'Eliminado con exito', data: studentPaymentSchema})
      }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
        next(err)
      })

    }else{
      res.status(StatusCodes.OK).json({ok: false, data: [], message: 'Concepto tiene un pago asociado'})
    }
  }, (err) => {
    message = err
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
    next(err)
  })

}

//get All Inscription by Id
const getStudentPaymentByFamId =  async (req, res, next) =>{

  console.log('aquiiiiiiiiiiiiiii',req.params)
  try {
    StudentPaymentSchemeModel.findAll({
      include: [{
        model: invoiceConceptsModel,
        as: 'invoiceConcepts',
        require: true
      }]
      // include: [
      //   model: InscriptionsModel,
      //   as: 'inscriptions',
      //   require: true,
      //   // include: [
      //   //   {
      //   //     model: FamilyModel,
      //   //     as: 'family',
      //   //     require: true,
      //   //     where: {famId: req.params.famId}
      //   //   }
      //   // ]
      // }
      // {
      //   model: InvoiceConceptsModel,
      //   as: 'invoiceConcepts',
      //   require: true,
      // }
      // ]
    }).then((resul) => {
      console.log('resultttttttttttttttttttttttttttt',resul)
      if (resul === null) {
        res.status(StatusCodes.OK).json({ ok: true, data: [] })
      } else {
        res.status(StatusCodes.OK).json({ ok: true, data: resul })
      }
    }, (err) => {
      // message = err
      message = 'Error de conexión'
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, data: [], message })
      next(err)
    })
  } catch (error) {
    
  }

}

module.exports = {
    addStudentPaymentScheme,
    getAllStudentPaymentScheme,
    getOneStudentPaymentSchemeById,
    updateStudentPaymentScheme,
    deleteStudentPaymentScheme,
    getOneStudentPaymentSchemeByIdInscription,
    deleteOneStudentPaymentSchemeByIdInscription,
    getStudentPaymentByFamId,
  }
