// const { default: ModelManager } = require("sequelize/types/model-manager");

const {  StatusCodes } = require('http-status-codes')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const db = require("../models");

const StudentModel = db.studentModel
const RepresentativeModel = db.representativeModel
const RepresentativeStudentModel = db.representativeStudentModel
const FamilyModel = db.familyModel

//Add RepresentativeStudent
const addRepresentativeStudent =  async (req, res, next) =>{


    if (!req.body.representatives || !req.body.students|| !req.body.family) return res.status(406).json({ok: false, message: 'Todos los campos son obligatorios'});
    try {

      const representatives = req.body.representatives
      const students = req.body.students

      FamilyModel.max('fam_id',{}).then((total) => {

        FamilyModel.create({
          famName: req.body.family,
          famCode:  `00${total+1}`,
          famStatus: 1
      })
      .then((family) => {
        representatives.forEach(elementR => {
        
          students.forEach(elementE => {
            RepresentativeStudentModel.create({
              repId: elementR.repId,
              stuId: elementE.stuId,
              famId: family.famId
            })
            .then((representativeStudent) => {
                message = 'Familia creada con éxito';
                res.status(StatusCodes.OK).json({ok: true,data: representativeStudent, message})
              }, (err) => {
                message = 'Error de conexión'
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false,data: [], message})
                next(err)
              })
          });
        });
        }, (err) => {
          message = err
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message})
          next(err)
        })
      }, (err) => {
        message='error al crear familia2'
        return {result : false, data:[],message}
      })
      .catch((err) => {
          throw err; 
     });
      
    } catch (err) {
        message = err;
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message });
        next(err);
      }

}
//get All RepresentativeStudent
const getAllRepresentativeStudent =  async (req, res, next) =>{

    RepresentativeStudentModel.findAll({
      include: [{
        model: StudentModel,
        as: 'student',
        require: true
      }
      ,{
        model: RepresentativeModel,
        as: 'representative',
        require: true
      },
      {
        model: FamilyModel,
        as: 'families',
        require: true
      }    
    ]
    })
    .then((representativesStudents) => {
        res.status(StatusCodes.OK).json({ok: true, data: representativesStudents})
    }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
        next(err)
      })

}
//get All RepresentativeStudent groupBy representative
const getAllRepresentativeStudentGroupByFamily =  async (req, res, next) =>{

  RepresentativeStudentModel.findAll({
    include: [{
      model: StudentModel,
      as: 'student',
      require: true
    }
    ,{
      model: RepresentativeModel,
      as: 'representative',
      require: true
    },
    {
      model: FamilyModel,
      as: 'families',
      require: true
    }    
    ],
    group:["famId"]
  })
  .then((representativesStudents) => {
      res.status(StatusCodes.OK).json({ok: true, data: representativesStudents})
  }, (err) => {
      message = err
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
      next(err)
    })

}
//get All RepresentativeStudent by Id
const getOneRepresentativeStudentById =  async (req, res, next) =>{

    RepresentativeStudentModel.findOne({
      include: [{
        model: StudentModel,
        as: 'student',
        require: true
      }
      ,{
        model: RepresentativeModel,
        as: 'representative',
        require: true
      },
      {
        model: FamilyModel,
        as: 'families',
        require: true
      }
    ],
        where: {
          rstId: req.params.rstId
        }
      })
      .then((representativeStudent) => {
        res.status(StatusCodes.OK).json({ok: true, data: representativeStudent})
      }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
        next(err)
      })

}

const getOneRepresentativeStudentByFamId =  async (req, res, next) =>{

  RepresentativeStudentModel.findAll({
    include: [{
      model: StudentModel,
      as: 'student',
      require: true
    }
    ,{
      model: RepresentativeModel,
      as: 'representative',
      require: true
    },
    {
      model: FamilyModel,
      as: 'families',
      require: true
    }
  ],
      where: {
        famId: req.params.famId
      }
    })
    .then((representativeStudent) => {

      let family = {}
      let students = []
      let representatives = []

      if(representativeStudent.length > 0){
        family = representativeStudent[0].families

        representativeStudent.forEach(element => {
          if(students.length > 0){ //verifica si el array tiene elementos
            let resultEstudent = ''
            resultEstudent = students.find( item => item.stuId === element.student.stuId)
            if (resultEstudent === undefined){ students.push(element.student) }
          }else{
            students.push(element.student)
          }

          if(representatives.length > 0){

            let resultRepresentative
            resultRepresentative = representatives.find( item => {
              item.repId === element.representative.repId
            } )
            if (resultRepresentative === undefined){
              representatives.push(element.representative)
            }
          }else{
            representatives.push(element.representative)
          }
         
        });
      }
      const data = {
        family,
        representatives,
        students        
      }

      res.status(StatusCodes.OK).json({ok: true, data})
    }, (err) => {
      message = err
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
      next(err)
    })

}

//Update RepresentativeStudent
const updateRepresentativeStudent =  async (req, res, next) =>{

    RepresentativeStudentModel.findOne({
        where: {
          repId: req.body.repId,
          stuId: req.body.stuId,
          famId: req.body.famId,
          rstId: {
            [Op.ne]: req.params.rstId
          }
        },
        include: [{
          model: StudentModel,
          as: 'student',
          require: true
        }
        ,{
          model: RepresentativeModel,
          as: 'representative',
          require: true
        },
        {
          model: FamilyModel,
          as: 'families',
          require: true
        }
      ]
      })
      .then((representativeStudent) => {

        if(representativeStudent){
          return res.status(StatusCodes.OK).json({ok: false, message: 'Vínculo ya se encuentra registrado'})
        }else{    
            RepresentativeStudentModel.findOne({
            where: {
              rstId: req.params.rstId          
            }
          }).then((representativeStudent) => {
                representativeStudent.update({
                  repId: (req.body.repId != null) ? req.body.repId : representativeStudent.repId,
                  stuId: (req.body.stuId != null) ? req.body.stuId : representativeStudent.stuId,
                  famId: (req.body.famId != null) ? req.body.famId : representativeStudent.famId,

                })
                .then((representativeStudent) => {
                  message = 'Vínculo actualizado con éxito';
                  res.status(StatusCodes.OK).json({ok: true, data:representativeStudent, message})
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

//Delete RepresentativeStudent
const deleteRepresentativeStudent =  async (req, res, next) =>{

    RepresentativeStudentModel.destroy({      
        where: {
          rstId: req.params.rstId
          }        
        }).then((rowsDeleted) => {  
        if(rowsDeleted > 0) {
          return res.status(StatusCodes.OK).json({ok: true, message: `Vínculo eliminado con éxito`})  
        }else{
          return res.status(StatusCodes.OK).json({ok: false, message: `Error al eliminar Vínculo`})  
        }
      }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false,message})
        next(err)
      })    

}


module.exports = {
    addRepresentativeStudent,
    getAllRepresentativeStudent,
    getOneRepresentativeStudentById,
    updateRepresentativeStudent,
    deleteRepresentativeStudent,
    getAllRepresentativeStudentGroupByFamily,
    getOneRepresentativeStudentByFamId
}
