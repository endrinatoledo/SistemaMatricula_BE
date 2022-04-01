const {  StatusCodes } = require('http-status-codes')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const db = require("../models");

const UserModel = db.usersModel

const logIn = async (req, res, next) =>{
   

        console.log('llego:   ',req.body)
    if (!req.body.email || !req.body.password) return res.status(406).json({ok: false, message: 'Los campos son obligatorios'});

    try {

        let user = await UserModel.findOne({
            where: { usuEmail: req.body.email }
      
          }).catch((err) => {
            throw err;
          });

          if ( user == null || user == undefined || user == ''){
              console.log('***',user)
            return res.status(StatusCodes.OK).json({ok: false, message: 'Usuario no registrado'})
          }else{
            
            if(user.usuStatus==0){
                return res.status(StatusCodes.OK).json({ok: false, message: 'Usuario Inactivo'})
              }else{
                console.log('***-----***',user)
                // if(comprarePassword(user.usuPassword, req.body.password) === true){
                //     // if(user.usuPassword== req.body.password){
                //     let user_ = {
                //       usuId:user.usuId,
                //       usuName:user.usuName,
                //       usuLastName:user.usuLastName,
                //       usuEmail:user.usuEmail,
                //       usuStatus:user.usuStatus,
                //       usuPassword:user.usuPassword,
                //       token: jwt.sign({ sub: user.usuId }, config.secret)
        
                //     }
                //     res.status(StatusCodes.OK).json({ok: true, user_})
                //   }else{
                //     return res.status(StatusCodes.OK).json({ok: false, message: 'Contraseña Incorrecta'})
                //   }
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