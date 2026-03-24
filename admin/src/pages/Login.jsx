import React from 'react'
import axios from 'axios'
import { AdminContext } from '../context/AdminContext'
import { toast } from 'react-toastify'

function Login() {
    const [state, setState] = React.useState('Admin')
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const { setAToken, backendUrl } = React.useContext(AdminContext)

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (state === 'Admin') {
                const { data } = await axios.post(
                    `${backendUrl}/api/admin/login`,
                    { email, password }
                )
                if (data.success) {
                    // ✅ Fix 1 - matching key 'aToken'
                    localStorage.setItem('aToken', data.token)
                    setAToken(data.token)
                } else {
                    toast.error(data.message)
                }
            }
        } catch (error) {
            toast.error(error.message)  // ✅ Fix 2
        }
    }

    return (
        <form onSubmit={handleSubmit} className='min-h-[80vh] flex items-center'>
            <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
                <p className='text-2xl m-auto font-semibold'>
                    <span className='text-primary'>{state}</span> Login
                </p>
                <div className='w-full'>
                    <p>Email</p>
                    {/* ✅ Fix 3 - single bracket */}
                    <input className='border border-[#DADADA] rounded w-full p-2 mt-1'
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        required />
                </div>
                <div className='w-full'>
                    <p>Password</p>
                    {/* ✅ Fix 3 - single bracket */}
                    <input className='border border-[#DADADA] rounded w-full p-2 mt-1'
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        required />
                </div>
                <button className='bg-black text-white w-full py-2 rounded-md text-base'>
                    Login
                </button>
                {state === 'Admin'
                    ? <p className='text-sm m-auto'>Login as Doctor?
                        <span onClick={() => setState('Doctor')} className='text-primary cursor-pointer'> click here</span>
                      </p>
                    : <p className='text-sm m-auto'>Login as Admin?
                        <span onClick={() => setState('Admin')} className='text-primary cursor-pointer'> click here</span>
                      </p>
                }
            </div>
        </form>
    )
}

export default Login