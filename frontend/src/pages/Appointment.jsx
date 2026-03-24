import React, { useContext, useEffect, useState } from 'react'
import {  useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctor from '../components/RelatedDoctor'
import { toast } from 'react-toastify'
import axios from 'axios'

const Appointment = () => {

  // doctors id 
  const {docId}=useParams()
  // all doctors data  
  const {doctors,currencySymbol,backendUrl,getDoctorsData,token}=useContext(AppContext)

  const navigate=useNavigate()
  const[doctInfo, setDocInfo]=useState(null)
  const [doctSlots,setDocslots]=useState([])
  const [slotIndex,setSlotIndex]=useState(0)
  const [slotTime, setSlotTime ]=useState('')
  const daysOfWeek=['sun','mon','tue','wed','thu','fri','sat']

  
  const fetchDocInfo = async()=>{
    const dpcInfo=doctors.find(doc=>doc._id===docId)
    setDocInfo(dpcInfo)   
    
  }
  const getAvailableSlots=async()=>{
    // have to understand this section 
    // st the slot empty

    setDocslots([])

    ///geting current date
    let today=new Date()
    for(let i=0;i<7;i++){
      // getting date with index
      let currentDate=new Date(today)
      currentDate.setDate(today.getDate()+i)
      // setting end time of the date index
      let endTime =new Date()
      endTime.setDate(today.getDate()+1)
      endTime.setHours(21,0,0,0)
      // setting hours 
      if(today.getDate()===currentDate.getDate()){
        currentDate.setHours(currentDate.getHours()>10?currentDate.getHours()+1:10)
        currentDate.setMinutes(currentDate.getMinutes()>30?30:0)
      }
      else{
        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }
      let timeSlots=[]
      while(currentDate<endTime){
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });

        let day=currentDate.getDate()
        let month=currentDate.getMonth()+1
        let year=currentDate.getFullYear()
        //concat the string 
        const slotDate=day+'_'+month+'_'+year
        const slotTime=formatted
        const isSlotAvailable=doctInfo.slot_booked[slotDate]&& doctInfo.slot_booked[slotDate].includes(slotTime) ?false:true
        if (isSlotAvailable){
          // add slot to array
             timeSlots.push(
          {
            datetime:new Date (currentDate),
            time:formattedTime
          }
        )
        }
        
        
       
        ///increament 
        currentDate.setMinutes(currentDate.getMinutes()+30)
       
      }
      setDocslots(prev=>([...prev,timeSlots]))
    }
  }
   
  const bookAppointment=async () => {
    if(!token){
      toast.warn('Login to book appoitment')
      return navigate('/login')
    }
    try {
       const date=doctSlots[slotIndex][0].datetime
       let day=date.getDate()
       let month=date.getMonth()+1
       let year=date.getFullYear()
       const slotDate= day+'_'+month+'_'+year
       console.log(slotDate)
       const {data}= await axios.post(backendUrl+'/api/user/book-appointment',{docId,slotDate,slotTime},{
        headers:{token}
       })
       if(data.success){
        toast.error(data.message)
        getDoctorsData()
        navigate('/my-appointments')
       }else{
        toast.error(data.message)
       }
      
    } catch(error){
      console.log(error)
      toast.error(error.message)
    }     
  }
  // any changs is doctors and docId
  useEffect(
    ()=>{
      fetchDocInfo()
    },[doctors,docId]
  )

  useEffect(()=>{
    getAvailableSlots()

  },[doctInfo])

  useEffect(()=>{
    console.log(doctSlots)
  },[doctSlots])
  useEffect(() => {
  console.log("Slots Generated:", doctSlots.map(day => day.map(slot => slot.datetime)));
}, [doctSlots]);
// p-8= padding all sides
// py-padding on top and botton 
// mx-(margin on X mean left and right )
// sm:(small scren margin)
//mt-[-80px]: On small screens, pull this box up by 80px (negative margin).
//mt = margin top
//my=margin top and bottom
//flex =rows
//cursor-pointer="Cursor pointer" refers to the CSS cursor property with the value pointer, which turns the mouse cursor into a hand icon to visually indicate that an element is clickable. This is a visual cue for users, providing immediate feedback that an item is interactive and will perform an action if clicked


  return doctInfo && (
    <div>
      {/**-------doctor details  */}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <img className='bg-primary w-full sm:max-w-72 rounded-lg'src={doctInfo.image} alt="" />
        </div>
        <div className=' flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
          {/**----Doc info name degre experience -------- */}
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>{doctInfo.name} <img className='w-5' src= {assets.verified_icon} alt="" /></p>
        {/* below dev represnt doctor degree and speciality */}
          <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
            <p>
              {doctInfo.degree}-{doctInfo.speciality}
            </p>
            {/* button for repesent experience */}
            <button className='py-0.5 px-2 border text-xs rounded-full'>{doctInfo.experience}</button>
          </div>

        {/**------Doctor about---- */}
        <div>
          <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
            About <img src={assets.info_icon} alt="" />
          </p>
          <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{doctInfo.about}</p>

        </div>
        <p className='text-gray-500 font-medium mt-4'>
          Appointment fee: <span className='text-gray-600'>{currencySymbol}{doctInfo.fees}</span>
        </p>
        </div>
      </div>
      {/**bookoing slot  */}
      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
        <p>Booking</p>
        <div className='flex gap-3 items-center  overflow-x-scroll mt-4'>

          {doctSlots.length &&
            doctSlots.map((items, index) => {
              if (!items.length) return null; // Skip empty days

              return (
                <div
                  onClick={() => setSlotIndex(index)}
                  key={index}
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index
                      ? 'bg-primary text-white'
                      : 'border border-gray-200'
                    }`}
                >
                  <p>{daysOfWeek[items[0].datetime.getDay()]}</p>
                  <p>{items[0].datetime.getDate()}</p>
                </div>
              );
            })}

        </div>
        <div className='flex  items-center gap-3 w-full overflow-x-scroll mt-4'>
          {doctSlots.length > 0 && doctSlots[slotIndex]?.map((item, idx) => (
            <p onClick={() => setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-400'}`} key={idx}>{item.time.toLowerCase()}</p>
          ))}
        </div>
        <button onClick={bookAppointment} className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6'> Book an Appointment </button>

      </div>
      {/**Listing Related Doctor  */}
      <RelatedDoctor docId={docId} speciality={doctInfo.speciality}/>


    </div>
  )
}

export default Appointment