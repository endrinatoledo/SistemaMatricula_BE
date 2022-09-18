
module.exports = (sequelize, DataTypes) => {

    const levelsModel = sequelize.define("levelsModel", {
        levId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
          field: 'lev_id'
        },
   
        levName: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'lev_name'
        },
        levStatus: {
          type: DataTypes.INTEGER(11),
          allowNull: false,
          field: 'lev_status'
        }

    }, {
        tableName: 'levels',
        timestamps: false
      })

      levelsModel.associate = function (models) {

        levelsModel.hasMany(models.periodLevelSectionModel, {
          as: 'levelPeriodSection',
          foreignKey: 'levId'
        })
        levelsModel.hasMany(models.monthlyPaymentModel, {
          as: 'lev_monthly',
          foreignKey: 'levId'
        })
      }
    return levelsModel
}