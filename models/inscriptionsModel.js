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
        },
        insStatus: {
          type: DataTypes.INTEGER(11),
          allowNull: true,
          field: 'ins_status'
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
          as: 'student',
          foreignKey: 'stuId'
        })
        inscriptionsModel.belongsTo(models.familyModel, {
          as: 'family',
          foreignKey: 'famId'
        })
        inscriptionsModel.belongsTo(models.periodsModel, {
          as: 'period',
          foreignKey: 'perId'
        })
        inscriptionsModel.hasMany(models.paymentSchemeConceptsModel, {
          as: 'ins_pco',
          foreignKey: 'insId'
        })
        inscriptionsModel.hasMany(models.studentPaymentSchemeModel, {
          as: 'stuPaySch_ins',
          foreignKey: 'insId'
        })
      }

    return inscriptionsModel
}


// ALTER TABLE matriculaoficial2.inscriptions ADD ins_status INTEGER NULL;
// UPDATE matriculaoficial2.inscriptions
//SET ins_status=1