
module.exports = (sequelize, DataTypes) => {

    //npx sequelize-cli model:generate --name Rol --attributes rolName:string,rolStatus:integer
    
    
        const banksModel = sequelize.define("banksModel", {
            banId: {
              type: DataTypes.BIGINT,
              allowNull: false,
              primaryKey: true,
              autoIncrement: true,
              field: 'ban_id'
            },   
            banName: {
              type: DataTypes.STRING(100),
              allowNull: false,
              field: 'ban_name'
            },
            banStatus: {
              type: DataTypes.INTEGER(11),
              allowNull: false,
              field: 'ban_status'
            }
    
        }, {
            tableName: 'banks',
            timestamps: false
          })
    
          banksModel.associate = function (models) {
    
            banksModel.hasMany(models.paymentDetailModel, {
              as: 'ban_pay',
              foreignKey: 'banId'
            })
          }
        return banksModel
    }