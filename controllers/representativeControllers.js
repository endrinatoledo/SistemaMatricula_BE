// const { default: ModelManager } = require("sequelize/types/model-manager");
const { LowercaseString, FirstCapitalLetter } = require('../utils/functions')
const { StatusCodes } = require('http-status-codes')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const db = require("../models");


const RepresentativeModel = db.representativeModel
const FederalEntityModel = db.federalEntityModel
const CountriesModel = db.countriesModel
const ProfessionsModel = db.professionsModel
const FamilyModel = db.familyModel
const StudentPaymentSchemeModel = db.studentPaymentSchemeModel
const InscriptionsModel = db.inscriptionsModel
const RepresentativeStudentModel = db.representativeStudentModel
const InvoiceConceptsModel = db.invoiceConceptsModel




//Add representative

const addRepresentative = async (req, res, next) => {

  if (!req.body.repFirstName || !req.body.repSurname || !req.body.repIdType ||
    !req.body.repIdentificationNumber ||  !req.body.repBond ||
    !req.body.repSex || !req.body.repAddress ||
    !req.body.repPhones 
    // !req.body.repDateOfBirth ||
    // || !req.body.repEmail 
    // || !req.body.couId 
    //  ||  !req.body.famId 
  ) return res.status(406).json({ ok: false, message: 'Todos los campos son obligatorios' });
  try {

    let idExists = await RepresentativeModel.findOne({
      where: {
        repIdentificationNumber: req.body.repIdentificationNumber,
        repIdType: req.body.repIdType
      }
    }).catch((err) => {

      throw err;
    });
    if (idExists) {
      return res.status(StatusCodes.OK).json({ ok: false, message: 'Identificación ya se encuentra registrada' })
    } else {
      RepresentativeModel.create({
        repFirstName: FirstCapitalLetter(LowercaseString(req.body.repFirstName)),
        repSecondName: (req.body.repSecondName) ? FirstCapitalLetter(LowercaseString(req.body.repSecondName)) : '',
        repSurname: FirstCapitalLetter(LowercaseString(req.body.repSurname)),
        repSecondSurname: (req.body.repSecondSurname) ? FirstCapitalLetter(LowercaseString(req.body.repSecondSurname)) : '',
        repIdType: req.body.repIdType,
        repIdentificationNumber: req.body.repIdentificationNumber,
        // repDateOfBirth: req.body.repDateOfBirth,
        repSex: req.body.repSex,
        repAddress: FirstCapitalLetter(LowercaseString(req.body.repAddress)),
        proId: req.body.proId ? req.body.proId : 260,
        repPhones: req.body.repPhones,
        repEmail: req.body.repEmail? LowercaseString(req.body.repEmail) : null,
        repCivilStatus: (req.body.repCivilStatus) ? req.body.repCivilStatus : '',
        couId: 232,
        fedId:7,
        // couId: req.body.couId,
        // fedId: (req.body.couId === 232) ? req.body.fedId : 26,
        repPhoto: req.body.repPhoto,
        repStatus: 1,
        repBond: req.body.repBond,
        // famId : req.body.famId
      })
        .then((representative) => {

          message = 'Representante creado con éxito';
          res.status(StatusCodes.OK).json({ ok: true, data: representative, message })
        }, (err) => {
          // message = err

          message = 'Error de conexión'
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, data: [], message })
          next(err)
        })
    }
  } catch (err) {
    message = err;
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message });
    next(err);
  }

}
//get All Representative
const getAllRepresentatives = async (req, res, next) => {

  RepresentativeModel.findAll({
    include: [{
      model: CountriesModel,
      as: 'countries',
      require: true
    }
      , {
      model: FederalEntityModel,
      as: 'federalEntity',
      require: true
    }
    , {
      model: ProfessionsModel,
      as: 'professions',
      require: true
    }
      // ,{
      //   model: FamilyModel,
      //   as: 'families',
      //   require: true
      // }
    ]
  })
    .then((representatives) => {
      res.status(StatusCodes.OK).json({ ok: true, data: representatives })
    }, (err) => {
      message = err
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message })
      next(err)
    })

}
//get All Representative by Id
const getOneRepresentativeById = async (req, res, next) => {


  RepresentativeModel.findOne({
    where: {
      repId: req.params.repId
    },
    include: [{
      model: CountriesModel,
      as: 'countries',
      require: true
    }
      , {
      model: FederalEntityModel,
      as: 'federalEntity',
      require: true
    }
    , {
      model: ProfessionsModel,
      as: 'professions',
      require: true
    }
      // ,{
      //   model: FamilyModel,
      //   as: 'families',
      //   require: true
      // }
    ]
  })
    .then((representative) => {
      res.status(StatusCodes.OK).json({ ok: true, data: representative })
    }, (err) => {
      message = err
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message })
      next(err)
    })

}
//Update Representative
const updateRepresentative = async (req, res, next) => {

  console.log(req.body)
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
      if (representative) {
        return res.status(StatusCodes.OK).json({ ok: false, message: 'Representante ya se encuentra registrado' })
      } else {
        RepresentativeModel.findOne({
          where: {
            repId: req.params.repId
          }
        }).then((representative) => {
          representative.update({
            repFirstName: (req.body.repFirstName != null) ? FirstCapitalLetter(LowercaseString(req.body.repFirstName)) : representative.repFirstName,
            repSecondName: (req.body.repSecondName != null) ? FirstCapitalLetter(LowercaseString(req.body.repSecondName)) : representative.repSecondName,
            repSurname: (req.body.repSurname != null) ? FirstCapitalLetter(LowercaseString(req.body.repSurname)) : representative.repSurname,
            repSecondSurname: (req.body.repSecondSurname != null) ? FirstCapitalLetter(LowercaseString(req.body.repSecondSurname)) : representative.repSecondSurname,
            repIdType: (req.body.repIdType != null) ? req.body.repIdType : representative.repIdType,
            repIdentificationNumber: (req.body.repIdentificationNumber != null) ? req.body.repIdentificationNumber : representative.repIdentificationNumber,
            // repDateOfBirth: (req.body.repDateOfBirth != null) ? req.body.repDateOfBirth : representative.repDateOfBirth,
            repSex: (req.body.repSex != null) ? req.body.repSex : representative.repSex,
            repAddress: (req.body.repAddress) ? FirstCapitalLetter(LowercaseString(req.body.repAddress)) : representative.repAddress,
            proId: (req.body.proId) ? req.body.proId : representative.proId,
            repPhones: (req.body.repPhones) ? req.body.repPhones : representative.repPhones,
            repEmail: (req.body.repEmail) ? LowercaseString(req.body.repEmail) : representative.repEmail,
            repCivilStatus: (req.body.repCivilStatus) ? req.body.repCivilStatus : representative.repCivilStatus,
            couId: (req.body.couId != null) ? req.body.couId : representative.couId,
            fedId: (req.body.couId === 232) ? req.body.fedId : 26,
            repPhoto: (req.body.repPhoto != null) ? req.body.repPhoto : representative.repPhoto,
            repStatus: (req.body.repStatus != null) ? req.body.repStatus : representative.repStatus,
            repBond: (req.body.repBond != null) ? req.body.repBond : representative.repBond,
            // famId : (req.body.famId != null) ? req.body.famId : representative.famId

          })
            .then((representative) => {
              message = 'Representante actualizado con éxito';
              res.status(StatusCodes.OK).json({ ok: true, data: representative, message })
            }, (err) => {
              message = err
              res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message })
              next(err)
            })
        }, (err) => {
          message = err
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message })
          next(err)
        })
      }
    }, (err) => {
      message = err
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message })
      next(err)
    })

}

//Delete Representative
const deleteRepresentative = async (req, res, next) => {

  RepresentativeModel.destroy({
    where: {
      repId: req.params.repId
    }
  }).then((rowsDeleted) => {
    if (rowsDeleted > 0) {
      return res.status(StatusCodes.OK).json({ ok: true, message: `Representante eliminado con éxito` })
    } else {
      return res.status(StatusCodes.OK).json({ ok: false, message: `Error al eliminar Representante` })
    }
  }, (err) => {
    message = err
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message })
    next(err)
  })

}

const getAllActiveRepresentatives = async (req, res, next) => {

  RepresentativeModel.findAll({
    where: {
      repStatus: 1
    },
    include: [{
      model: CountriesModel,
      as: 'countries',
      require: true
    }
      , {
      model: FederalEntityModel,
      as: 'federalEntity',
      require: true
    }
    , {
      model: ProfessionsModel,
      as: 'professions',
      require: true
    }
      // ,{
      //   model: FamilyModel,
      //   as: 'families',
      //   require: true
      // }
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
      res.status(StatusCodes.OK).json({ ok: true, data: representatives, lookup: null })


    }, (err) => {
      message = err
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message })
      next(err)
    })

}

const getRepresentativeByIdentification = async (req, res, next) => {

  if (!req.body.repIdType || !req.body.repIdentificationNumber) return res.status(406).json({ ok: false, message: 'Todos los campos son obligatorios' });

  try {
    RepresentativeModel.findOne({
      where: {
        repIdentificationNumber: req.body.repIdentificationNumber,
        repIdType: req.body.repIdType
      }
    }).then((representative) => {

      if (representative === null) {
        res.status(StatusCodes.OK).json({ ok: true, data: 'noRegistrado', message: 'Identificación no Registrada' })
      } else {
        res.status(StatusCodes.OK).json({ ok: true, result: representative, data: 'registrado', message: 'Identificación ya Registrada' })
      }

    }, (err) => {
      // message = err

      message = 'Error de conexión'
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, data: [], message })
      next(err)
    })
      .catch((err) => {
        throw err;
      })
  } catch (error) {

  }

}

const getRepresentativePayments = async (req, res, next) => {

  console.log('***************************', req.params.repId)
  if (!req.params.repId) return res.status(406).json({ ok: false, message: 'Todos los campos son obligatorios' });

  try {

    RepresentativeStudentModel.findAll({
      where: {repId: req.params.repId},
      group: "famId",
    }).then((repStu) => {

     }, (err) => {
      // message = err
      message = 'Error de conexión al cosultar representante'
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, data: [], message })
      next(err)
    })

    // RepresentativeStudentModel.findOne({
    //   repId: req.params.repId
    // }).then((repStu) => {
    //   console.log('***********************************************', repStu)
    //   if (repStu !== null && repStu !== undefined) {

    //     FamilyModel.findOne({
    //       famId: repStu.famId
    //     }).then((family) => {
    //       console.log('###################################', family)
    //       if (repStu !== null && repStu !== undefined) {

    //         StudentPaymentSchemeModel.findAll({
    //           include: [{
    //             model: InscriptionsModel,
    //             as: 'inscriptions',
    //             require: true,
    //             where:{
    //               famId: family.famId
    //             }
    //           }, {
    //             model: InvoiceConceptsModel,
    //             as: 'invoiceConcepts',
    //             require: true,
    //           }
    //           ]
    //         }).then((resul) => {
    //           console.log('resultttttttttttttttttttttttttttt', resul)
    //           if (resul === null) {
    //             res.status(StatusCodes.OK).json({ ok: true, data: [] })
    //           } else {
    //             res.status(StatusCodes.OK).json({ ok: true, data: resul })
    //           }
    //         }, (err) => {
    //           // message = err
    //           message = 'Error de conexión'
    //           res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, data: [], message })
    //           next(err)
    //         })


    //         // res.status(StatusCodes.OK).json({ ok: true, data: [] })
    //       } else {
    //         res.status(StatusCodes.OK).json({ ok: false, data: [], message: 'Representante no encontrado' })

    //       }
    //     }, (err) => {
    //       console.log(err)
    //       message = 'Error al consultar familia'
    //       res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, data: [], message })
    //       next(err)
    //     })

    //   } else {
    //     res.status(StatusCodes.OK).json({ ok: false, data: [], message: 'Representante no encontrado' })
    //   }
    // }, (err) => {
    //   console.log(err)
    //   message = 'Error de conexión'
    //   res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, data: [], message })
    //   next(err)
    // })




  } catch (error) {
    message = 'Error de conexión'
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, data: [], message })
    next(err)

  }

}

module.exports = {
  addRepresentative,
  getAllRepresentatives,
  getOneRepresentativeById,
  updateRepresentative,
  deleteRepresentative,
  getAllActiveRepresentatives,
  getRepresentativeByIdentification,
  getRepresentativePayments,
}
