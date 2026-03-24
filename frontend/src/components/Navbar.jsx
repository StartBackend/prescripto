import React, { useState } from 'react'
import {assets} from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const Navbar = () => {
    const navigate=useNavigate();
    const [showMenu,setShowMenu]=useState(false)
    const {token,setToken,userData}=useContext(AppContext)
   const logOut=()=>{
    setToken(false)
    localStorage.removeItem('token')
   }

  return (
    <div className=' flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>
        <img onClick={()=>navigate('/')} className='w-44 cursor-pointer' src={assets.logo} alt=''/>
        <ul className='hidden md:flex items-start gap-5 font-medium'>
            <NavLink to='/'>
                <li className='py-1'>Home</li>
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
            </NavLink>
             <NavLink to='/doctors'>
                <li className='py-1'>All Doctor</li>
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' /> 
            </NavLink>

             <NavLink to ='/about'>
                <li className='py-1'>About</li>
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
            </NavLink>
             <NavLink to ='/contact'>
                <li className='py-1'>Contact</li>
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
            </NavLink>
        </ul>  
        <div className='flex items-center gap-4'>
            {
                token ? <div className='flex items-center gap-2 cursor-pointer group relative'  >
                    <img className='w-8 rounded-full' src={assets.profile_pic} alt=""  />
                    <img className= ' w-2.5'src={assets.dropdown_icon} alt="" />
                    <div className=' absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                        <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                            <p onClick={()=>navigate('/my-profile')}className='hover:text-black cursor-pointer'>My profile</p>
                            <p onClick={()=>navigate('/my-appointment')}className='hover:text-black cursor-pointer'>my appointment</p>
                            <p onClick={logOut}className='hover:text-black cursor-pointer'>logout</p>
                        </div>
                    </div>
                </div>:
            <button onClick={()=>navigate('/login')} className='bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block'>create account</button>
            }
            <img 
            onClick={()=>setShowMenu(true)}
            src={assets.menu_icon}
            className='md:hidden w-6'
             alt="" />
             {/* Mobile menu */}
             <div className={`${showMenu?'fixed w-full':'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
                <div>
                    <img className='w-36'src={assets.logo} alt="" />
                     <img className='w-7'onClick={()=>setShowMenu(false)}  src={assets.cross_icon} alt="" />

                </div>
                <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
                    <NavLink  onClick={()=>setShowMenu(false)} to ='/'>Home</NavLink>
                    <NavLink onClick={()=>setShowMenu(false)} to='/doctors'>ALL DOCTORS</NavLink>
                    <NavLink onClick={()=>setShowMenu(false)} to ='/about'>ABOUT</NavLink>
                    <NavLink onClick={()=>setShowMenu(false)} to='/contact'>CONTACT</NavLink>
                    
                </ul>

             </div>

        </div>
        
    </div>
  )
}

export default Navbar