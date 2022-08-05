const {  StatusCodes } = require('http-status-codes')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const db = require("../models");

const PeriodsModel = db.periodsModel

//consultar periodo activo
const getOneActivePeriod =  async (req, res,next) =>{

  PeriodsModel.findOne({
    where: {
      perStatus: 1
    }
  })
  .then((period) => {
    return res.status(StatusCodes.OK).json({ok: true, data:period})

  }, (err) => {
    
    return res.status(StatusCodes.OK).json({ok: false, message: 'Error al consultar periodo activo'})

    })
}
//Add period

const addPeriod =  async (req, res,next) =>{

            // res.status(StatusCodes.NOT_ACCEPTABLE).json({ok: true,data: period, message})
    if (!req.body.perStartYear || !req.body.perStatus) return res.status(StatusCodes.NOT_ACCEPTABLE).json({ok: false, message: 'Todos los campos son obligatorios'});
    try {

        let perExists = await PeriodsModel.findOne({
            where: { perStartYear: Number(req.body.perStartYear) }
      
          }).catch((err) => {
            throw err; 
          });

          if (perExists){
            return res.status(StatusCodes.OK).json({ok: false, message: 'Periodo ya se encuentra registrado'})
          }else{
            PeriodsModel.create({
                perStartYear: Number(req.body.perStartYear),
                perEndYear: (Number(req.body.perStartYear) + 1),
                perStatus: req.body.perStatus
            })
            .then((period) => {
                message = 'Periodo creado con éxito';
                res.status(StatusCodes.OK).json({ok: true,data: period, message})
              }, (err) => {
                message = 'Error al crear Periodo'
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

//get All period by Id
const getOnePeriodByStartYear =  async (req, res, next) =>{

  console.log('auqi llego')
  PeriodsModel.findOne({
      where: {
        perStartYear: req.params.perStartYear
      }
    })
    .then((period) => {
      let message
       if(period === null){
        message = 'Periodo no registrado'
       }else{
        message = 'Periodo registrado'
       }
      
      res.status(StatusCodes.OK).json({ok: true, data: period,message})
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
            perStartYear: Number(req.body.perStartYear),
            perId: {
            [Op.ne]: req.params.perId
          }
        }
      })
      .then((period) => {
        if(period){
          return res.status(StatusCodes.OK).json({ok: false, message: 'Periodo ya se encuentra registrado'})
        }else{    
            PeriodsModel.findOne({
            where: {
              perId: req.params.perId          
            }
          }).then((period) => {
            period.update({
                perStartYear: (req.body.perStartYear != null) ? Number(req.body.perStartYear) : period.perStartYear,
                perEndYear: (req.body.perStartYear != null) ? (Number(req.body.perStartYear) + 1) : period.perEndYear,
                perStatus: (req.body.perStatus != null) ? req.body.perStatus : period.perStatus
                })
                .then((period) => {
                  message = 'Periodo actualizado con éxito';
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
          return res.status(StatusCodes.OK).json({ok: true, message: `Periodo eliminado con éxito`})  
        }else{
          return res.status(StatusCodes.OK).json({ok: false, message: `Error al eliminar Periodo`})  
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
    getAllActivePeriods,
    getOneActivePeriod,
    getOnePeriodByStartYear
}
