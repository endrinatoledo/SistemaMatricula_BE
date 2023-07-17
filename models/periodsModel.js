
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

      periodsModel.associate = function (models) {

        periodsModel.hasMany(models.periodLevelSectionModel, {
          as: 'periodLevelSection',
          foreignKey: 'perId'
        })
        periodsModel.hasMany(models.inscriptionsModel, {
          as: 'perdiodI',
          foreignKey: 'perId'
        })
        periodsModel.hasMany(models.invoiceHeaderModel, {
          as: 'perdiod_Invoice',
          foreignKey: 'perId'
        })
        periodsModel.hasMany(models.monthlyPaymentModel, {
          as: 'per_monthly',
          foreignKey: 'perId'
        })
        periodsModel.hasMany(models.conceptosAdicionalesModel, {
          as: 'per_ceonceptosAdicionales',
          foreignKey: 'perId'
        })

      }
    return periodsModel
}