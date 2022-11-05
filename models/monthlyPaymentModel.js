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
        insId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          field: 'ins_id'
        },
        levId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          field: 'lev_id'
        },
        secId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          field: 'sec_id'
        },
        mopMonth:{
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'mop_month'
        },
        mopAmount:{
          type: DataTypes.FLOAT,
          allowNull: false,
          field: 'mop_amount'
        },
        mopAmountPaid:{
          type: DataTypes.FLOAT,
          allowNull: false,
          field: 'mop_amount_paid'
        },
        mopStatus:{
          type: DataTypes.INTEGER(11),
          allowNull: false,
          field: 'mop_status'
        }
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
        monthlyPaymentModel.belongsTo(models.inscriptionsModel, {
          as: 'inscriptionMonthly',
          foreignKey: 'insId'
        })
        monthlyPaymentModel.hasMany(models.invoiceDetailModel, {
          as: 'mon_inv',
          foreignKey: 'mopId'
        })

      }

    return monthlyPaymentModel
}