
module.exports = (sequelize, DataTypes) => {

    const invoiceConceptsModel = sequelize.define("invoiceConceptsModel", {
        icoId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
          field: 'ico_id'
        },
   
        icoName: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'ico_name'
        },
   
        icoDescription: {
          type: DataTypes.STRING(100),
          allowNull: true,
          field: 'ico_description'
        },
        icoStatus: {
          type: DataTypes.INTEGER(11),
          allowNull: false,
          field: 'ico_status'
        }

    }, {
        tableName: 'invoice_concepts',
        timestamps: false
      })

      invoiceConceptsModel.associate = function (models) {

        invoiceConceptsModel.hasMany(models.paymentSchemeConceptsModel, {
          as: 'ico_pco',
          foreignKey: 'icoId'
        })
        invoiceConceptsModel.hasMany(models.studentPaymentSchemeModel, {
          as: 'invoiceConcepts_studentPaymentScheme',
          foreignKey: 'icoId'
        })
        invoiceConceptsModel.hasMany(models.conceptosAdicionalesModel, {
          as: 'invoiceConcepts_conceptosAdicionales',
          foreignKey: 'icoId'
        })
      }
    return invoiceConceptsModel
}