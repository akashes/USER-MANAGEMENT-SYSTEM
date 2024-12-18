import dotenv from 'dotenv'
dotenv.config()
import { connectDB } from './db/db.js'
connectDB()
import express from 'express'
import { userRoute } from './routes/user.route.js'
import adminRoute from './routes/admin.route.js'
import colors from 'colors'

import session from 'express-session'
import { sessionSecret } from './config/config.js'

import ejs from 'ejs'
const app = express()
const PORT = process.env.PORT

//middlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(session({
    secret:sessionSecret,
    resave:false,
    saveUninitialized:true
}))
app.use('/',express.static('uploads/userImages'))


app.set('view engine','ejs')
app.set('views','./views') 
  
 
 
//routes
app.get('/',(req,res)=>{
    res.send('ums project')
})   
     
app.use('/api/v1/user',userRoute)
app.use('/api/v1/admin',adminRoute)
    
 
   
   
   

app.listen(PORT, () => {
    console.log('-----------------------------');
    console.log('-----------------------------');
    console.log(`server running on port `.bgBrightBlue+process.env.PORT.bgBrightBlue );});