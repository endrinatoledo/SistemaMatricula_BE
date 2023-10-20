// const { Sequelize } = require('sequelize/types')
const dbConfig = require('../config/config')

const {Sequelize, DataTypes} = require('sequelize')

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,{
        host:dbConfig.HOST,
        dialect : dbConfig.DIALECT,
        // logging: console.log,
        operatorsAliases: false,

        pool:{
            max: dbConfig.POOL.MAX,
            min: dbConfig.POOL.MIN,
            acquire: dbConfig.POOL.ACQUIRE,
            idle : dbConfig.POOL.IDLE
        }
    }
)

sequelize.authenticate()
.then(() => {
    // console.log('connected..')
})
.catch(err => {
    console.log('Error'+ err)
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.usersModel =  require('./userModel.js')(sequelize,DataTypes)
db.rolesModel =  require('./rolesModel.js')(sequelize,DataTypes)

db.levelsModel =  require('./levelsModel')(sequelize,DataTypes)
db.sectionsModel =  require('./sectionsModel')(sequelize,DataTypes)
db.countriesModel =  require('./countriesModel')(sequelize,DataTypes)
db.paymentMethodsModel =  require('./paymentMethodsModel')(sequelize,DataTypes)
db.professionsModel =  require('./professionsModel')(sequelize,DataTypes)
db.periodsModel =  require('./periodsModel')(sequelize,DataTypes)
db.federalEntityModel =  require('./federalEntityModel')(sequelize,DataTypes)
db.schoolDataModel =  require('./schoolDataModel')(sequelize,DataTypes)
db.exchangeRatesModel =  require('./exchangeRatesModel')(sequelize,DataTypes)
db.invoiceConceptsModel =  require('./invoiceConceptsModel')(sequelize,DataTypes)
db.representativeStudentModel =  require('./representativeStudentModel')(sequelize,DataTypes)
db.periodLevelSectionModel =  require('./periodLevelSectionModel')(sequelize,DataTypes)
db.inscriptionsModel =  require('./inscriptionsModel')(sequelize,DataTypes)
db.familyModel =  require('./familyModel')(sequelize,DataTypes)
db.studentModel =  require('./studentModel')(sequelize,DataTypes)
db.representativeModel =  require('./representativeModel')(sequelize,DataTypes)
db.paymentSchemeModel =  require('./paymentSchemeModel')(sequelize,DataTypes)
db.paymentSchemeConceptsModel =  require('./paymentSchemeConceptsModel')(sequelize,DataTypes)
db.studentPaymentSchemeModel =  require('./studentPaymentSchemeModel')(sequelize,DataTypes)
db.paymentsModel =  require('./paymentsModel')(sequelize,DataTypes)
db.paymentsConceptsStudentsModel =  require('./paymentsConceptsStudentsModel')(sequelize,DataTypes)
db.monthlyPaymentModel =  require('./monthlyPaymentModel')(sequelize,DataTypes)
db.paymentDetailModel =  require('./paymentDetailModel')(sequelize,DataTypes)
db.banksModel =  require('./banksModel')(sequelize,DataTypes)
db.costoMensualidadesModel = require('./costoMensualidadesModel')(sequelize, DataTypes)
db.invoiceHeaderModel = require('./invoiceHeaderModel')(sequelize, DataTypes)
db.controlNumberModel = require('./controlNumberModel')(sequelize, DataTypes)
db.invoiceNumberModel = require('./invoiceNumberModel')(sequelize, DataTypes)
db.invoiceDetailModel = require('./invoiceDetailModel')(sequelize, DataTypes)
db.companiesModel = require('./companiesModel')(sequelize, DataTypes)
db.conceptosAdicionalesModel = require('./conceptosAdicionalesModel')(sequelize, DataTypes)

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  }); 
//    
 db.sequelize.sync({ alter:false }).then(() => {  
    // console.log('yes re-sync done!') 
})

module.exports = db