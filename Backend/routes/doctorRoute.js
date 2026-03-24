import express from'express'
import { doctorsList } from '../controllers/doctorController.js'
// first i creata a instance of 
const doctorRouter=express.Router()
doctorRouter.get('/list',doctorsList)



export {doctorRouter } 