const cors = require('cors')
const express = require('express')

const app = express()


app.use(express.json())
app.use(express.Router())
app.use(cors())
app.use(express.Router())
app.use(express.urlencoded({extended:true})) 

//Routes
const routerUser = require('./routes/userRoutes.js')
const routerAccess = require('./routes/accessRoutes.js')
const routerRol = require('./routes/rolRoutes.js')
const routerFamily = require('./routes/familyRoutes')

app.use('/api/users',routerUser)
app.use('/api/access',routerAccess) 
app.use('/api/roles',routerRol) 
app.use('/api/families',routerFamily) 
 
//testing api

app.get('/', (req,res)=>{
    res.json({message:'Hello from api'})
})

//port
const PORT = process.env.PORT || 8080

//server
const server = app.listen(PORT, () =>{
    console.log(`server is runningg port ${PORT}`)
})

module.exports = {app, server};