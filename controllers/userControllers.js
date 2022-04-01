// const { default: ModelManager } = require("sequelize/types/model-manager");
const {  StatusCodes } = require('http-status-codes')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const db = require("../models");
const encbcrypt = require('../utils/bcrypt');

const UserModel = db.usersModel

//Add User

const addUser =  async (req, res) =>{

    if (!req.body.usuName || !req.body.usuName || !req.body.usuEmail || !req.body.usuPassword || !req.body.usuStatus) return res.status(406).json({ok: false, message: 'Todos os campos son obligatorios'});
    try {

        let mailExists = await UserModel.findOne({
            where: { usuEmail: req.body.usuEmail }
      
          }).catch((err) => {
            throw err; 
          });

          if (mailExists){
            return res.status(StatusCodes.OK).json({ok: false, message: 'Email ya se encuentra registrado'})
          }else{
            UserModel.create({
                usuName: req.body.usuName,
                usuLastName: req.body.usuLastName,
                usuEmail: req.body.usuEmail,
                usuPassword: encbcrypt.encryptPWD(req.body.usuPassword),
                usuStatus: req.body.usuStatus,
            })
            .then((user) => {
                message = 'Usuario creado con éxito';
                res.status(StatusCodes.OK).json({ok: true,data: user, message})
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
//get All User
const getAllUsers =  async (req, res) =>{

    UserModel.findAll({})
    .then((users) => {
        res.status(StatusCodes.OK).json({ok: true, data: users})
    }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
        next(err)
      })

}
//get All User by Id
const getOneUserById =  async (req, res) =>{

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
const updateUser =  async (req, res) =>{

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
                  usuPassword: (req.body.usuPassword != null) ? req.body.usuPassword : user.usuPassword,
                  usuStatus: (req.body.usuStatus != null) ? req.body.usuStatus : user.usuStatus,
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
    // const user = await UserModel.findOne(req.body,{
    //     where : {usuId : req.params.usuId }
    // })
    // res.send(200).send(user)

}

//Delete User
const deleteUser =  async (req, res) =>{

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

    // const user = await UserModel.destroy(req.body,{
    //     where : {usuId : req.params.usuId }
    // })
    // res.send(200).send(`Usuario Eliminado exitosamente`)
}
module.exports = {
    addUser,
    getAllUsers,
    getOneUserById,
    updateUser,
    deleteUser
}
