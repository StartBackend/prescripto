import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from '../Backend/config/mongodb.js'
import connectCloudinary from '../Backend/config/cloudinary.js'
 import adminRouter from '../Backend/routes/adminRoute.js'
// import formidable from 'express-formidable'
import { doctorRouter  } from './routes/doctorRoute.js'
// import { userRouter } from '../routes/userRoute.js'
import { userRouter } from './routes/userRoute.js'
const app=express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors()) 

const port=process.env.PORT||8080
connectDB()
connectCloudinary()

// middlewares 



// // api end points
 app.use('/api/admin',adminRouter)
// //localhost:8080/api/admin/add-doctor

 app.use('/api/doctor',doctorRouter)
// //end point user 
app.use('/api/user',userRouter)
app.get('/',(req,res)=>{
    res.send('api is working')

})
app.listen(port,()=>{
    console.log(`sever is runing {http://localhost:${port}}`);
})