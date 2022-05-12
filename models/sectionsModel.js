
module.exports = (sequelize, DataTypes) => {

    const sectionsModel = sequelize.define("sectionsModel", {
        secId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
          field: 'sec_id'
        },
   
        secName: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'sec_name'
        },
        secStatus: {
          type: DataTypes.INTEGER(11),
          allowNull: false,
          field: 'sec_status'
        }

    }, {
        tableName: 'sections',
        timestamps: false
      })

      sectionsModel.associate = function (models) {

        sectionsModel.hasMany(models.periodLevelSectionModel, {
          as: 'sectionPeriodLevel',
          foreignKey: 'secId'
        })
      }
    return sectionsModel
}