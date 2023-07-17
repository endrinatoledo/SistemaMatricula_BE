module.exports = (sequelize, DataTypes) => {

    const conceptosAdicionalesModel = sequelize.define("conceptosAdicionales", {
        cadId : {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'cad_id'
        },
        icoId:{
            type: DataTypes.BIGINT,
            allowNull: false,
            field: 'ico_id'
        },
        icoName: {
            type: DataTypes.STRING(100),
            allowNull: true,
            field: 'ico_name'
        },
        cadDescription:{
            type: DataTypes.STRING(255),
            allowNull: true,
            field: 'cad_description'
        },
        inhId: { //id de cabecera de factura
            type: DataTypes.BIGINT,
            allowNull: false,
            field: 'inh_id'
        },
        famId: {
            type: DataTypes.BIGINT,
            allowNull: true,
            field: 'fam_id'
        },
        famName: {
            type: DataTypes.STRING(100),
            allowNull: true,
            field: 'fam_name'
        },
        cadCreationDate: {
            type: DataTypes.DATE,
            allowNull: false,
            field: 'cad_creation_date'
        },
        cadUpdateDate: {
            type: DataTypes.DATE,
            allowNull: false,
            field: 'cad_update_date'
        },
        cadCostoDolares: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: 'cad_costo_dolares'
        },
        cadCostoBolivares: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: 'cad_costo_bolivares'
        },
        cadMontoPagadoDolares: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: 'cad_monto_pagado_dolares'
        },
        cadMontoPagadoBolivares: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: 'cad_monto_pagado_bolivares'
        },
        stuId: {
            type: DataTypes.BIGINT,
            allowNull: true,
            field: 'stu_id'
        },
        cadNameStudent: {
            type: DataTypes.STRING(255),
            allowNull: true,
            field: 'cad_name_student'
        },
        perId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            field: 'per_id'
        },
        cadStatus: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            field: 'cad_status'
        },
        cadtasa: {
            type: DataTypes.STRING(100),
            allowNull: true,
            field: 'cad_tasa'
        },
        excId: { //id de los datos de la tasa
            type: DataTypes.BIGINT,
            allowNull: true,
            field: 'exc_tasa'
        },
    })

    conceptosAdicionalesModel.associate = function (models) {
        conceptosAdicionalesModel.belongsTo(models.invoiceConceptsModel, {
            as: 'conceptosAdicionalesInvoiceConcepts',
            foreignKey: 'icoId'
        })
        conceptosAdicionalesModel.belongsTo(models.invoiceHeaderModel, {
            as: 'conceptosAdicionalesInvoiceHeader',
            foreignKey: 'inhId'
        })
        conceptosAdicionalesModel.belongsTo(models.familyModel, {
            as: 'conceptosAdicionalesFamily',
            foreignKey: 'famId'
        })
        conceptosAdicionalesModel.belongsTo(models.studentModel, {
            as: 'conceptosAdicionalesStudent',
            foreignKey: 'stuId'
        })
        conceptosAdicionalesModel.belongsTo(models.periodsModel, {
            as: 'conceptosAdicionalesPeriods',
            foreignKey: 'perId'
        }, {
            tableName: 'additional_concepts',
            timestamps: true
        })

    }

    return conceptosAdicionalesModel
}