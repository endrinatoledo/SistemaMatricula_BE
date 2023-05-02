module.exports = (sequelize, DataTypes) => {

    const invoiceHeaderModel = sequelize.define("invoiceHeaderModel", {
        inhId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'inh_id'
        },
        famId:{
            type: DataTypes.BIGINT,
            allowNull: false,
            field: 'fam_id'
        },
        perId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            field: 'per_id'
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
        },
        inhDateCreate: {
            type: DataTypes.DATEONLY,
            allowNull: true,
            field: 'inh_date_create'
        },
        inhStatusFact: {
            type: DataTypes.STRING(250),
            allowNull: true,
            field: 'inh_status_fact'
        },
    }, {
        tableName: 'invoice_header',
        timestamps: false
    })

    invoiceHeaderModel.associate = function (models) {
        invoiceHeaderModel.belongsTo(models.familyModel, {
            as: 'familyInvoice',
            foreignKey: 'famId'
        })
        invoiceHeaderModel.belongsTo(models.periodsModel, {
            as: 'perInvoice',
            foreignKey: 'perId'
        })
        invoiceHeaderModel.hasMany(models.invoiceDetailModel, {
            as: 'inh_ind',
            foreignKey: 'inhId'
        })
        invoiceHeaderModel.hasMany(models.paymentDetailModel, {
            as: 'inh_inv',
            foreignKey: 'inhId'
        })
    }

    return invoiceHeaderModel
}