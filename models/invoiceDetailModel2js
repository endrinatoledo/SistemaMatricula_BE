module.exports = (sequelize, DataTypes) => {

    const invoiceDetailModel = sequelize.define("invoiceDetailModel", {
        indId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'ind_id'
        },
        mopId:{
            type: DataTypes.BIGINT,
            allowNull: true,
            field: 'mop_id'
        },
        indStuName:{
            type: DataTypes.STRING(250),
            allowNull: true,
            field: 'ind_stu_name'
        },
        indDescripcion: {
            type: DataTypes.STRING(250),
            allowNull: true,
            field: 'ind_descripcion'
        },
        indcosto: {
            type: DataTypes.STRING(250),
            allowNull: true,
            field: 'ind_costo'
        },
        indpagado: {
            type: DataTypes.STRING(250),
            allowNull: true,
            field: 'ind_pagado'
        },
        indtasa: {
            type: DataTypes.STRING(100),
            allowNull: true,
            field: 'ind_tasa'
        },
        excId: { //id de los datos de la tasa
            type: DataTypes.BIGINT,
            allowNull: true,
            field: 'exc_tasa'
        },
        inhId:{ //id de cabecera de factura
            type: DataTypes.BIGINT,
            allowNull: false,
            field: 'inh_id'
        }
    }, {
        tableName: 'invoice_detail',
        timestamps: false
    })

    invoiceDetailModel.associate = function (models) {
        invoiceDetailModel.belongsTo(models.monthlyPaymentModel, {
            as: 'monthlyPayment',
            foreignKey: 'mopId'
        })
        invoiceDetailModel.belongsTo(models.invoiceHeaderModel, {
            as: 'invoiceHeade',
            foreignKey: 'inhId'
        })
        invoiceDetailModel.belongsTo(models.exchangeRatesModel, {
            as: 'invoiceExchange',
            foreignKey: 'excId'
        })
    }

    return invoiceDetailModel
}