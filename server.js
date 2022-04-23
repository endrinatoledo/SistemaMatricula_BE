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
const routerLevel = require('./routes/levelRoutes')
const routerSection = require('./routes/sectionRoutes')
const routerCountry = require('./routes/countryRoutes')
const routerPaymentMethod = require('./routes/paymentMethodsRoutes')
const professionRoutes = require('./routes/professionRoutes')

app.use('/api/users',routerUser)
app.use('/api/access',routerAccess) 
app.use('/api/roles',routerRol) 
app.use('/api/families',routerFamily) 
app.use('/api/levels',routerLevel) 
app.use('/api/sections',routerSection) 
app.use('/api/countries',routerCountry) 
app.use('/api/paymentmethod',routerPaymentMethod)
app.use('/api/professions',professionRoutes)
 
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