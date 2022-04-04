module.exports = (sequelize, DataTypes) => {

    const usersModel = sequelize.define("usersModel", {
        usuId : {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'usu_id'    
        },
        usuName:{
            type: DataTypes.STRING(45),
            allowNull: false,
            field: 'usu_name' 
        },
        usuLastName:{
            type: DataTypes.STRING(45),
            allowNull: false,
            field: 'usu_lastname' 
        },
        usuEmail:{
            type: DataTypes.STRING(45),
            allowNull: false,
            field: 'usu_email' 
        },
        usuPassword:{
            type: DataTypes.STRING(225),
            allowNull: false,
            field: 'usu_password' 
        },        
        usuStatus:{
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'usu_status' 
        },
        rolId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            field: 'rol_id'
          }
    }, {
        tableName: 'users',
        timestamps: false
      }) 

      usersModel.associate = function (models) {
        usersModel.belongsTo(models.rolesModel, {
          as: 'roles',
          foreignKey: 'rolId'
        })
      }

    return usersModel
}