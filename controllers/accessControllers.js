const {  StatusCodes } = require('http-status-codes')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const db = require("../models");
const {comprarePassword} = require('../utils/bcrypt');

const UserModel = db.usersModel

const logIn = async (req, res, next) =>{
   
    if (!req.body.email || !req.body.password) return res.status(406).json({ok: false, message: 'Los campos son obligatorios'});

    try {

        let user = await UserModel.findOne({
            where: { usuEmail: req.body.email }
      
          }).catch((err) => {
            throw err;
          });

          if ( user == null || user == undefined || user == ''){
            return res.status(StatusCodes.OK).json({ok: false, message: 'Usuario no registrado'})
          }else{
            
            if(user.usuStatus==0){
                return res.status(StatusCodes.OK).json({ok: false, message: 'Usuario Inactivo'})
              }else{
                if(comprarePassword(user.usuPassword, req.body.password) === true){
                  
                          let validatedUser = {
                            usuId:user.usuId,
                            usuName:user.usuName,
                            usuLastName:user.usuLastName,
                            usuEmail:user.usuEmail,
                            usuStatus:user.usuStatus,
                            usuPassword:user.usuPassword,
                            // token: jwt.sign({ sub: user.usuId }, config.secret)
                          }
                          res.status(StatusCodes.OK).json({ok: true, validatedUser})
                    }else{
                      return res.status(StatusCodes.OK).json({ok: false, message: 'Contraseña Incorrecta'})
                    }
              }
          }

    } catch (err) {
        message = err;
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message });
        next(err);
      }
}

module.exports = {
    logIn
}