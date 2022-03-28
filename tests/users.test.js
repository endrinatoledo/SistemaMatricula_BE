require('iconv-lite').encodingExists('foo')
require('mysql2/node_modules/iconv-lite').encodingExists('foo');
const supertest = require("supertest");
const {app, server} = require("../server")
const dataSet = require('./contants/users.values')
const UserModel = require('../models/userModel')
const api = supertest(app)

const idUser = 1

describe("Pruebas de rutas de Usuarios", ()=>{

    test.skip('get all users', async () =>{
        const response = await (api).get('/api/users/')
        .then(response =>{
            expect(response.statusCode).toBe(200);
            expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
        })
    })
    test.skip('get user by id', async () =>{
        const response = await (api).get(`/api/users/${idUser}`)
        .then(response =>{
            expect(response.statusCode).toBe(200);
            expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
        })
    })

    test('delete user', async () =>{
        return api
        .delete(`/api/users/${dataSet.startUserList[0].usuId}`)
        .then(response => {
            if(response.body.ok === dataSet.deleteUser.fail.ok){
                expect(response.body.message).toBe(dataSet.deleteUser.fail.message);
            }else{
                expect(response.body.message).toBe(dataSet.deleteUser.success.message);
             }
            
        })
    })

    test.skip('Create user', async () =>{
        try {
            return api
        .post(`/api/users/`)
        .send({ ...dataSet.createUser.success})
        .then(response => {
            expect(response.statusCode).toBe(200);
                if(response.body.ok === false){
                    expect(response.body.ok).toBe(dataSet.errorEmailExists.ok)
                    expect(response.body.message).toBe(dataSet.errorEmailExists.message)
                }else{
                    expect(response.body.data.usuEmail).toBe(dataSet.createUser.success.usuEmail)
                    expect(response.body.data.usuLastName).toBe(dataSet.createUser.success.usuLastName)
                    expect(response.body.data.usuName).toBe(dataSet.createUser.success.usuName)
                    expect(response.body.data.usuPassword).toBe(dataSet.createUser.success.usuPassword)
                    expect(response.body.data.usuStatus).toBe(dataSet.createUser.success.usuStatus)
                }
        })
        }catch (error) {
            expect(error).toMatch('error')
            // expect(response.statusCode).toBe(500);
          }
        
    })
})

afterAll(()=>{
    server.close()
})