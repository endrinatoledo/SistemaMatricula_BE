const {  StatusCodes } = require('http-status-codes')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const db = require("../models");

const BanksModel = db.banksModel

//Add Banco

const addBank =  async (req, res,next) =>{

    if (req.body.banName === '' || req.body.banStatus === 0) return res.status(406).json({ok: false, message: 'Todos los campos son obligatorios'});
    try {

        let bankExists = await BanksModel.findOne({
            where: { banName: req.body.banName }
      
          }).catch((err) => {
            throw err; 
          });

          if (bankExists){
            return res.status(StatusCodes.OK).json({ok: false, message: 'Banco ya se encuentra registrado'})
          }else{
            BanksModel.create({
                banName: req.body.banName,
                banStatus: req.body.banStatus
            })
            .then((bank) => {
                message = 'Banco creado con éxito';
                res.status(StatusCodes.OK).json({ok: true,data: bank, message})
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
//get All Bank
const getAllBanks =  async (req, res, next) =>{

    BanksModel.findAll({})
    .then((banks) => {
        res.status(StatusCodes.OK).json({ok: true, data: banks})
    }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
        next(err)
      })

}
//get All Bank by Id
const getOneBankById =  async (req, res, next) =>{
  
    BanksModel.findOne({
        where: {
            banId: req.params.banId
        }
      })
      .then((bank) => {
        res.status(StatusCodes.OK).json({ok: true, data: bank})
      }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
        next(err)
      })

}
//Update Bank
const updateBank =  async (req, res, next) =>{

    BanksModel.findOne({
        where: {
            banName: req.body.banName,
            banId: {
            [Op.ne]: req.params.banId
          }
        }
      })
      .then((bank) => {
        if(bank){
          return res.status(StatusCodes.OK).json({ok: false, message: 'Banco ya se encuentra registrado'})
        }else{    
            BanksModel.findOne({
            where: {
              banId: req.params.banId          
            }
          }).then((bank) => {
            bank.update({
                banName: (req.body.banName != null) ? req.body.banName : bank.banName,
                banStatus: (req.body.banStatus != null) ? req.body.banStatus : bank.banStatus
                })
                .then((bank) => {
                  message = 'Banco actualizado con éxito';
                  res.status(StatusCodes.OK).json({ok: true, data:bank, message})
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
//Delete Banco
const deleteBank =  async (req, res, next) =>{

    BanksModel.destroy({      
        where: {
            banId: req.params.banId
          }        
        }).then((rowsDeleted) => {  
        if(rowsDeleted > 0) {
          return res.status(StatusCodes.OK).json({ok: true, message: `Banco eliminado con éxito`})  
        }else{
          return res.status(StatusCodes.OK).json({ok: false, message: `Error al eliminar Banco`})  
        }
      }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false,message})
        next(err)
      })    

}
//get All Active Banco
const getAllActiveBanks =  async (req, res, next) =>{

  BanksModel.findAll({
    where: {
      banStatus: 1
      }
  })
  .then((banks) => {
 
    if(banks.length > 0){

      const lookup = banks.reduce(function(acc, cur) {
        acc[cur.banId] = cur.banName;
        return acc;
      }, {})

      res.status(StatusCodes.OK).json({ok: true, data: banks, lookup})
    }else{
      res.status(StatusCodes.OK).json({ok: true, data: banks, lookup:null})
    }

  }, (err) => {
      message = err
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
      next(err)
    })

}

module.exports = {
    addBank,
    getAllBanks,
    getOneBankById,
    updateBank,
    deleteBank,
    getAllActiveBanks
}
