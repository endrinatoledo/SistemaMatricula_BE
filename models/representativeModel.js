module.exports = (sequelize, DataTypes) => {

    const representativeModel = sequelize.define("representativeModel", {
        repId : {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'rep_id'    
        },
        repFirstName:{
            type: DataTypes.STRING(45),
            allowNull: false,
            field: 'rep_first_name' 
        },
        repSecondName:{
            type: DataTypes.STRING(45),
            allowNull: true,
            field: 'rep_second_name' 
        },
        repSurname:{
            type: DataTypes.STRING(45),
            allowNull: false,
            field: 'rep_surname' 
        },
        repSecondSurname:{
            type: DataTypes.STRING(45),
            allowNull: true,
            field: 'rep_second_name' 
        },
        repIdType:{
            type: DataTypes.STRING(1),
            allowNull: false,
            field: 'rep_second_name' 
        },
        repIdentificationNumber:{
            type: DataTypes.STRING(45),
            allowNull: false,
            field: 'rep_identification_number' 
        },
        repDateOfBirth:{
            type: DataTypes.DATEONLY,
            allowNull: false,
            field: 'rep_password' 
        },
        repSex:{
            type: DataTypes.STRING(1),
            allowNull: false,
            field: 'rep_sex' 
        },
        repAddress:{
            type: DataTypes.STRING(200),
            allowNull: false,
            field: 'rep_address' 
        },
        repCivilStatus:{
            type: DataTypes.STRING(10),
            allowNull: true,
            field: 'rep_address' 
        },
        proId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            field: 'pro_id'
        },
        repPhones:{
            type: DataTypes.STRING(200),
            allowNull: false,
            field: 'rep_phones' 
        },
        repEmail:{
            type: DataTypes.STRING(200),
            allowNull: false,
            field: 'rep_email' 
        },
        couId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            field: 'cou_id'
        },
        fedId: {
            type: DataTypes.BIGINT,
            allowNull: false, 
            field: 'fed_id'
        },
        repPhoto:{
            type: DataTypes.STRING(200),
            allowNull: false,
            field: 'rep_photo' 
        },        
        repStatus:{
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'rep_status' 
        }
    }, {
        tableName: 'representatives',
        timestamps: false
      }) 

      representativeModel.associate = function (models) {
        representativeModel.belongsTo(models.countriesModel, {
          as: 'countries',
          foreignKey: 'couId'
        })
        representativeModel.belongsTo(models.federalEntityModel, {
          as: 'federalEntity',
          foreignKey: 'fedId'
        })
        representativeModel.belongsTo(models.professionsModel, {
            as: 'professions',
            foreignKey: 'proId'
          })
      }

    return representativeModel
}