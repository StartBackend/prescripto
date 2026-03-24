//api for adding doctor 

import Doctor from '../models/doctorModel.js'
import validator from 'validator'
import bcrypt from 'bcrypt'
import {v2 as clodinary} from "cloudinary"

import  jwt  from 'jsonwebtoken'
import doctorModel from '../models/doctorModel.js'
//add doctor 

const addDoctor=async(req,res)=>{
    try {
        console.log(req.body)
        
        const{name,email,password,speciality,degree,experience,about,fees,address}=req.body
        const imagefile=req.file 

        //checking for all data to add doctor any is missing this if block will execute        
        if(!name || !email || !password || !speciality || !degree || !experience || !about  || !address ){
            return res.json({success:false,message:'all fields are required'})
        }
          const existingDoctor = await doctorModel.findOne({ email })
        if (existingDoctor) {
            return res.json({ success: false, message: 'Doctor with this email already exists' })
        }


        // validating email format
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"please enter a valid email"})
        }
        // validating password 
        if (password.length<8){
            return res.json({sucess:false,message:"please enter a  a strong password"})
        }
        // hashing doctor password 
        const salt= await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt)
        // upload image to clodinary 
        const imageUpload= await clodinary.uploader.upload(imagefile.path,{resource_type:"auto"})
        

        const imageUrl=imageUpload.secure_url
        const doctorData={
            name,
            email,
            image:imageUrl,
            password:hashedPassword,
            speciality,
            degree,
            experience: parseInt(experience), // "4 years" → 4

            about,
            fees,
            address:JSON.parse(address)
,
            date:Date.now()
        }
        const newDoctor=new Doctor(doctorData)
        await newDoctor.save()
        res.json({success:true,message:"Doctor Added"})
    } catch (error) {
        console.log(error)
        res.json({sucess:false,message:error.message})
        
    }
}
//api for admin login
const loginAdmin=async(req,res)=>{
    try {
        const {email,password}=req.body
        if(email=== process.env.ADMIN_EMAIL && password=== process.env.ADMIN_PASSWORD){
            const atoken =jwt.sign({email},process.env.JWT_SECRET)
            res.json({ success: true, token: atoken })
        }else{
        res.json({sucess:false,message:'Invalid Credential'})
        }
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})        
    }
}
// api to get all doctors for admin panel
const allDoctors=async(req,res)=>{
    try {
        // exclude password property 
        const doctors= await doctorModel.find({}).select('-password')
        res.json({success:true,doctors})
        
    } catch (error) {
         console.log(error)
        res.json({success:false,message:error.message})       
        
    }


}
const changeAvailability=async(req,res)=>{
    try {
        const {docId}=req.body
        const docData=await Doctor.findById(docId,{available:!docData.available})


        res.json({sucess:true,message:"Availabilty change"})
    } catch (error) {
        console.log(error)
        res.json({sucess:false, message:error.message})
        
    }
}







export {addDoctor ,allDoctors, loginAdmin}