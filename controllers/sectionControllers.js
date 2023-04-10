const {  StatusCodes } = require('http-status-codes')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const db = require("../models");

const sectionsModel = db.sectionsModel

//Add section

const addSection =  async (req, res,next) =>{

    if (req.body.secName === '' || req.body.secStatus === 0) return res.status(406).json({ok: false, message: 'Todos los campos son obligatorios'});
    try {

        let sectionExists = await sectionsModel.findOne({
            where: { secName: req.body.secName }
      
          }).catch((err) => {
            throw err; 
          });

          if (sectionExists){
            return res.status(StatusCodes.OK).json({ok: false, message: 'Sección ya se encuentra registrada'})
          }else{
            sectionsModel.create({
                secName: req.body.secName,
                secStatus: req.body.secStatus
            })
            .then((section) => {
                message = 'Sección creada con éxito';
                res.status(StatusCodes.OK).json({ok: true,data: section, message})
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
//get All section
const getAllSections =  async (req, res, next) =>{

    sectionsModel.findAll({})
    .then((sections) => {
        res.status(StatusCodes.OK).json({ok: true, data: sections})
    }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
        next(err)
      })

}
//get All section by Id
const getOneSectionById =  async (req, res, next) =>{
  
    sectionsModel.findOne({
        where: {
            secId: req.params.secId
        }
      })
      .then((section) => {
        res.status(StatusCodes.OK).json({ok: true, data: section})
      }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
        next(err)
      })

}
//Update section
const updateSection =  async (req, res, next) =>{

  // console.log('llego', req.body)

    sectionsModel.findOne({
        where: {
            secName: req.body.secName,
            secId: {
            [Op.ne]: req.params.secId
          }
        }
      })
      .then((section) => {
        if(section){
          return res.status(StatusCodes.OK).json({ok: false, message: 'Sección ya se encuentra registrada'})
        }else{    
            sectionsModel.findOne({
            where: {
              secId: req.params.secId          
            }
          }).then((section) => {
            section.update({
                secName: (req.body.secName != null) ? req.body.secName : section.secName,
                secStatus: (req.body.secStatus != null) ? req.body.secStatus : section.secStatus
                })
                .then((section) => {
                  message = 'Sección actualizada con éxito';
                  res.status(StatusCodes.OK).json({ok: true, data:section, message})
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
//Delete section
const deleteSection =  async (req, res, next) =>{

    sectionsModel.destroy({      
        where: {
            secId: req.params.secId
          }        
        }).then((rowsDeleted) => {  
        if(rowsDeleted > 0) {
          return res.status(StatusCodes.OK).json({ok: true, message: `Sección eliminada con éxito`})  
        }else{
          return res.status(StatusCodes.OK).json({ok: false, message: `Error al eliminar Sección`})  
        }
      }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false,message})
        next(err)
      })    

}
//get All Active section
const getAllActiveSections =  async (req, res, next) =>{

  sectionsModel.findAll({
    where: {
      secStatus: 1
      }
  })
  .then((sections) => {
      res.status(StatusCodes.OK).json({ok: true, data: sections})
  }, (err) => {
      message = err
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
      next(err)
    })

}

module.exports = {
    addSection,
    getAllSections,
    getOneSectionById,
    updateSection,
    deleteSection,
    getAllActiveSections
}
