const {  StatusCodes } = require('http-status-codes')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const db = require("../models");

const PeriodsModel = db.periodsModel

//Add period

const addPeriod =  async (req, res,next) =>{

    if (!req.body.startYear || !req.body.status) return res.status(406).json({ok: false, message: 'Todos los campos son obligatorios'});
    try {
        // getFullYear()   // año actual

        let perExists = await PeriodsModel.findOne({
            where: { perStartYear: Number(req.body.startYear) }
      
          }).catch((err) => {
            throw err; 
          });

          if (perExists){
            return res.status(StatusCodes.OK).json({ok: false, message: 'Período ya se encuentra registrado'})
          }else{
            PeriodsModel.create({
                perStartYear: Number(req.body.startYear),
                perEndYear: (Number(req.body.startYear) + 1),
                perStatus: req.body.status
            })
            .then((period) => {
                message = 'Período creado con éxito';
                res.status(StatusCodes.OK).json({ok: true,data: period, message})
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
//get All period
const getAllPeriods =  async (req, res, next) =>{

    PeriodsModel.findAll({})
    .then((periods) => {
        res.status(StatusCodes.OK).json({ok: true, data: periods})
    }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
        next(err)
      })

}
//get All period by Id
const getOnePeriodById =  async (req, res, next) =>{

    PeriodsModel.findOne({
        where: {
            perId: req.params.perId
        }
      })
      .then((period) => {
        res.status(StatusCodes.OK).json({ok: true, data: period})
      }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
        next(err)
      })

}
//Update period
const updatePeriod =  async (req, res, next) =>{

    PeriodsModel.findOne({
        where: {
            perStartYear: Number(req.body.startYear),
            perId: {
            [Op.ne]: req.params.perId
          }
        }
      })
      .then((period) => {
        if(period){
          return res.status(StatusCodes.OK).json({ok: false, message: 'Período ya se encuentra registrado'})
        }else{    
            PeriodsModel.findOne({
            where: {
              perId: req.params.perId          
            }
          }).then((period) => {
            period.update({
                perStartYear: (req.body.startYear != null) ? Number(req.body.startYear) : period.perStartYear,
                perEndYear: (req.body.startYear != null) ? (Number(req.body.startYear) + 1) : period.perEndYear,
                perStatus: (req.body.status != null) ? req.body.status : period.perStatus
                })
                .then((period) => {
                  message = 'Período editado con éxito';
                  res.status(StatusCodes.OK).json({ok: true, data:period, message})
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

//Delete period
const deletePeriod =  async (req, res, next) =>{

    PeriodsModel.destroy({      
        where: {
            perId: req.params.perId
          }        
        }).then((rowsDeleted) => {  
        if(rowsDeleted > 0) {
          return res.status(StatusCodes.OK).json({ok: true, message: `Período eliminado con éxito`})  
        }else{
          return res.status(StatusCodes.OK).json({ok: false, message: `Error al eliminar Período`})  
        }
      }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false,message})
        next(err)
      })    

}

const getAllActivePeriods =  async (req, res, next) =>{

  PeriodsModel.findAll({
    where: {
      perStatus: 1
      }
  })
  .then((periods) => {
      res.status(StatusCodes.OK).json({ok: true, data: periods})
  }, (err) => {
      message = err
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
      next(err)
    })

}
module.exports = {
    addPeriod,
    getAllPeriods,
    getOnePeriodById,
    updatePeriod,
    deletePeriod,
    getAllActivePeriods
}