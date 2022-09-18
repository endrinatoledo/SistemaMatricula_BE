module.exports = (sequelize, DataTypes) => {

    const studentModel = sequelize.define("studentModel", {
        stuId : {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'stu_id'    
        },
        stuFirstName:{
            type: DataTypes.STRING(45),
            allowNull: false,
            field: 'stu_first_name' 
        },
        stuSecondName:{
            type: DataTypes.STRING(45),
            allowNull: true,
            field: 'stu_second_name' 
        },
        stuSurname:{
            type: DataTypes.STRING(45),
            allowNull: false,
            field: 'stu_surname' 
        },
        stuSecondSurname:{
            type: DataTypes.STRING(45),
            allowNull: true,
            field: 'stu_second_surname' 
        },
        stuIdType:{
            type: DataTypes.STRING(1),
            allowNull: true,
            field: 'stu_id_type'
        },
        stuIdentificationNumber:{
            type: DataTypes.STRING(45),
            allowNull: true,
            field: 'stu_identification_number' 
        },
        stuDateOfBirth:{
            type: DataTypes.DATEONLY,
            allowNull: false,
            field: 'stu_date_of_birth' 
        },
        stuSex:{
            type: DataTypes.STRING(1),
            allowNull: false,
            field: 'stu_sex' 
        },
        couId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            field: 'cou_id'
        },
        fedId: {
            type: DataTypes.BIGINT,
            allowNull: false, 
            field: 'fed_id'
        },
        stuPhoto:{
            type: DataTypes.STRING(200),
            allowNull: true,
            field: 'stu_photo' 
        },        
        stuStatus:{
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'stu_status' 
        }
        // ,
        // famId: {
        //     type: DataTypes.BIGINT,
        //     allowNull: false, 
        //     field: 'fam_id'
        // }
    }, {
        tableName: 'students',
        timestamps: false
      }) 
    //   studentModel.belongsTo(models.familyModel, {
    //     as: 'families',
    //     foreignKey: 'famId'
    //   })  
      studentModel.associate = function (models) {
        studentModel.belongsTo(models.countriesModel, {
          as: 'countries',
          foreignKey: 'couId'
        })
        studentModel.belongsTo(models.federalEntityModel, {
          as: 'federalEntity',
          foreignKey: 'fedId'
        })
          studentModel.hasMany(models.representativeStudentModel, {
            as: 'repStudents',
            foreignKey: 'stuId'
          })  
          studentModel.hasMany(models.inscriptionsModel, {
            as: 'inscription',
            foreignKey: 'stuId'
          })  
          studentModel.hasMany(models.monthlyPaymentModel, {
            as: 'stu_monthly',
            foreignKey: 'stuId'
          })
      }

    return studentModel
}


// ALTER TABLE matriculaoficial2.students MODIFY COLUMN stu_id_type varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL;
// ALTER TABLE matriculaoficial2.students MODIFY COLUMN stu_identification_number varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL;
