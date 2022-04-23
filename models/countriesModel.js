
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

        // countriesModel.hasMany(models.usersModel, {
        //   as: 'cou_user',
        //   foreignKey: 'coud'
        // })
      }
    return countriesModel
}