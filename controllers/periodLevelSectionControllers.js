// const { default: ModelManager } = require("sequelize/types/model-manager");
const {  StatusCodes } = require('http-status-codes')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const db = require("../models");

const PeriodLevelSectionModel = db.periodLevelSectionModel
const PeriodsModel = db.periodsModel
const LevelsModel = db.levelsModel
const SectionsModel = db.sectionsModel

//Add PeriodLevelSection

const addPeriodLevelSection =  async (req, res, next) =>{

    if (!req.body.perId || !req.body.levId) return res.status(406).json({ok: false, message: 'Todos los campos son obligatorios'});
    try {

        let idExists = await PeriodLevelSectionModel.findOne({
            where: { 
              perId: req.body.perId,
              levId: req.body.levId,
              secId: req.body.secId,
             }
          }).catch((err) => {
            throw err; 
          });

          if (idExists){
            return res.status(StatusCodes.OK).json({ok: false, message: 'Registro ya existe'})
          }else{

            PeriodLevelSectionModel.create({
              perId: req.body.perId,
              levId: req.body.levId,
              secId: req.body.secId
            })
            .then((periodLevelSection) => {

                message = 'Registro creado con éxito';
                res.status(StatusCodes.OK).json({ok: true,data: periodLevelSection, message})
              }, (err) => {
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
//get All PeriodLevelSection
const getAllPeriodLevelSection =  async (req, res, next) =>{

    PeriodLevelSectionModel.findAll({
      include: [{
        model: PeriodsModel,
        as: 'period',
        require: true
      }
      ,{
        model: LevelsModel,
        as: 'level',
        require: true
      },{
        model: SectionsModel,
        as: 'section',
        require: true
      }
    ]
    })
    .then((periodsLevelsSections) => {
        res.status(StatusCodes.OK).json({ok: true, data: periodsLevelsSections})
    }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
        next(err)
      })

}
//get All PeriodLevelSection by Id
const getOnePeriodLevelSectionById =  async (req, res, next) =>{

    PeriodLevelSectionModel.findOne({
      include: [{
        model: PeriodsModel,
        as: 'period',
        require: true
      }
      ,{
        model: LevelsModel,
        as: 'level',
        require: true
      },{
        model: SectionsModel,
        as: 'section',
        require: true
      }
    ],
        where: {
          plsId: req.params.plsId
        }
      })
      .then((periodLevelSection) => {
        res.status(StatusCodes.OK).json({ok: true, data: periodLevelSection})
      }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
        next(err)
      })

}
//Update PeriodLevelSection
const updatePeriodLevelSection =  async (req, res, next) =>{

    PeriodLevelSectionModel.findOne({
        where: {
          perId: req.body.perId,
          levId: req.body.levId,
          secId: req.body.secId,
          plsId: {
            [Op.ne]: req.params.plsId
          }
        },
        include: [{
          model: PeriodsModel,
          as: 'period',
          require: true
        }
        ,{
          model: LevelsModel,
          as: 'level',
          require: true
        },{
          model: SectionsModel,
          as: 'section',
          require: true
        }
      ]
      })
      .then((periodLevelSection) => {

        if(periodLevelSection){
          return res.status(StatusCodes.OK).json({ok: false, message: 'Registro ya existe'})
        }else{    
            PeriodLevelSectionModel.findOne({
            where: {
              plsId: req.params.plsId          
            }
          }).then((periodLevelSection) => {
                periodLevelSection.update({
                  perId: (req.body.perId != null) ? req.body.perId : periodLevelSection.perId,
                  levId: (req.body.levId != null) ? req.body.levId : periodLevelSection.levId,
                  secId: (req.body.secId != null) ? req.body.secId : periodLevelSection.secId,
                })
                .then((periodLevelSection) => {
                  message = 'Registro actualizado con éxito';
                  res.status(StatusCodes.OK).json({ok: true, data:periodLevelSection, message})
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

//Delete PeriodLevelSection
const deletePeriodLevelSection =  async (req, res, next) =>{

    PeriodLevelSectionModel.destroy({      
        where: {
          plsId: req.params.plsId
          }        
        }).then((rowsDeleted) => {  
        if(rowsDeleted > 0) {
          return res.status(StatusCodes.OK).json({ok: true, message: `Registro eliminado con éxito`})  
        }else{
          return res.status(StatusCodes.OK).json({ok: false, message: `Error al eliminar Registro`})  
        }
      }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false,message})
        next(err)
      })    

}

//get All PeriodLevelSection by Id
const getOnePeriodLevelSectionByPerId =  async (req, res, next) =>{

  PeriodLevelSectionModel.findAll({
    include: [
      {
        model: PeriodsModel,
        as: 'period',
        require: true
      }
      ,{
        model: LevelsModel,
        as: 'level',
        require: true
      },{
        model: SectionsModel,
        as: 'section',
        require: true
      }
  ],
      where: {
        perId: req.params.perId
      }
      // ,group: 'levId'
    })
    .then((periodLevelSection) => {
      let levels = []
      if(periodLevelSection.length > 0){
        periodLevelSection.forEach(element => {

          if(levels.length > 0){
            let resultLevels = ''
            resultLevels = levels.find( item => item.level.levName === element.level.levName)
            if (resultLevels === undefined){

              let secctions = []
              periodLevelSection.forEach(sections => {
                if(sections.level.levId === element.level.levId){
                  secctions.push({section : sections.section, pls:sections.plsId })
                }
              })
              levels.push({level: element.level, sections: secctions})
            }
          }else{
            let secctions = []
              periodLevelSection.forEach(sections => {
                if(sections.level.levId === element.level.levId){
                  secctions.push({section : sections.section, pls:sections.plsId })
                }
              })
              levels.push({level: element.level, sections: secctions})
          }
        })

        const data = {
          levels : levels,
          periodLevelSection: periodLevelSection
        }
        res.status(StatusCodes.OK).json({ok: true, data: data})
      }else{
       res.status(StatusCodes.OK).json({ok: true, data: []})
      }    
    }, (err) => {
      message = err
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
      next(err)
    })

}


module.exports = {
    addPeriodLevelSection,
    getAllPeriodLevelSection,
    getOnePeriodLevelSectionById,
    updatePeriodLevelSection,
    deletePeriodLevelSection,
    getOnePeriodLevelSectionByPerId
}
