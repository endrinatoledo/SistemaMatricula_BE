module.exports = (sequelize, DataTypes) => {

    const representativeStudentModel = sequelize.define("representativeStudentModel", {
        rstId : {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'rst_id'    
        },
        repId:{
            type: DataTypes.BIGINT,
            allowNull: false,
            field: 'rep_id'
        },
        stuId:{
            type: DataTypes.BIGINT,
            allowNull: false,
            field: 'stu_id'
        },
        famId: {
          type: DataTypes.BIGINT,
          allowNull: false, 
          field: 'fam_id'
        }
      
    }, {
        tableName: 'representative_student',
        timestamps: false
      }) 

      representativeStudentModel.associate = function (models) {
        representativeStudentModel.belongsTo(models.representativeModel, {
          as: 'representative',
          foreignKey: 'repId'
        })
        representativeStudentModel.belongsTo(models.studentModel, {
          as: 'student',
          foreignKey: 'stuId'
        })
        representativeStudentModel.belongsTo(models.familyModel, {
          as: 'families',
          foreignKey: 'famId'
        }) 
        representativeStudentModel.hasMany(models.inscriptionsModel, {
          as: 'inscriptionR',
          foreignKey: 'insId'
        }) 
 

      }

    return representativeStudentModel
}