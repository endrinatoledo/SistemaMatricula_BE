const {  StatusCodes } = require('http-status-codes')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const db = require("../models");

const FamilyModel = db.familyModel

//Add Family

const addFamily =  async (req, res,next) =>{

    if (!req.body.famName || !req.body.famStatus) return res.status(406).json({ok: false, message: 'Todos os campos son obligatorios'});
    try {

        let famExists = await FamilyModel.findOne({
            where: { famName: req.body.famName }
      
          }).catch((err) => {
            throw err; 
          });

          if (famExists){
            return res.status(StatusCodes.OK).json({ok: false, message: 'Familia ya se encuentra registrada'})
          }else{
            FamilyModel.create({
                famName: req.body.famName,
                famStatus: req.body.famStatus
            })
            .then((family) => {
                message = 'Famila creada con éxito';
                res.status(StatusCodes.OK).json({ok: true,data: family, message})
              }, (err) => {
                message = err
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message})
                next(err)
              })


          }
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
            famName: req.body.famName,
            famId: {
            [Op.ne]: req.params.famId
          }
        }
      })
      .then((family) => {
        if(family){
          return res.status(StatusCodes.OK).json({ok: false, message: 'Famila ya se encuentra registrada'})
        }else{    
            FamilyModel.findOne({
            where: {
              famId: req.params.famId          
            }
          }).then((family) => {
            family.update({
                famName: (req.body.famName != null) ? req.body.famName : rol.famName,
                famStatus: (req.body.famStatus != null) ? req.body.famStatus : rol.famStatus
                })
                .then((family) => {
                  message = 'Familia editada con éxito';
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
      }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
        next(err)
      })

}

//Delete Family
const deleteFamily =  async (req, res, next) =>{

    FamilyModel.destroy({      
        where: {
            famId: req.params.famId
          }        
        }).then((rowsDeleted) => {  
        if(rowsDeleted > 0) {
          return res.status(StatusCodes.OK).json({ok: true, message: `Familia eliminada con éxito`})  
        }else{
          return res.status(StatusCodes.OK).json({ok: false, message: `Error al eliminar Rol`})  
        }
      }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false,message})
        next(err)
      })    

}
module.exports = {
    addFamily,
    getAllFamilies,
    getOneFamilyById,
    updateFamily,
    deleteFamily
}
