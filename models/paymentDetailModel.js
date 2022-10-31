module.exports = (sequelize, DataTypes) => {

    const paymentDetailModel = sequelize.define("paymentDetailModel", {
        depId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'dep_id'
        },
        mopId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            field: 'mod_id'
        },
        payId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            field: 'pay_id'
        },
        banId: {
            type: DataTypes.BIGINT,
            allowNull: true,
            field: 'ban_id'
        },
        // repId: {
        //     type: DataTypes.BIGINT,
        //     allowNull: false,
        //     field: 'rep_id'
        // },
        depAmount: {
            type: DataTypes.FLOAT,
            allowNull: false,
            field: 'dep_amount'
        },
        depCardNumber: {
            type: DataTypes.STRING(250),
            allowNull: true,
            field: 'mop_card_number'
        },
        depApprovalNumber: {
            type: DataTypes.STRING(250),
            allowNull: true,
            field: 'mop_approval_number'
        },
        // depDate: {
        //     type: DataTypes.DATEONLY,
        //     allowNull: false,
        //     field: 'dep_date'
        // },
        depObservation: {
            type: DataTypes.STRING(250),
            allowNull: true,
            field: 'dep_observation'
        },
        // depInvoiceDescription:{
        //     type: DataTypes.STRING(250),
        //     allowNull: true,
        //     field: 'dep_invoice_description'
        // },
        // depStatus:{
        //     type: DataTypes.INTEGER,
        //     allowNull: false,
        //     field: 'dep_status'
        // }

    }, {
        tableName: 'payment_detail',
        timestamps: false
    })

    paymentDetailModel.associate = function (models) {
        paymentDetailModel.belongsTo(models.banksModel, {
            as: 'banksPay',
            foreignKey: 'banId'
        })
        paymentDetailModel.belongsTo(models.monthlyPaymentModel, {
            as: 'monthlyPaymentPay',
            foreignKey: 'mopId'
        })
        paymentDetailModel.belongsTo(models.paymentMethodsModel, {
            as: 'paymentMethodsPay',
            foreignKey: 'payId'
        })
        // paymentDetailModel.belongsTo(models.representativeModel, {
        //     as: 'representativePay',
        //     foreignKey: 'repId'
        // })
    }

    return paymentDetailModel
}