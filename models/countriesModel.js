
module.exports = (sequelize, DataTypes) => {

    const countriesModel = sequelize.define("countriesModel", {
        couId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
          field: 'cou_id'
        },
   
        couName: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'cou_name'
        }

    }, {
        tableName: 'countries',
        timestamps: false
      })

      countriesModel.associate = function (models) {

        countriesModel.hasMany(models.federalEntityModel, {
          as: 'cou_fed',
          foreignKey: 'couId'
        })
        countriesModel.hasMany(models.schoolDataModel, {
          as: 'cou_school_data',
          foreignKey: 'couId'
        })
        countriesModel.hasMany(models.studentModel, {
          as: 'cou_stu',
          foreignKey: 'couId'
        })
      }
    return countriesModel
}