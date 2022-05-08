// const { default: ModelManager } = require("sequelize/types/model-manager");
const {  StatusCodes } = require('http-status-codes')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const db = require("../models");
const encbcrypt = require('../utils/bcrypt');

const StudentModel = db.studentModel
const FederalEntityModel = db.federalEntityModel
const CountriesModel = db.countriesModel


//Add student

const addStudent =  async (req, res, next) =>{


    if (!req.body.stuFirstName || !req.body.stuSurname || !req.body.stuIdType || 
       !req.body.stuIdentificationNumber|| !req.body.stuDdateOfBirth || !req.body.stuSex|| 
       !req.body.couId || !req.body.fedId|| !req.body.stuPhoto || !req.body.stuStatus
       ) return res.status(406).json({ok: false, message: 'Todos los campos son obligatorios'});
    try {

        let idExists = await StudentModel.findOne({
            where: { stuIdentificationNumber: req.body.stuIdentificationNumber,
              stuIdType: req.body.stuIdType }
      
          }).catch((err) => {
            throw err; 
          });

          if (idExists){

            return res.status(StatusCodes.OK).json({ok: false, message: 'Identificación ya se encuentra registrada'})
          }else{

            StudentModel.create({
              stuFirstName: req.body.stuFirstName,
              stuSecondName: (req.body.stuSecondName)?req.body.stuSecondName : '',
              stuSurname: req.body.stuSurname,
              stuSecondSurname: (req.body.stuSecondSurname)?req.body.stuSecondSurname : '',
              stuIdType: req.body.stuIdType,
              stuIdentificationNumber: req.body.stuIdentificationNumber,
              stuDdateOfBirth: req.body.stuDdateOfBirth,
              stuSex: req.body.stuSex,
              couId: req.body.couId,
              fedId: req.body.fedId,
              stuPhoto: req.body.stuPhoto,
              stuStatus: req.body.stuStatus,
            })
            .then((student) => {

                message = 'Estudiante creado con éxito';
                res.status(StatusCodes.OK).json({ok: true,data: student, message})
              }, (err) => {
                // message = err
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
//get All student
const getAllStudents =  async (req, res, next) =>{

    StudentModel.findAll({
      include: [{
        model: CountriesModel,
        as: 'countries',
        require: true
      }
      ,{
        model: FederalEntityModel,
        as: 'federalEntity',
        require: true
      }
    ]
    })
    .then((students) => {
        res.status(StatusCodes.OK).json({ok: true, data: students})
    }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
        next(err)
      })

}
//get All student by Id
const getOneStudentById =  async (req, res, next) =>{

    StudentModel.findOne({
        where: {
          stuId: req.params.stuId
        }
      })
      .then((student) => {
        res.status(StatusCodes.OK).json({ok: true, data: student})
      }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
        next(err)
      })

}
//Update student
const updateStudent =  async (req, res, next) =>{

    StudentModel.findOne({
        where: {
          stuIdentificationNumber: req.body.stuIdentificationNumber,
          stuIdType: req.body.stuIdType,
          stuId: {
            [Op.ne]: req.params.stuId
          }
        }
      })
      .then((student) => {
        if(student){
          return res.status(StatusCodes.OK).json({ok: false, message: 'Estudiante ya se encuentra registrado'})
        }else{    
            StudentModel.findOne({
            where: {
              stuId: req.params.stuId          
            }
          }).then((student) => {
                student.update({
                  stuFirstName: (req.body.stuFirstName != null) ? req.body.stuFirstName : student.stuFirstName,
                  stuSecondName: (req.body.stuSecondName != null) ? req.body.stuSecondName : student.stuSecondName,
                  stuSurname: (req.body.stuSurname != null) ? req.body.stuSurname : student.stuSurname,
                  stuSecondSurname: (req.body.stuSecondSurname != null) ? req.body.stuSecondSurname : student.stuSecondSurname,
                  stuIdType: (req.body.stuIdType != null) ? req.body.stuIdType : student.stuIdType,
                  stuIdentificationNumber: (req.body.stuIdentificationNumber != null) ? req.body.stuIdentificationNumber : student.stuIdentificationNumber,
                  stuDdateOfBirth: (req.body.stuDdateOfBirth != null) ? req.body.stuDdateOfBirth : student.stuDdateOfBirth,
                  stuSex: (req.body.stuSex != null) ? req.body.stuSex : student.stuSex,
                  couId: (req.body.couId != null) ? req.body.couId : student.couId,
                  fedId: (req.body.fedId != null) ? req.body.fedId : student.fedId,
                  stuPhoto: (req.body.stuPhoto != null) ? req.body.stuPhoto : student.stuPhoto,
                  stuStatus: (req.body.stuStatus != null) ? req.body.stuStatus : student.stuStatus,

                })
                .then((student) => {
                  message = 'Estudiante actualizado con éxito';
                  res.status(StatusCodes.OK).json({ok: true, data:student, message})
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

//Delete student
const deleteStudent =  async (req, res, next) =>{

    StudentModel.destroy({      
        where: {
          stuId: req.params.stuId
          }        
        }).then((rowsDeleted) => {  
        if(rowsDeleted > 0) {
          return res.status(StatusCodes.OK).json({ok: true, message: `Estudiante eliminado con éxito`})  
        }else{
          return res.status(StatusCodes.OK).json({ok: false, message: `Error al eliminar Estudiante`})  
        }
      }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false,message})
        next(err)
      })    

}

const getAllActiveStudents =  async (req, res, next) =>{

  StudentModel.findAll({
    where: {
      stuStatus: 1
      }
  })
  .then((students) => {
 
    // if(students.length > 0){

    //   const lookup = students.reduce(function(acc, cur) {
    //     acc[cur.rolId] = cur.rolName;
    //     return acc;
    //   }, {})

    //   res.status(StatusCodes.OK).json({ok: true, data: students, lookup})
    // }else{
    //   res.status(StatusCodes.OK).json({ok: true, data: students, lookup:null})
    // }
       res.status(StatusCodes.OK).json({ok: true, data: students, lookup:null})


  }, (err) => {
      message = err
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
      next(err)
    })

}

module.exports = {
    addStudent,
    getAllStudents,
    getOneStudentById,
    updateStudent,
    deleteStudent,
    getAllActiveStudents
}
