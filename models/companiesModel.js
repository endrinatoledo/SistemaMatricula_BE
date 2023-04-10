
module.exports = (sequelize, DataTypes) => {

    //npx sequelize-cli model:generate --name Rol --attributes rolName:string,rolStatus:integer


    const companiesModel = sequelize.define("companiesModel", {
        comId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'com_id'
        },
        comRif: {
            type: DataTypes.STRING(250),
            allowNull: false,
            field: 'com_rif'
        },
        comDirection: {
            type: DataTypes.STRING(250),
            allowNull: true,
            field: 'com_direction'
        },
        comName: {
            type: DataTypes.STRING(250),
            allowNull: false,
            field: 'com_name'
        },
        comPhone: {
            type: DataTypes.STRING(250),
            allowNull: true,
            field: 'com_phone'
        },
        comEmail: {
            type: DataTypes.STRING(250),
            allowNull: true,
            field: 'com_email'
        },
        comStatus: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            field: 'com_status'
        }

    }, {
        tableName: 'companies',
        timestamps: false
    })

    companiesModel.associate = function (models) {

        // banksModel.hasMany(models.paymentDetailModel, {
        //     as: 'ban_pay',
        //     foreignKey: 'banId'
        // })
    }
    return companiesModel
}