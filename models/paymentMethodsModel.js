
module.exports = (sequelize, DataTypes) => {

    const paymentMethodsModel = sequelize.define("paymentMethodsModel", {
        payId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
          field: 'pay_id'
        },
   
        payName: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'pay_name'
        },
        payStatus: {
          type: DataTypes.INTEGER(11),
          allowNull: false,
          field: 'pay_status'
        }

    }, {
        tableName: 'payment_methods',
        timestamps: false
      })

      paymentMethodsModel.associate = function (models) {

        paymentMethodsModel.hasMany(models.paymentsModel, {
          as: 'paymentMethods_payments',
          foreignKey: 'payId'
        })
        paymentMethodsModel.hasMany(models.paymentDetailModel, {
          as: 'payMethods_payDetail',
          foreignKey: 'payId'
        })
      }
    return paymentMethodsModel
}