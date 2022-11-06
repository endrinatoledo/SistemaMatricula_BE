module.exports = (sequelize, DataTypes) => {

    const paymentDetailModel = sequelize.define("paymentDetailModel", {
        depId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'dep_id'
        },
        depCurrency: { //moneda
            type: DataTypes.STRING(50),
            allowNull: false,
            field: 'dep_currency'
        },
        payId: { //metodo de pago
            type: DataTypes.BIGINT,
            allowNull: false,
            field: 'pay_id'
        },
        banId: {
            type: DataTypes.BIGINT,
            allowNull: true,
            field: 'ban_id'
        },
        inhId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            field: 'inh_id'
        },
        depAmount: { //monto
            type: DataTypes.FLOAT,
            allowNull: false,
            field: 'dep_amount'
        },
        depCardNumber: { //numero de tarjeta
            type: DataTypes.STRING(250),
            allowNull: true,
            field: 'dep_card_number'
        },
        depApprovalNumber: { //numero de referencia
            type: DataTypes.STRING(250),
            allowNull: true,
            field: 'dep_approval_number'
        },
        depObservation: {
            type: DataTypes.STRING(250),
            allowNull: true,
            field: 'dep_observation'
        }

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