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
        mopEne:{
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'mop_ene'
        },
        mopFeb:{
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'mop_feb'
        },
        mopMar:{
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'mop_mar'
        },
        mopAbr:{
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'mop_abr'
        },
        mopMay:{
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'mop_may'
        },
        mopJun:{
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'mop_jun'
        },
        mopJul:{
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'mop_jul'
        },
        mopAgo:{
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'mop_ago'
        },
        mopSep:{
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'mop_sep'
        },
        mopOct:{
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'mop_oct'
        },
        mopNov:{
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'mop_nov'
        },
        mopDic:{
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'mop_dic'
        },      
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
          foreignKey: 'stuId'
        })
        monthlyPaymentModel.hasMany(models.paymentDetailModel, {
              as: 'mon_pay',
              foreignKey: 'mopId'
        })

      }

    return monthlyPaymentModel
}