// const { default: ModelManager } = require("sequelize/types/model-manager");
const {  StatusCodes } = require('http-status-codes')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const db = require("../models");

const RepresentativeModel = db.representativeModel
const FederalEntityModel = db.federalEntityModel
const CountriesModel = db.countriesModel
const ProfessionsModel = db.professionsModel


//Add representative

const addRepresentative =  async (req, res, next) =>{


    if (!req.body.repFirstName || !req.body.repSurname || !req.body.repIdType || 
       !req.body.repIdentificationNumber|| !req.body.repDateOfBirth || 
       !req.body.repSex || !req.body.repAddress || !req.body.proId || 
       !req.body.repPhones || !req.body.repEmail ||
       !req.body.couId || !req.body.fedId || !req.body.repStatus
       ) return res.status(406).json({ok: false, message: 'Todos los campos son obligatorios'});
    try {
        let idExists = await RepresentativeModel.findOne({
            where: { 
              repIdentificationNumber: req.body.repIdentificationNumber,
              repIdType: req.body.repIdType 
            }      
          }).catch((err) => {

            throw err; 
          });
          if (idExists){
            return res.status(StatusCodes.OK).json({ok: false, message: 'Identificación ya se encuentra registrada'})
          }else{
            RepresentativeModel.create({
              repFirstName: req.body.repFirstName,
              repSecondName: (req.body.repSecondName)?req.body.repSecondName : '',
              repSurname: req.body.repSurname,
              repSecondSurname: (req.body.repSecondSurname)?req.body.repSecondSurname : '',
              repIdType: req.body.repIdType,
              repIdentificationNumber: req.body.repIdentificationNumber,
              repDateOfBirth: req.body.repDateOfBirth,
              repSex: req.body.repSex,
              repAddress: req.body.repAddress,
              proId : req.body.proId,
              repPhones : req.body.repPhones,
              repEmail :req.body.repEmail,
              repCivilStatus: (req.body.repCivilStatus)?req.body.repCivilStatus:'',
              couId: req.body.couId,
              fedId: req.body.fedId,
              repPhoto: req.body.repPhoto,
              repStatus: req.body.repStatus
            })
            .then((representative) => {

                message = 'Representante creado con éxito';
                res.status(StatusCodes.OK).json({ok: true,data: representative, message})
              }, (err) => {
                // message = err

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
//get All Representative
const getAllRepresentatives =  async (req, res, next) =>{

    RepresentativeModel.findAll({
      include: [{
        model: CountriesModel,
        as: 'countries',
        require: true
      }
      ,{
        model: FederalEntityModel,
        as: 'federalEntity',
        require: true
      },{
        model: ProfessionsModel,
        as: 'professions',
        require: true
      }
    ]
    })
    .then((representatives) => {
        res.status(StatusCodes.OK).json({ok: true, data: representatives})
    }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
        next(err)
      })

}
//get All Representative by Id
const getOneRepresentativeById =  async (req, res, next) =>{

    RepresentativeModel.findOne({
        where: {
          repId: req.params.repId
        },
        include: [{
          model: CountriesModel,
          as: 'countries',
          require: true
        }
        ,{
          model: FederalEntityModel,
          as: 'federalEntity',
          require: true
        },{
          model: ProfessionsModel,
          as: 'professions',
          require: true
        }
      ]
      })
      .then((representative) => {
        res.status(StatusCodes.OK).json({ok: true, data: representative})
      }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
        next(err)
      })

}
//Update Representative
const updateRepresentative =  async (req, res, next) =>{

    RepresentativeModel.findOne({
        where: {
          repIdentificationNumber: req.body.repIdentificationNumber,
          repIdType: req.body.repIdType,
          repId: {
            [Op.ne]: req.params.repId
          }
        }
      })
      .then((representative) => {
        if(representative){
          return res.status(StatusCodes.OK).json({ok: false, message: 'Representante ya se encuentra registrado'})
        }else{    
            RepresentativeModel.findOne({
            where: {
              repId: req.params.repId          
            }
          }).then((representative) => {
                representative.update({
                  repFirstName: (req.body.repFirstName != null) ? req.body.repFirstName : representative.repFirstName,
                  repSecondName: (req.body.repSecondName != null) ? req.body.repSecondName : representative.repSecondName,
                  repSurname: (req.body.repSurname != null) ? req.body.repSurname : representative.repSurname,
                  repSecondSurname: (req.body.repSecondSurname != null) ? req.body.repSecondSurname : representative.repSecondSurname,
                  repIdType: (req.body.repIdType != null) ? req.body.repIdType : representative.repIdType,
                  repIdentificationNumber: (req.body.repIdentificationNumber != null) ? req.body.repIdentificationNumber : representative.repIdentificationNumber,
                  repDateOfBirth: (req.body.repDateOfBirth != null) ? req.body.repDateOfBirth : representative.repDateOfBirth,
                  repSex: (req.body.repSex != null) ? req.body.repSex : representative.repSex,
                  repAddress: (req.body.repAddress)? req.body.repAddress : representative.repAddress,
                  proId : (req.body.proId) ? req.body.proId : representative.proId,
                  repPhones : (req.body.repPhones) ? req.body.repPhones : representative.repPhones,
                  repEmail :(req.body.repEmail) ?  req.body.repEmail : representative.repEmail,
                  repCivilStatus: (req.body.repCivilStatus)?req.body.repCivilStatus:'',
                  couId: (req.body.couId != null) ? req.body.couId : representative.couId,
                  fedId: (req.body.fedId != null) ? req.body.fedId : representative.fedId,
                  repPhoto: (req.body.repPhoto != null) ? req.body.repPhoto : representative.repPhoto,
                  repStatus: (req.body.repStatus != null) ? req.body.repStatus : representative.repStatus,
                })
                .then((representative) => {
                  message = 'Representante actualizado con éxito';
                  res.status(StatusCodes.OK).json({ok: true, data:representative, message})
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

//Delete Representative
const deleteRepresentative =  async (req, res, next) =>{

    RepresentativeModel.destroy({      
        where: {
          repId: req.params.repId
          }        
        }).then((rowsDeleted) => {  
        if(rowsDeleted > 0) {
          return res.status(StatusCodes.OK).json({ok: true, message: `Representante eliminado con éxito`})  
        }else{
          return res.status(StatusCodes.OK).json({ok: false, message: `Error al eliminar Representante`})  
        }
      }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false,message})
        next(err)
      })    

}

const getAllActiveRepresentatives =  async (req, res, next) =>{

  RepresentativeModel.findAll({
    where: {
      repStatus: 1
      },
      include: [{
        model: CountriesModel,
        as: 'countries',
        require: true
      }
      ,{
        model: FederalEntityModel,
        as: 'federalEntity',
        require: true
      },{
        model: ProfessionsModel,
        as: 'professions',
        require: true
      }
    ]
  })
  .then((representatives) => {
 
    // if(representatives.length > 0){

    //   const lookup = representatives.reduce(function(acc, cur) {
    //     acc[cur.rolId] = cur.rolName;
    //     return acc;
    //   }, {})

    //   res.status(StatusCodes.OK).json({ok: true, data: representatives, lookup})
    // }else{
    //   res.status(StatusCodes.OK).json({ok: true, data: representatives, lookup:null})
    // }
       res.status(StatusCodes.OK).json({ok: true, data: representatives, lookup:null})


  }, (err) => {
      message = err
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message})
      next(err)
    })

}

module.exports = {
    addRepresentative,
    getAllRepresentatives,
    getOneRepresentativeById,
    updateRepresentative,
    deleteRepresentative,
    getAllActiveRepresentatives
}
