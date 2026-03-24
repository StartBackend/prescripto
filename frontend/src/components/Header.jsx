import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
  return (
    //md=medium screen lg:large screen 
    //px= padding from left and right 
    //rounded the hat corners rounded-lg
    // rounded-md =medium rounded corner of the box
    // trasitionall= make all changes (like scaling colo) happen smoothly
    <div className=' flex flex-col md:flex-row flex-wrap bg-primary rounded-lg px-6 md:px-10 lg:px-20'>

        {/*left side  */}
        <div className='md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vm] md:md-[30px]'>
            <p className='text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight md:leading lg:leading-tight'>
                BOOK Appointment 
                <br />
                with Trusted Doctor
            </p>
            <div className='flex flex-col md:flex-row items-center gap-3 text-white  text-sm font-light'>
                <img  className='w-28 ' src={assets.group_profiles} alt="" />
                <p>simpl browse through extensive list of trusted doctor <br className='hidden sm:block' /></p>
            </div>
              <a
                  href="#speciality"
                  className=" inline-flex items-center gap-1 bg-white px-2 py-1 rounded-md text-gray-600 text-sm hover:scale-105 transition-all duration-300"
              >
                  Book appointment
                  <img className="w-3 h-3" src={assets.arrow_icon} />
              </a>


        </div>
        {/*right side  */}
        <div className='md:w-1/2 relative'>
              <img  className='w-full md:absolute bottom-0 h-auto rounded-lg'
            src={assets.header_img} alt="" />
        </div>
    </div>
  )
}

export default Header