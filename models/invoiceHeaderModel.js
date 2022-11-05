module.exports = (sequelize, DataTypes) => {

    const invoiceHeaderModel = sequelize.define("invoiceHeaderModel", {
        inhId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'inh_id'
        },
        repId:{
            type: DataTypes.BIGINT,
            allowNull: false,
            field: 'rep_id'
        },
        inhBusinessName: {
            type: DataTypes.STRING(250),
            allowNull: false,
            field: 'inh_business_name'
        },
        inhRifCed: {
            type: DataTypes.STRING(250),
            allowNull: false,
            field: 'inh_rif_ced'
        },
        inhAddress: {
            type: DataTypes.STRING(250),
            allowNull: false,
            field: 'inh_address'
        },
        inhPhone: {
            type: DataTypes.STRING(250),
            allowNull: false,
            field: 'inh_phone'
        },
        inhDate: {
            type: DataTypes.STRING(20),
            allowNull: false,
            field: 'inh_date'
        },
        inhControlNumber: {
            type: DataTypes.STRING(250),
            allowNull: true,
            field: 'inh_control_number'
        },
        inhInvoiceNumber: {
            type: DataTypes.STRING(250),
            allowNull: true,
            field: 'inh_invoice_number'
        },
        inhWayToPay:{
            type: DataTypes.STRING(250),
            allowNull: true,
            field: 'inh_way_to_pay'
        }
    }, {
        tableName: 'invoice_header',
        timestamps: false
    })

    invoiceHeaderModel.associate = function (models) {
        invoiceHeaderModel.belongsTo(models.representativeModel, {
            as: 'representativeInvoice',
            foreignKey: 'repId'
        })
    }

    return invoiceHeaderModel
}