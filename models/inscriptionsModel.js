module.exports = (sequelize, DataTypes) => {

    const inscriptionsModel = sequelize.define("inscriptionsModel", {
        insId : {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'ins_id'    
        },
        rstId:{
            type: DataTypes.BIGINT,
            allowNull: false,
            field: 'rst_id'
        },
        plsId:{
            type: DataTypes.BIGINT,
            allowNull: false,
            field: 'pls_id'
        }
        ,
        insObservation:{
          type: DataTypes.STRING(200),
          allowNull: true,
          field: 'ins_observation'
        }
      
    }, {
        tableName: 'inscriptions',
        timestamps: false
      }) 

      inscriptionsModel.associate = function (models) {
        inscriptionsModel.belongsTo(models.periodLevelSectionModel, {
          as: 'periodLevelSectionI',
          foreignKey: 'plsId'
        })
        inscriptionsModel.belongsTo(models.representativeStudentModel, {
          as: 'representativeStudent',
          foreignKey: 'rstId'
        })
      }

    return inscriptionsModel
}