import express from "express";
import { addDoctor, allDoctors, loginAdmin } from "../controllers/adminController.js";
import upload from "../middlewares/multer.js"; 
import authAdmin from"../middlewares/authAdmin.js"
import { changeAvailability } from "../controllers/doctorController.js";
// router instance 
const adminRouter=express.Router()


// image is the field name 

adminRouter.post('/add-doctor',authAdmin,upload.single('image'),addDoctor)

adminRouter.post('/login',loginAdmin)
adminRouter.get('/all-doctors',authAdmin,allDoctors)
adminRouter.post('/change-availability',authAdmin,changeAvailability)
export default adminRouter;










