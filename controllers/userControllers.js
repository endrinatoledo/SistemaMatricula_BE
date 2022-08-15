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

  console.log('esto llegoooooooooooooooooooo',req.body)

    if (!req.body.usuName || !req.body.usuLastName || 
      !req.body.usuEmail ||  !req.body.usuStatus|| 
      !req.body.rolId) return res.status(406).json({ok: false, message: 'Todos los campos son obligatorios'});
    try {

        let mailExists = await UserModel.findOne({
            where: { usuEmail: req.body.usuEmail }
      
          }).catch((err) => {
            throw err; 
          });

          if (mailExists){
            console.log('paso por aqui')
            return res.status(StatusCodes.OK).json({ok: false, message: 'Email ya se encuentra registrado'})
          }else{
            console.log('paso por alla')
            UserModel.create({
                usuName: req.body.usuName,
                usuLastName: req.body.usuLastName,
                usuEmail: req.body.usuEmail,
                usuPassword: encbcrypt.encryptPWD(req.body.usuPassword),
                // usuPassword: encbcrypt.encryptPWD('1234'),
                usuStatus: 1,
                rolId: Number(req.body.rolId),
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
      console.log('······#########################',err)

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
          usuEmail: req.body.usuEmail,
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
                  usuName: (req.body.usuName != null) ? req.body.usuName : user.usuName,
                  usuLastName: (req.body.usuLastName != null) ? req.body.usuLastName : user.usuLastName,
                  usuEmail: (req.body.usuEmail != null) ? req.body.usuEmail : user.usuEmail,
                  usuPassword: (req.body.usuPassword != null) ? encbcrypt.encryptPWD(req.body.usuPassword) : user.usuPassword,
                  usuStatus: (req.body.usuStatus != null) ? req.body.usuStatus : user.usuStatus,
                  rolId: (req.body.rolId != null) ? req.body.rolId : user.rolId
                })
                .then((user) => {
                  message = 'Usuario actualizado con éxito';
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
