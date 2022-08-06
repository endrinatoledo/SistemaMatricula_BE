module.exports = (sequelize, DataTypes) => {

    //npx sequelize-cli model:generate --name User --attributes usuName:string,usuLastName:string,usuEmail:string,usuPassword:string,usuStatus:integer,rolId:bigint
    
        const paymentSchemeConceptsModel = sequelize.define("paymentSchemeConceptsModel", {
            pcoId : {
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                field: 'pco_id'    
            },
            // pscId:{
            //     type: DataTypes.BIGINT,
            //     allowNull: false,
            //     field: 'psc_id' 
            // },
            // plsId:{
            //     type: DataTypes.BIGINT,
            //     allowNull: false,
            //     field: 'pls_id' 
            // },
            icoId:{
                type: DataTypes.BIGINT,
                allowNull: false,
                field: 'ico_id' 
            },
            pcoAmountDol:{
                type: DataTypes.FLOAT,
                allowNull: false,
                field: 'pco_amount_dol' 
            },
            pcoAmountBol:{
                type: DataTypes.FLOAT,
                allowNull: false,
                field: 'pco_amount_bol' 
            },
            insId:{
                type: DataTypes.BIGINT,
                allowNull: false,
                field: 'ins_id' 
            },        
        }, {
            tableName: 'payment_scheme_concepts',
            timestamps: false
          })  
    
          paymentSchemeConceptsModel.associate = function (models) {
            // paymentSchemeConceptsModel.belongsTo(models.paymentSchemeModel, {
            //   as: 'paymentSchemes',
            //   foreignKey: 'pscId'
            // })
            // paymentSchemeConceptsModel.belongsTo(models.periodLevelSectionModel, {
            //     as: 'periodLevelSection',
            //     foreignKey: 'plsId'
            // })

            paymentSchemeConceptsModel.belongsTo(models.invoiceConceptsModel, {
                as: 'invoiceConcepts',
                foreignKey: 'icoId'
            })
            // paymentSchemeConceptsModel.hasMany(models.studentPaymentSchemeModel, {
            //     as: 'paymentSchemeConcepts_paymentScheme',
            //     foreignKey: 'pcoId'
            // })
            // paymentSchemeConceptsModel.belongsTo(models.inscriptionsModel, {
            //     as: 'inscriptions',
            //     foreignKey: 'insId'
            // })

            paymentSchemeConceptsModel.belongsTo(models.inscriptionsModel, {
                as: 'inscriptions',
                foreignKey: 'insId'
            })
          }
    
        return paymentSchemeConceptsModel
    }