
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

        famCode: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'fam_code'
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

      familyModel.associate = function (models) {

        familyModel.hasMany(models.representativeModel, {
          as: 'fam_repre',
          foreignKey: 'famId'
        })
        familyModel.hasMany(models.studentModel, {
          as: 'fam_student',
          foreignKey: 'famId'
        })
        familyModel.hasMany(models.representativeStudentModel, {
          as: 'fam_repstu',
          foreignKey: 'famId'
        })
      }
    return familyModel
}