module.exports = (sequelize, DataTypes) => {

    const inscriptionsModel = sequelize.define("inscriptionsModel", {
        insId : {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'ins_id'    
        },
        plsId:{
            type: DataTypes.BIGINT,
            allowNull: false,
            field: 'pls_id'
        },
        famId:{
          type: DataTypes.BIGINT,
          allowNull: false,
          field: 'fam_id'
      },
        insObservation:{
          type: DataTypes.STRING(200),
          allowNull: true,
          field: 'ins_observation'
        },
        stuId:{
            type: DataTypes.BIGINT,
            allowNull: false,
            field: 'stu_id'
        },
        perId:{
          type: DataTypes.BIGINT,
            allowNull: false,
            field: 'per_id'
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
        inscriptionsModel.belongsTo(models.studentModel, {
          as: 'inscriptionS',
          foreignKey: 'stuId'
        })
        inscriptionsModel.belongsTo(models.familyModel, {
          as: 'inscriptionF',
          foreignKey: 'famId'
        })
        inscriptionsModel.belongsTo(models.periodsModel, {
          as: 'inscriptionP',
          foreignKey: 'perId'
        })
      }

    return inscriptionsModel
}