const {  StatusCodes } = require('http-status-codes')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const db = require("../models");

const LevelsModel = db.levelsModel

//Add level

const addLevel =  async (req, res,next) =>{

    if (req.body.levName === '' || req.body.levStatus === 0) return res.status(406).json({ok: false, message: 'Todos los campos son obligatorios'});
    try {

        let levelExists = await LevelsModel.findOne({
            where: { levName: req.body.levName }
      
          }).catch((err) => {
            throw err; 
          });

          if (levelExists){
            return res.status(StatusCodes.OK).json({ok: false, message: 'Nivel ya se encuentra registrado'})
          }else{
            LevelsModel.create({
                levName: req.body.levName,
                levStatus: req.body.levStatus
            })
            .then((level) => {
                message = 'Nivel creado con éxito';
                res.status(StatusCodes.OK).json({ok: true,data: level, message})
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
//get All Level
const getAllLevels =  async (req, res, next) =>{

    LevelsModel.findAll({})
    .then((levels) => {
        res.status(StatusCodes.OK).json({ok: true, data: levels})
    }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
        next(err)
      })

}
//get All level by Id
const getOneLevelById =  async (req, res, next) =>{
  
    LevelsModel.findOne({
        where: {
            levId: req.params.levId
        }
      })
      .then((level) => {
        res.status(StatusCodes.OK).json({ok: true, data: level})
      }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
        next(err)
      })

}
//Update level
const updateLevel =  async (req, res, next) =>{

    LevelsModel.findOne({
        where: {
            levName: req.body.levName,
            levId: {
            [Op.ne]: req.params.levId
          }
        }
      })
      .then((level) => {
        if(level){
          return res.status(StatusCodes.OK).json({ok: false, message: 'Nivel ya se encuentra registrado'})
        }else{    
            LevelsModel.findOne({
            where: {
              levId: req.params.levId          
            }
          }).then((level) => {
            level.update({
                levName: (req.body.levName != null) ? req.body.levName : level.levName,
                levStatus: (req.body.levStatus != null) ? req.body.levStatus : level.levStatus
                })
                .then((level) => {
                  message = 'Nivel actualizado con éxito';
                  res.status(StatusCodes.OK).json({ok: true, data:level, message})
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
//Delete level
const deleteLevel =  async (req, res, next) =>{

    LevelsModel.destroy({      
        where: {
            levId: req.params.levId
          }        
        }).then((rowsDeleted) => {  
        if(rowsDeleted > 0) {
          return res.status(StatusCodes.OK).json({ok: true, message: `Nivel eliminado con éxito`})  
        }else{
          return res.status(StatusCodes.OK).json({ok: false, message: `Error al eliminar Nivel`})  
        }
      }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false,message})
        next(err)
      })    

}
//get All Active level
const getAllActiveLevels =  async (req, res, next) =>{

  LevelsModel.findAll({
    where: {
      levStatus: 1
      }
  })
  .then((levels) => {
      res.status(StatusCodes.OK).json({ok: true, data: levels})
  }, (err) => {
      message = err
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
      next(err)
    })

}

module.exports = {
    addLevel,
    getAllLevels,
    getOneLevelById,
    updateLevel,
    deleteLevel,
    getAllActiveLevels
}
