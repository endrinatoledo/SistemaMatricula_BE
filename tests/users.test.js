const supertest = require("supertest");
// const { response } = require("../server");
const {app, server} = require("../server")
const api = supertest(app)


describe("Pruebas de rutas de Usuarios", ()=>{

    test('get all users', async () =>{
        const response = await (api).get('/api/users/')
        .then(response =>{
            expect(response.statusCode).toBe(200);
            expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
        })
    })
})

afterAll(()=>{
    server.close()
})