import validator from 'validator'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointMode.js'
// api for register
const registerUser=async (req,res) => {
    try {
        // take user 
        const {name,email,password}=req.body
        // if any of this proprties is undfined 
        if(!name||!password||!email){
            return res.json({success:false,message:"missing Details"})
        }
          const existingUser = await userModel.findOne({email})
        if(existingUser){
            return res.json({success:false, message:"Email already registered"})
        }
        if(!validator.isEmail(email)){
              return res.json({success:false,message:"enter a valid email "})

        }
        // checking pass word coo
        if (password.length<8){
             return res.json({success:false,message:"enter a strong password "})
        }
        // hashing user password 
        const salt=await bcrypt.genSalt(10)
        const hashedPassword =await bcrypt.hash(password,salt)
        const userData={
            name,
            email,
            password:hashedPassword
        }
        const newUser =new userModel(userData)
        const user=await newUser.save()
       const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)

        res.json({success:true ,token})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
        
    }
    
} 
// api for loginuser
const loginUser=async(req,res)=>{
    try {
        const{email,password}=req.body
        const user=await userModel.findOne({email})
        if(!user){
           return res.json({success:false,message:'User does not exist'})

        }
        // match the password is correct or not 
        const isMatch=await bcrypt.compare(password,user.password)
        //checkig match
        if(isMatch){
            const token=jwt.sign({id:user._id},process.env.JWT_SECRET)
            res.json({success:true,token})
        }
        else{
            res.json({success:false,message:'Invalid credentials'})
        }
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
        
    }
}
// api for get user profile data 
const getProfile=async(req,res)=>{
    try {
        const {userId}=req.body
        const userData= await userModel.findById(userId).select('-password')
        res.json({success:true, userData})


    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
        
    }
}
// api to update profile 
const updateProfile=async (req,res) => {
    try {
        const{userId,name,phone,address,dob,gender}=req.body
        const imageFile=req.file 
        if (!name||!phone||!dob||!gender) {
            return res.json({success:false,message:"Data Missing"})
            
        }
        await userModel.findByIdAndUpdate(userId,{name,phone,address:JSON.parse(address),dob,gender})
        if(imageFile){
            //upload image to cloudinary 
            const imageUpload= await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'})
            const imageURL=imageUpload.secure_url
            await userModel.findByIdAndUpdate(userId,{image:imageURL})
        }
        res.json({success:true,message:"profile updated"})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})        
    }    
}
// API to book appointment
const bookAppointment=async (req,res) => {
    try {
        const{userId,docId,slotDate,slotTime}=req.body
        const docData= await doctorModel.findById(docId).select('-password')
        if(!docData.available){
            return res.json({
                success:false,
                message:'Doctor not available'
            })
        }
        let slots_booked=docData.slots_booked
        // checking fpr the slots 
        if (slots_booked[slotDate]){
            //inside it
            if(slots_booked[slotDate].includes(slotTime)){
                return res.json({
                success:false,
                message:'slots not available'
            })
            }else{
                slots_booked[slotDate].push(slotTime)
            }
        }else{
            slots_booked[slotDate]=[]
            slots_booked[slotDate].push(slotTime)
        }
        const userData=await userModel.findById(userId).select('-password')

      delete docData.slots_booked
      const appointmentData={
        userId,
        docId,
        userData,
        docData,
        amount:docData.fees,
        slotTime,
        slotDate,
        date:Date.now()

      }
      // to save this data in dta base
      const newAppointModel=new appointmentModel(appointmentData)
      await newAppointModel.save()

      //  save new slots data in doctorModel
      await doctorModel.findByIdAndUpdate(docId,{slots_booked})
      res.json({success:true,message:'Appointment successful'})
    

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
        
    }
    
}
//api to get appointment all doctors 
const listAppointment=async (req,res) => {
        try {
            const {userId}=req.body
            const appointment=await appointmentModel.find({userId})

            res.json({success:true,appointment})
        } catch (error) {
            console.log(error)
            res.json({success:false,message:error.message})
        }
}
// API for cancel appointment 
const cancelAppointment=async (req,res) => {
    try {
        const {userId,appointmentId}=req.body
      const appointmentData =  await appointmentModel.findById(appointmentId)
      ///verfy appointment user 
      if(appointmentData.userId!==userId){
     return res.json({success:false, message:'Unauthorized action'})
      }
      //verify appointme
      await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})

      //releasing doctors slot
      const {docId,slotDate,slotTime}=appointmentData

      const doctorData=  await doctorModel.findById(docId)
      let slots_booked=doctorData.slots_booked

      slots_booked[slotDate]=slots_booked[slotDate].filter(e=>e!==slotTime)
      await doctorModel.findByIdAndUpdate(docId,{slots_booked})
      res.json({success:true,message:'Appointment Called  '})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
        
    }
    
}

// const razorpayInstance=new razorpay({
//   key_id:'',
//  key_secret:''
// })
// //API to make payment of appointment razorpay
// const paymentRazorpay=async (req,res) => {

//  try {
//       const {appointmentId}=req.body
//   const appointmentData=await appointmentModel.findById(appointmentId)
//  if(!appointmentData||appointmentData.cancelled){
//     return res.json({success:false,message:"Appooint Cancelled or not found"})
//  }
//  // Creating options for razorpay payment 
//  const options={
//     amount:appointmentData.amount*100,
//     currency:process.env.CURRENCY,
//     receipt:appointmentId,

//  }
//  //creattion of an order
//  const order= await razorpayInstance.orders.create(options)

//  res.json({success:true,order})
   

//  } catch (error) {
//     console.log(error)
//     res.json({success:false,message:error.message})
       
//  }
  
// }

export {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    bookAppointment,
    listAppointment,
    cancelAppointment,
    // paymentRazorpay

}