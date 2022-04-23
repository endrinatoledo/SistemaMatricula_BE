
module.exports = (sequelize, DataTypes) => {

    const periodsModel = sequelize.define("periodsModel", {
        perId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
          field: 'per_id'
        },
   
        perStartYear: {
          type: DataTypes.INTEGER(4),
          allowNull: false,
          field: 'per_start_year'
        },
   
        perEndYear: {
          type: DataTypes.INTEGER(4),
          allowNull: false,
          field: 'per_end_year'
        },
        perStatus: {
          type: DataTypes.INTEGER(11),
          allowNull: false,
          field: 'per_status'
        }

    }, {
        tableName: 'periods',
        timestamps: false
      })

      // periodsModel.associate = function (models) {

      //   periodsModel.hasMany(models.usersModel, {
      //     as: 'per_user',
      //     foreignKey: 'perId'
      //   })
      // }
    return periodsModel
}