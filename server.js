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
const periodRoutes = require('./routes/periodRoutes')
const federalEntityRoutes = require('./routes/federalEntityRoutes')
const schoolDataRoutes = require('./routes/schoolDataRoutes')
const exchangeRateRoutes = require('./routes/exchangeRateRoutes')
const studentRoutes = require('./routes/studentRoutes')
const representativeRoutes = require('./routes/representativeRoutes')
const invoiceConceptRoutes = require('./routes/invoiceConceptRoutes')
const representativeStudentRoutes = require('./routes/representativeStudentRoutes')
const periodLevelSectionRoutes = require('./routes/periodLevelSectionRoutes')
const inscriptionRoutes = require('./routes/inscriptionRoutes')
const paymentSchemaRoutes = require('./routes/paymentSchemaRoutes')
const paymentSchemeConceptsRoutes = require('./routes/paymentSchemeConceptsRoutes')
const studentPaymentSchemeRoutes = require('./routes/studentPaymentSchemeRoutes')
const paymentsRoutes = require('./routes/paymentsRoutes')
const paymentsConceptsStudentsRoutes = require('./routes/paymentsConceptsStudentsRoutes')
const reportsRoutes = require('./routes/reportsRoutes')
const bankRoutes = require('./routes/bankRoutes')

app.use('/api/users',routerUser)
app.use('/api/access',routerAccess) 
app.use('/api/roles',routerRol) 
app.use('/api/families',routerFamily) 
app.use('/api/levels',routerLevel) 
app.use('/api/sections',routerSection) 
app.use('/api/countries',routerCountry) 
app.use('/api/paymentmethod',routerPaymentMethod)
app.use('/api/professions',professionRoutes)
app.use('/api/periods',periodRoutes)
app.use('/api/federalEntities',federalEntityRoutes)
app.use('/api/schoolData',schoolDataRoutes)
app.use('/api/exchangeRate',exchangeRateRoutes)
app.use('/api/students',studentRoutes)
app.use('/api/representatives',representativeRoutes)
app.use('/api/invoiceConcepts',invoiceConceptRoutes)
app.use('/api/representativeStudent',representativeStudentRoutes)
app.use('/api/periodLevelSection',periodLevelSectionRoutes)
app.use('/api/inscriptions',inscriptionRoutes)
app.use('/api/paymentSchema',paymentSchemaRoutes)
app.use('/api/paymentSchemeConcepts',paymentSchemeConceptsRoutes)
app.use('/api/studentPaymentScheme',studentPaymentSchemeRoutes)
app.use('/api/payments',paymentsRoutes)
app.use('/api/paymentsConceptsStudents',paymentsConceptsStudentsRoutes)
app.use('/api/reports',reportsRoutes)
app.use('/api/banks',bankRoutes)



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