
module.exports = (sequelize, DataTypes) => {    
    
    // esquema de pagos
        const paymentsModel = sequelize.define("paymentsModel", {
            paymId: {
              type: DataTypes.BIGINT,
              allowNull: false,
              primaryKey: true,
              autoIncrement: true,
              field: 'paym_id'
            },   
            payId: {
              type: DataTypes.BIGINT,
              allowNull: false,
              field: 'pay_id'
            },   
            paymAmount: {
              type: DataTypes.FLOAT,
              allowNull: false,
              field: 'paym_amount'
            },
            paymReference: {
              type: DataTypes.STRING(250),
              allowNull: true,
              field: 'paym_reference'
            },
            paymDate: {
              type: DataTypes.STRING(100),
              allowNull: false,
              field: 'paym_date'
            },
            paymDescription: {
              type: DataTypes.STRING(250),
              allowNull: true,
              field: 'paym_description'
            }
    
        }, {
            tableName: 'payments',
            timestamps: false
          })
    
          paymentsModel.associate = function (models) {
            paymentsModel.belongsTo(models.paymentMethodsModel, {
              as: 'paymentMethods',
              foreignKey: 'payId'
            })
          }
        return paymentsModel
    }