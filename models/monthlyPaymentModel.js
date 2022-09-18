module.exports = (sequelize, DataTypes) => {

    const monthlyPaymentModel = sequelize.define("monthlyPaymentModel", {
        mopId : {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'mop_id'    
        },
        perId:{
            type: DataTypes.BIGINT,
            allowNull: false,
            field: 'per_id'
        },
        mopMonth:{
            type: DataTypes.STRING(100),
            allowNull: true,
            field: 'mop_month'
        },
        stuId:{
          type: DataTypes.BIGINT,
          allowNull: false,
          field: 'stu_id'
        },
        famId:{
          type: DataTypes.BIGINT,
          allowNull: false,
          field: 'fam_id'
        },
        mopStatus:{
          type: DataTypes.INTEGER(11),
          allowNull: false,
          field: 'mop_status'
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
        },
      //   mopObservation:{
      //     type: DataTypes.STRING(250),
      //     allowNull: true,
      //     field: 'mop_observation'
      // },
      
    }, {
        tableName: 'monthly_payment',
        timestamps: false
      }) 

      monthlyPaymentModel.associate = function (models) {
        monthlyPaymentModel.belongsTo(models.periodsModel, {
          as: 'period',
          foreignKey: 'perId'
        })
        monthlyPaymentModel.belongsTo(models.levelsModel, {
          as: 'level',
          foreignKey: 'levId'
        })
        monthlyPaymentModel.belongsTo(models.sectionsModel, {
          as: 'section',
          foreignKey: 'secId'
        })
        monthlyPaymentModel.belongsTo(models.familyModel, {
          as: 'family',
          foreignKey: 'famId'
        }) 
        monthlyPaymentModel.belongsTo(models.studentModel, {
          as: 'student',
          foreignKey: 'famId'
        })

      }

    return monthlyPaymentModel
}