
module.exports = (sequelize, DataTypes) => {

    const costoMesualidadesModel = sequelize.define("costoMesualidadesModel", {
        cmeId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'cme_id'
        },
        cmeAmount: {
            type: DataTypes.FLOAT,
            allowNull: false,
            field: 'cme_amount'
        },
        cmeDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            field: 'cme_date'
        }
    }, {
        tableName: 'costo_mensualidades',
        timestamps: false
    })

    costoMesualidadesModel.associate = function (models) {

        // costoMesualidadesModel.hasMany(models.paymentDetailModel, {
        //     as: 'ban_pay',
        //     foreignKey: 'banId'
        // })
    }
    return costoMesualidadesModel
}