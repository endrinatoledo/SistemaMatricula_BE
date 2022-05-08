
module.exports = (sequelize, DataTypes) => {

    const professionsModel = sequelize.define("professionsModel", {
        proId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
          field: 'pro_id'
        },
   
        proName: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'pro_name'
        }

    }, {
        tableName: 'professions',
        timestamps: false
      })

      professionsModel.associate = function (models) {

        professionsModel.hasMany(models.representativeModel, {
          as: 'pro_rep',
          foreignKey: 'proId'
        })
      }
    return professionsModel
}