
module.exports = (sequelize, DataTypes) => {    
    
    // esquema de pagos
        const paymentSchemeModel = sequelize.define("paymentSchemeModel", {
            pscId: {
              type: DataTypes.BIGINT,
              allowNull: false,
              primaryKey: true,
              autoIncrement: true,
              field: 'psc_id'
            },   
            pscName: {
              type: DataTypes.STRING(100),
              allowNull: false,
              field: 'psc_name'
            },   
            pscDescription: {
              type: DataTypes.STRING(200),
              allowNull: true,
              field: 'psc_descripcion'
            },
            pscStatus: {
              type: DataTypes.INTEGER(11),
              allowNull: false,
              field: 'psc_status'
            }
    
        }, {
            tableName: 'payment_scheme',
            timestamps: false
          })
    
          paymentSchemeModel.associate = function (models) {
    
            // paymentSchemeModel.hasMany(models.usersModel, {
            //   as: 'psc_user',
            //   foreignKey: 'rolId'
            // })
          }
        return paymentSchemeModel
    }