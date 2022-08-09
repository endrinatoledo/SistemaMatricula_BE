
module.exports = (sequelize, DataTypes) => {

  // esquema de pagos
  const studentPaymentSchemeModel = sequelize.define("studentPaymentSchemeModel", {
    spsId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'sps_id'
    },
    // stuId: {
    //     type: DataTypes.BIGINT,
    //     allowNull: false,
    //   field: 'stu_id'
    // },   
    // pcoId: {
    //   type: DataTypes.BIGINT,
    //   allowNull: false,
    //   field: 'pco_id'
    // },
    // pscId: {
    //  type: DataTypes.BIGINT,
    //  allowNull: false,
    //  field: 'psc_id'
    // },
    icoId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'ico_id'
    },
    spsAmount: {
      type: DataTypes.FLOAT,
      allowNull: true,
      field: 'sps_amount'
    },
    spsAmountPaid: {
      type: DataTypes.FLOAT,
      allowNull: true,
      field: 'sps_amount_paid'
    },
    insId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'ins_id'
    },
    plsId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'pls_id'
    },

  }, {
    tableName: 'student_payment_scheme',
    timestamps: false
  })

  studentPaymentSchemeModel.associate = function (models) {
    // studentPaymentSchemeModel.belongsTo(models.studentModel, {
    //   as: 'students',
    //   foreignKey: 'stuId'
    // })
    // studentPaymentSchemeModel.belongsTo(models.paymentSchemeConceptsModel, {
    //     as: 'paymentSchemeConcepts',
    //     foreignKey: 'pscId'
    // })
    // studentPaymentSchemeModel.belongsTo(models.paymentSchemeModel, {
    //     as: 'paymentScheme',
    //     foreignKey: 'pcoId'
    // })

    studentPaymentSchemeModel.belongsTo(models.invoiceConceptsModel, {
      as: 'invoiceConcepts',
      foreignKey: 'icoId'
    })
    studentPaymentSchemeModel.hasMany(models.paymentsConceptsStudentsModel, {
      as: 'stuPaySch_payConStu',
      foreignKey: 'spsId'
    })
    studentPaymentSchemeModel.belongsTo(models.inscriptionsModel, {
      as: 'inscriptions',
      foreignKey: 'insId'
    })
    studentPaymentSchemeModel.belongsTo(models.periodLevelSectionModel, {
      as: 'periodLevelSection',
      foreignKey: 'plsId'
    })
  }
  return studentPaymentSchemeModel
}