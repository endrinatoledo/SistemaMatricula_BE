
module.exports = (sequelize, DataTypes) => {

    const schoolDataModel = sequelize.define("schoolDataModel", {
        schId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
          field: 'sch_id'
        },
        schName: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'sch_name'
        },
        schRif: {
          type: DataTypes.STRING(100),
          allowNull: true,
          field: 'sch_rif'
        },
        couId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          field: 'cou_id'
        },
        schAddress: {
          type: DataTypes.STRING(200),
          allowNull: true,
          field: 'sch_address'
        },
        schLogo: {
          type: DataTypes.STRING(200),
          allowNull: true,
          field: 'sch_logo'
        },
        schLandline: {
          type: DataTypes.STRING(200),
          allowNull: true,
          field: 'sch_landline'
        },
        schMobilePhone: {
          type: DataTypes.STRING(200),
          allowNull: true,
          field: 'sch_mobile_phone'
        }

    }, {
        tableName: 'school_data',
        timestamps: false
      })

      schoolDataModel.associate = function (models) {

        schoolDataModel.belongsTo(models.countriesModel, {
          as: 'countries',
          foreignKey: 'couId'
        })
      }
    return schoolDataModel
}