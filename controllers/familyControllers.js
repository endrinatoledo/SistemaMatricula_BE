const {  StatusCodes } = require('http-status-codes')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const db = require("../models");

const FamilyModel = db.familyModel
const RepresentativeStudentModel = db.representativeStudentModel

//Add Family

const addFamily =  async (req, res,next) =>{

    if (!req.body.famName || !req.body.famStatus) return res.status(406).json({ok: false, message: 'Todos los campos son obligatorios'});
    try {

      FamilyModel.max('fam_id',{}).then((total) => {

        FamilyModel.create({
          famName: req.body.famName,
          famCode:  `00${total+1}`,
          famStatus: parseInt(req.body.famStatus)
      })
      .then((family) => {
          message = 'Familia creada con éxito';
          res.status(StatusCodes.OK).json({ok: true,data: family, message})
        }, (err) => {
          message = err
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message})
          next(err)
        })
      }, (err) => {

        return {result : false}
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

//get All Family
const getAllFamilies =  async (req, res, next) =>{

    FamilyModel.findAll({})
    .then((families) => {
        res.status(StatusCodes.OK).json({ok: true, data: families})
    }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
        next(err)
      })

}
//get All Family by Id
const getOneFamilyById =  async (req, res, next) =>{

    FamilyModel.findOne({
        where: {
            famId: req.params.famId
        }
      })
      .then((family) => {
        res.status(StatusCodes.OK).json({ok: true, data: family})
      }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
        next(err)
      })

}
//Update Family
const updateFamily =  async (req, res, next) =>{
  
            FamilyModel.findOne({
            where: {
              famId: req.params.famId          
            }
          }).then((family) => {
            family.update({
                famName: (req.body.famName != null) ? req.body.famName : family.famName,
                famCode : family.famCode,
                famStatus: (req.body.famStatus != null) ? parseInt(req.body.famStatus) : family.famStatus
                })
                .then((family) => {
                  message = 'Familia actualizada con éxito';
                  res.status(StatusCodes.OK).json({ok: true, data:family, message})
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

//Delete Family
const deleteFamily =  async (req, res, next) =>{

  try {
    RepresentativeStudentModel.destroy({
      where: {
        famId: req.params.famId
      } 
    }).then((rowsDeleted) => {  
        FamilyModel.destroy({      
          where: {
              famId: req.params.famId
            }        
          }).then((eliminada) => {  
          if(eliminada > 0) {
            return res.status(StatusCodes.OK).json({ok: true, message: `Familia eliminada con éxito`})  
          }else{
            return res.status(StatusCodes.OK).json({ok: false, message: `Error al eliminar Familia`})  
          }
        }, (err) => {
          message = err
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false,message})
          next(err)
        }) 
    }, (err) => {
      message = err
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false,message})
      next(err)
    })  
  } catch (error) {
    message = err;
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message });
    next(err);
  }

  



       

}

const getAllActiveFamilies =  async (req, res, next) =>{

  FamilyModel.findAll({
    where: { famStatus: 1 }
  })
  .then((families) => {
      res.status(StatusCodes.OK).json({ok: true, data: families})
  }, (err) => {
      message = err
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
      next(err)
    })

}
module.exports = {
    addFamily,
    getAllFamilies,
    getOneFamilyById,
    updateFamily,
    deleteFamily,
    getAllActiveFamilies
}
