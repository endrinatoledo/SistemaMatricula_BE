
module.exports = (sequelize, DataTypes) => {

    const controlNumberModel = sequelize.define("controlNumberModel", {
        nucId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
          field: 'nuc_id'
        },
        nucValue: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'nuc_value'
        }

    }, {
        tableName: 'control_number',
        timestamps: false
      })

    return controlNumberModel
}