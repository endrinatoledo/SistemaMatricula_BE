module.exports = (sequelize, DataTypes) => {

    const invoiceDetailModel = sequelize.define("invoiceDetailModel", {
        indId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'ind_id'
        },
        modId:{
            type: DataTypes.BIGINT,
            allowNull: true,
            field: 'mod_id'
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
    }

    return invoiceDetailModel
}