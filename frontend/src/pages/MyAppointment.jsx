import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'


const MyAppointment = () => {

  const {backendUrl,token,doctors,getDoctorsData}=useContext(AppContext)
  const [appointments,setAppointments]=useState([])
  // create this arrray 
  const months=['','jan','feb','mar','Apr','May']
  const slotDateFormat=(slotDate)=>{
    const dateArray=slotDate.split('_')
    return dateArray[0]+" "+months[Number(dateArray[1])]+" "+dateArray[2]

  }
    
const getUserAppointment= async () => {
  try {
    const {data}=await axios.get(backendUrl+'/api/user/appointment', {headers:{token}})
    if(data.success){
      setAppointments(data.appointments.reverse())
  }
} catch (error) {
    console.log(error)
    toast.error(error.message)
  }  
 }
 useEffect(()=>{
  if(token){
    getUserAppointment()
  }

 },[token])
const cancelAppointment=async(appointmentId)=>{
  try {
    
 const {data}= await axios.post(backendUrl+'/api/user/cancel-appointment',{appointmentId},{headers:{token}})
 if(data.success){
  toast.success(data.message)
  getUserAppointment()
 }else{
  toast.error(data.message)
 }

  } catch (error) {
    console.log(error)
    toast.error(error.message)
    
  }
}
 
  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My Appointment</p>
      <div>
        {
          doctors.slice(0,2).map((index,items)=>(
            <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b'key={index}>
              <div>
                <img className=' w-32 bg-blue-200  'src={item.docData.image} alt="" />
              </div>
              <div className='flex-1 text-sm text-zinc-600' >
                <p className='text-neutral-800 font-semibold'>{items.docData.name}</p>
                <p className='text-zinc-700 font-medium mt-1'>{item.docData.speciality}</p>
                <p>Address:</p>
                <p className='text-xs'>{items.docData.address.line1}</p>
              <p className='text-xs'>{items.docData.address.line1}</p>
                <p  className='text-xs mt-1 '><span className='text-sm text-neutral-700 font-medium'>Date & Time: </span>
                {
                  slotDateFormat(items.slotDate)
                }                
                </p>
              </div>
              <div></div>
              <div className='flex flex-col gap-2 justify-end'>
                {!items.cancelled &&  <button className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded
                 hover:bg-blue-700
                hover:text-white transition-all duration-300                 
                '>payOnline</button>}
               
                {!items.cancelled &&  <button
                
                onClick={()=>cancelAppointment()
              }
                className='text-sm text-stone-500  
                hover:bg-red-700
                hover:text-white transition-all duration-300               
                text-center sm:min-w-48 py-2 border rounded
                '>Cancel Appointment</button>}
               
              </div>

            </div>
          ))
        }

      </div>
    </div>
  )
}

export default MyAppointment