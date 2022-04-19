// const { default: ModelManager } = require("sequelize/types/model-manager");
const {  StatusCodes } = require('http-status-codes')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const db = require("../models");
const encbcrypt = require('../utils/bcrypt');

const UserModel = db.usersModel
const RolesModel = db.rolesModel
//Add User

const addUser =  async (req, res, next) =>{

    if (!req.body.name || !req.body.lastName || !req.body.email || !req.body.password || !req.body.status|| !req.body.rol) return res.status(406).json({ok: false, message: 'Todos os campos son obligatorios'});
    try {

        let mailExists = await UserModel.findOne({
            where: { usuEmail: req.body.email }
      
          }).catch((err) => {
            throw err; 
          });

          if (mailExists){
            return res.status(StatusCodes.OK).json({ok: false, message: 'Email ya se encuentra registrado'})
          }else{
            UserModel.create({
                usuName: req.body.name,
                usuLastName: req.body.lastName,
                usuEmail: req.body.email,
                usuPassword: encbcrypt.encryptPWD(req.body.password),
                usuStatus: req.body.status,
                rolId: req.body.rol,
            })
            .then((user) => {
                message = 'Usuario creado con éxito';
                res.status(StatusCodes.OK).json({ok: true,data: user, message})
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
//get All User
const getAllUsers =  async (req, res, next) =>{

    UserModel.findAll({
      include: {
        model: RolesModel,
        as: 'roles',
        require: true
      }
    })
    .then((users) => {
        res.status(StatusCodes.OK).json({ok: true, data: users})
    }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
        next(err)
      })

}
//get All User by Id
const getOneUserById =  async (req, res, next) =>{

    UserModel.findOne({
        where: {
          usuId: req.params.usuId
        }
      })
      .then((user) => {
        res.status(StatusCodes.OK).json({ok: true, data: user})
      }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
        next(err)
      })

}
//Update User
const updateUser =  async (req, res, next) =>{

    UserModel.findOne({
        where: {
          usuEmail: req.body.email,
          usuId: {
            [Op.ne]: req.params.usuId
          }
        }
      })
      .then((user) => {
        if(user){
          return res.status(StatusCodes.OK).json({ok: false, message: 'Email ya se encuentra registrado'})
        }else{    
            UserModel.findOne({
            where: {
              usuId: req.params.usuId          
            }
          }).then((user) => {
                user.update({
                  usuName: (req.body.name != null) ? req.body.name : user.usuName,
                  usuLastName: (req.body.lastName != null) ? req.body.lastName : user.usuLastName,
                  usuEmail: (req.body.email != null) ? req.body.email : user.usuEmail,
                  usuPassword: (req.body.password != null) ? req.body.password : user.usuPassword,
                  usuStatus: (req.body.status != null) ? req.body.status : user.usuStatus,
                  rolId: (req.body.rol != null) ? req.body.rol : user.rolId
                })
                .then((user) => {
                  message = 'Usuario editado con éxito';
                  res.status(StatusCodes.OK).json({ok: true, data:user, message})
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

//Delete User
const deleteUser =  async (req, res, next) =>{

    UserModel.destroy({      
        where: {
          usuId: req.params.usuId
          }        
        }).then((rowsDeleted) => {  
        if(rowsDeleted > 0) {
          return res.status(StatusCodes.OK).json({ok: true, message: `Usuario eliminado con éxito`})  
        }else{
          return res.status(StatusCodes.OK).json({ok: false, message: `Error al eliminar usuario`})  
        }
      }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false,message})
        next(err)
      })    

}
module.exports = {
    addUser,
    getAllUsers,
    getOneUserById,
    updateUser,
    deleteUser
}
