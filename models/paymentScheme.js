
module.exports = (sequelize, DataTypes) => {    
    
    // esquema de pagos
        const paymentScheme = sequelize.define("paymentScheme", {
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
    
          paymentScheme.associate = function (models) {
    
            // paymentScheme.hasMany(models.usersModel, {
            //   as: 'psc_user',
            //   foreignKey: 'rolId'
            // })
          }
        return paymentScheme
    }