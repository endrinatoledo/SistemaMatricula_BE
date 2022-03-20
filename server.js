const express = require('express')
const cors = require('cors')

const app = express()

var corOptions = {
    origin : 'https://localhost:8081'
}
 

//Middleware
app.use(cors(corOptions))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//Routes
const routerUser = require('./routes/userRoutes.js')

app.use('/api/users',routerUser)
 
//testing api

app.get('/', (req,res)=>{
    res.json({message:'Hello from api'})
})

//port
const PORT = process.env.PORT || 8080

//server
app.listen(PORT, () =>{
    console.log(`server is runningg port ${PORT}`)
})