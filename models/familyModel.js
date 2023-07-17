
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

        familyModel.hasMany(models.invoiceHeaderModel, {
          as: 'fam_invoice',
          foreignKey: 'famId'
        })
        familyModel.hasMany(models.inscriptionsModel, {
          as: 'inscription',
          foreignKey: 'famId'
        })
        familyModel.hasMany(models.representativeStudentModel, {
          as: 'fam_repstu',
          foreignKey: 'famId'
        })
        familyModel.hasMany(models.paymentsConceptsStudentsModel, {
          as: 'fam_paymentsConceptsStudents',
          foreignKey: 'famId'
        })
        familyModel.hasMany(models.monthlyPaymentModel, {
          as: 'fam_monthly',
          foreignKey: 'famId'
        })
        familyModel.hasMany(models.conceptosAdicionalesModel, {
          as: 'fam_conceptosAdicionales',
          foreignKey: 'famId'
        })
      }
    return familyModel
}