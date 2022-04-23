// const { Sequelize } = require('sequelize/types')
const dbConfig = require('../config/config')

const {Sequelize, DataTypes} = require('sequelize')

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,{
        host:dbConfig.HOST,
        dialect : dbConfig.DIALECT,
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
db.familyModel =  require('./familyModel')(sequelize,DataTypes)
db.levelsModel =  require('./levelsModel')(sequelize,DataTypes)
db.sectionsModel =  require('./sectionsModel')(sequelize,DataTypes)
db.countriesModel =  require('./countriesModel')(sequelize,DataTypes)
db.paymentMethodsModel =  require('./paymentMethodsModel')(sequelize,DataTypes)
db.professionsModel =  require('./professionsModel')(sequelize,DataTypes)
db.periodsModel =  require('./periodsModel')(sequelize,DataTypes)

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

db.sequelize.sync({ force: false })
.then(() => {
    // console.log('yes re-sync done!')
})

module.exports = db