
module.exports = (sequelize, DataTypes) => {

    const federalEntityModel = sequelize.define("federalEntityModel", {
        fedId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
          field: 'fed_id'
        },
        fedName: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'fed_name'
        },
        couId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          field: 'cou_id'
        }

    }, {
        tableName: 'federal_entities',
        timestamps: false
      })

      federalEntityModel.associate = function (models) {

        federalEntityModel.belongsTo(models.countriesModel, {
          as: 'countries',
          foreignKey: 'couId'
        })
        federalEntityModel.hasMany(models.studentModel, {
          as: 'fed_stu',
          foreignKey: 'fedId'
        })
      }
    return federalEntityModel
}