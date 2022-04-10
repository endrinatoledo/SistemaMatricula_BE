const {  StatusCodes } = require('http-status-codes')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const db = require("../models");
const encbcrypt = require('../utils/bcrypt');

const RolesModel = db.rolesModel

//Add Rol

const addRol =  async (req, res,next) =>{

    if (!req.body.rolName || !req.body.rolStatus) return res.status(406).json({ok: false, message: 'Todos os campos son obligatorios'});
    try {

        let rolExists = await RolesModel.findOne({
            where: { rolName: req.body.rolName }
      
          }).catch((err) => {
            throw err; 
          });

          if (rolExists){
            return res.status(StatusCodes.OK).json({ok: false, message: 'Rol ya se encuentra registrado'})
          }else{
            RolesModel.create({
                rolName: req.body.rolName,
                rolStatus: req.body.rolStatus
            })
            .then((rol) => {
                message = 'Rol creado con éxito';
                res.status(StatusCodes.OK).json({ok: true,data: rol, message})
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
//get All Rol
const getAllRoles =  async (req, res, next) =>{

    RolesModel.findAll({})
    .then((roles) => {
        res.status(StatusCodes.OK).json({ok: true, data: roles})
    }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
        next(err)
      })

}
//get All Rol by Id
const getOneRolById =  async (req, res, next) =>{
  
    RolesModel.findOne({
        where: {
            rolId: req.params.rolId
        }
      })
      .then((rol) => {
        res.status(StatusCodes.OK).json({ok: true, data: rol})
      }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
        next(err)
      })

}
//Update Rol
const updateRol =  async (req, res, next) =>{

    RolesModel.findOne({
        where: {
            rolName: req.body.rolName,
            rolId: {
            [Op.ne]: req.params.rolId
          }
        }
      })
      .then((rol) => {
        if(rol){
          return res.status(StatusCodes.OK).json({ok: false, message: 'Rol ya se encuentra registrado'})
        }else{    
            RolesModel.findOne({
            where: {
              rolId: req.params.rolId          
            }
          }).then((rol) => {
            rol.update({
                rolName: (req.body.rolName != null) ? req.body.rolName : rol.rolName,
                rolStatus: (req.body.rolStatus != null) ? req.body.rolStatus : rol.rolStatus
                })
                .then((rol) => {
                  message = 'Rol editado con éxito';
                  res.status(StatusCodes.OK).json({ok: true, data:rol, message})
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
//Delete Rol
const deleteRol =  async (req, res, next) =>{

    RolesModel.destroy({      
        where: {
            rolId: req.params.rolId
          }        
        }).then((rowsDeleted) => {  
        if(rowsDeleted > 0) {
          return res.status(StatusCodes.OK).json({ok: true, message: `Rol eliminado con éxito`})  
        }else{
          return res.status(StatusCodes.OK).json({ok: false, message: `Error al eliminar Rol`})  
        }
      }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false,message})
        next(err)
      })    

}
//get All Active Rol
const getAllActiveRoles =  async (req, res, next) =>{

  RolesModel.findAll({
    where: {
      rolStatus: 1
      }
  })
  .then((roles) => {
      res.status(StatusCodes.OK).json({ok: true, data: roles})
  }, (err) => {
      message = err
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
      next(err)
    })

}

module.exports = {
    addRol,
    getAllRoles,
    getOneRolById,
    updateRol,
    deleteRol,
    getAllActiveRoles
}
