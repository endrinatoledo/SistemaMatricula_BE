module.exports = (sequelize, DataTypes) => {

    //npx sequelize-cli model:generate --name User --attributes pcsName:string,pcsLastName:string,pcsEmail:string,pcsPassword:string,pcsStatus:integer,rolId:bigint
    
        const paymentsConceptsStudentsModel = sequelize.define("paymentsConceptsStudentsModel", {
            pcsId : {
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                field: 'pcs_id'    
            },
            spsId:{
                type: DataTypes.BIGINT,
                allowNull: false,
                field: 'sps_id' 
            },
            famId:{
                type: DataTypes.BIGINT,
                allowNull: false,
                field: 'fam_id' 
            }
        }, {
            tableName: 'payments_concepts_students',
            timestamps: false
          }) 
    
          paymentsConceptsStudentsModel.associate = function (models) {
            paymentsConceptsStudentsModel.belongsTo(models.familyModel, {
              as: 'families',
              foreignKey: 'famId'
            })
            paymentsConceptsStudentsModel.belongsTo(models.studentPaymentSchemeModel, {
                as: 'studentPaymentSchemes',
                foreignKey: 'spsId'
              })
          }
    
        return paymentsConceptsStudentsModel
    }