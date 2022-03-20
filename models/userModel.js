// const { DataTypes } = require("sequelize/types");
// const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define("user", {
        usuId : {
            autoIncrement: true,
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            field: 'usu_id'    
        },
        usuName:{
            type: DataTypes.STRING(45),
            allowNull: false,
            field: 'usu_name' 
        },usuLastName:{
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
        }

    })

    return User
}