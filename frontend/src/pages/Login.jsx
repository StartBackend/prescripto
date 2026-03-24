import React, { useState } from 'react'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const {backendUrl,token,setToken}=useContext(AppContext)
  const navigate=useNavigate()
  // step create some state variable 
  // state manage the login page
 // state manage the login page 
  const[state, setState]=useState('sign up')
  //store email
  const [email, setEmail]=useState('')
  // store the password 
  const [password, setPassword]=useState('')
  // store the name 
  const [name, setName]=useState('')

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    try {
        if (state === 'sign up') {  // ✅ lowercase matches useState
            const {data} = await axios.post(backendUrl + '/api/user/register', {name, password, email})
            if (data.success) {
                localStorage.setItem('token', data.token)
                setToken(data.token)
            } else {
                toast.error(data.message)
            }
        } else {
            const {data} = await axios.post(backendUrl + '/api/user/login', {password, email})
            if (data.success) {
                localStorage.setItem('token', data.token)
                setToken(data.token)
            } else {
                toast.error(data.message)
            }
        }
    } catch (error) {
        toast.error(error.message)
    }
}
  useEffect(()=>{
      if (token){
        navigate('/')

      }
  },[token])
  return (
   
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center' action="">
      <div  className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl  text-zinc-600 text-sm shadow-lg'>
        {/*  for showing the text login or singup */}
        <p className='text-2xl font-semibold'>{state==='sign up'?"create Account":"Login"}</p>
        <p>please {state==='sign up'?"create Account":"Login"}  to book appointment</p>
        {
          state==='sign up'&& <div className='w-full'>
          <p>
            Full Name
          </p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1'type="name" onChange={(e) => setName(e.target.value)} value={name} required />
        </div>
        }
        
        <div className='w-full'>
          <p>
            Email
          </p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="email" onChange={(e) => setEmail(e.target.value)} value={email} required />

        </div>
        <div className='w-full'>
          <p> Password </p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="password" onChange={(e) => setPassword(e.target.value)} value={password} required/>

        </div>
        <button type='submit '   className='bg-primary text-white w-full py-2 rounded-md  text-base'>{state==='sign up'?"create Account":"Login"}

        </button>
        {
          state==='sign up'
          ? <p>Already have an account?Already have an account?<span className='text-primary cursor-pointer'
          onClick={()=>setState('Login')}          
          
          >Login here</span></p>
          : <p>Create an account? <span className='text-primary cursor-pointer'
          onClick={()=>{setState('sign up')}}
          >click here</span> </p>
        }
      </div>
    </form>
  )
}

export default Login