
module.exports = (sequelize, DataTypes) => {

    const invoiceNumberModel = sequelize.define("invoiceNumberModel", {
        nuiId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
          field: 'nui_id'
        },
        nuiValue: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'nui_value'
        }

    }, {
        tableName: 'invoice_number',
        timestamps: false
      })

    return invoiceNumberModel
}