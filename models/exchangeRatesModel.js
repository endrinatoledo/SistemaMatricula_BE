
module.exports = (sequelize, DataTypes) => {

    const exchangeRatesModel = sequelize.define("exchangeRatesModel", {
        excId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
          field: 'exc_id'
        },
        excAmount: {
          type: DataTypes.FLOAT,
          allowNull: false,
          field: 'exc_amount'
        },
        excDate: {
          type: DataTypes.DATEONLY,
          allowNull: false,
          field: 'exc_date'
        },
        excShift: {
          type: DataTypes.STRING(6),
          allowNull: true,
          field: 'exc_shift'
        }

    }, {
        tableName: 'exchange_rate',
        timestamps: false
      })

      exchangeRatesModel.associate = function (models) {

        exchangeRatesModel.hasMany(models.invoiceDetailModel, {
          as: 'inv_ech',
          foreignKey: 'excId'
        })
      }
    return exchangeRatesModel
}