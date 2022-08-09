module.exports = (sequelize, DataTypes) => {

    const periodLevelSectionModel = sequelize.define("periodLevelSectionModel", {
        plsId : {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'pls_id'    
        },
        perId:{
            type: DataTypes.BIGINT,
            allowNull: false,
            field: 'per_id'
        },
        levId:{
            type: DataTypes.BIGINT,
            allowNull: false,
            field: 'lev_id'
        },
        secId:{
          type: DataTypes.BIGINT,
          allowNull: false,
          field: 'sec_id'
        }
      
    }, {
        tableName: 'period_level_section',
        timestamps: false
      }) 

      periodLevelSectionModel.associate = function (models) {
        periodLevelSectionModel.belongsTo(models.periodsModel, {
          as: 'period',
          foreignKey: 'perId'
        })
        periodLevelSectionModel.belongsTo(models.levelsModel, {
          as: 'level',
          foreignKey: 'levId'
        })
        periodLevelSectionModel.belongsTo(models.sectionsModel, {
          as: 'section',
          foreignKey: 'secId'
        })
        periodLevelSectionModel.hasMany(models.inscriptionsModel, {
          as: 'inscriptionP',
          foreignKey: 'insId'
        }) 
        // periodLevelSectionModel.hasMany(models.paymentSchemeConceptsModel, {
        //   as: 'psc_pco',
        //   foreignKey: 'plsId'
        // })
        periodLevelSectionModel.hasMany(models.studentPaymentSchemeModel, {
          as: 'periodLevelSection_studentPaymentScheme',
          foreignKey: 'plsId'
        })

      }

    return periodLevelSectionModel
}