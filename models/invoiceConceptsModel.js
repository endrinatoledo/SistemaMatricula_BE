
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

        // invoiceConceptsModel.hasMany(models.usersModel, {
        //   as: 'ico_user',
        //   foreignKey: 'icoId'
        // })
      }
    return invoiceConceptsModel
}