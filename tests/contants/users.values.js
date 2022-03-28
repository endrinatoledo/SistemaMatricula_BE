const dataSet = {
    
    startUserList:[{
        "usuId":1,
        "usuName" : "star user 1",
        "usuLastName" : "star user 1",
        "usuEmail" : "staruser1@gmail.com",
        "usuPassword" : "1234",
        "usuStatus" : 1
    },{
        "usuId":2,
        "usuName" : "star user 2",
        "usuLastName" : "star user 2",
        "usuEmail" : "staruser2@gmail.com",
        "usuPassword" : "1234",
        "usuStatus" : 1
    }],
    getUserById:{
        success:{
            "usuId" : 1
        },
        fail : {
            "usuId" : "Anything"
        }
    },
    createUser:{
        success:{
            "usuName" : "test user name",
            "usuLastName" : "test user last name",
            "usuEmail" : "testuser22221113@hotmail.com",
            "usuPassword" : "1234",
            "usuStatus" : 1,
            "message" : "Usuario creado con éxito",
            "ok" : true
        },
        fail : {
            "usuName" : "test user",
            "usuLastName" : "test user",
            "usuEmail" : "testuser@gmail.com",
            "usuPassword" : "1234",
            "usuStatus" : "Anything"
        }
    },
    updateUser:{
        success:{
            "usuName" : "updated test user",
            "usuLastName" : "updated test user",
            "usuEmail" : "updatedtestuser@gmail.com",
            "usuPassword" : "1234",
            "usuStatus" : 1
        },
        fail : {
            "usuName" : "updated test user",
            "usuLastName" : "updated test user",
            "usuEmail" : "updatedtestuser@gmail.com",
            "usuPassword" : "1234",
            "usuStatus" : "Anything"
        }
    },
    deleteUser:{
        success:{
            "usuId" : 2
        },
        fail : {
            "usuId" : "Anything"
        }
    },
    errorEmailExists:{
        "ok" : false,
        "message": "Email ya se encuentra registrado"
    }
}
module.exports = dataSet