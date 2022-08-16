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
            field: 'rep_second_surname' 
        },
        repIdType:{
            type: DataTypes.STRING(1),
            allowNull: false,
            field: 'rep_id_type' 
        },
        repIdentificationNumber:{
            type: DataTypes.STRING(45),
            allowNull: false,
            field: 'rep_identification_number' 
        },
        repDateOfBirth:{
            type: DataTypes.DATEONLY,
            allowNull: true,
            field: 'rep_date_of_birth' 
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
            type: DataTypes.STRING(13),
            allowNull: true,
            field: 'rep_civil_status' 
        },
        proId: {
            type: DataTypes.BIGINT,
            allowNull: true,
            field: 'pro_id'
        },
        repPhones:{
            type: DataTypes.STRING(200),
            allowNull: false,
            field: 'rep_phones' 
        },
        repEmail:{
            type: DataTypes.STRING(200),
            allowNull: true,
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
            allowNull: true,
            field: 'rep_photo' 
        },        
        repStatus:{
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'rep_status' 
        },
        repBond:{ 
            type: DataTypes.STRING(5),
            allowNull: false,
            field: 'rep_bond' 
        }
        // ,
        // famId: {
        //     type: DataTypes.BIGINT,
        //     allowNull: false, 
        //     field: 'fam_id'
        // },
    }, {
        tableName: 'representatives',
        timestamps: false
      }) 

    //   representativeModel.belongsTo(models.familyModel, {
    //     as: 'families',
    //     foreignKey: 'famId'
    //   })  
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
          representativeModel.hasMany(models.representativeStudentModel, {
            as: 'representativeStu',
            foreignKey: 'repId'
          })  

      }

    return representativeModel
}