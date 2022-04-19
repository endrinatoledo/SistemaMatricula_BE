
module.exports = (sequelize, DataTypes) => {

    const familyModel = sequelize.define("familyModel", {
        famId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
          field: 'fam_id'
        },
   
        famName: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'fam_name'
        },
        famStatus: {
          type: DataTypes.INTEGER(11),
          allowNull: false,
          field: 'fam_status'
        }

    }, {
        tableName: 'families',
        timestamps: false
      })

      // familyModel.associate = function (models) {

      //   familyModel.hasMany(models.usersModel, {
      //     as: 'fam_user',
      //     foreignKey: 'famId'
      //   })
      // }
    return familyModel
}