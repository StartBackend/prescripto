import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'

const DoctorList = () => {
  const { doctors, aToken, getAllDoctors, changeAvailability } = useContext(AdminContext)
  console.log(doctors)

  useEffect(() => {
    if (aToken) {
      getAllDoctors()
    }
  }, [aToken])

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>  {/* ✅ Fix 3 */}
      <h1 className='text-lg font-medium'>All Doctors</h1>
      <div className='flex w-full flex-wrap gap-4 pt-5 gap-y-6'>
        {doctors.map((item, index) => (
          <div className='border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group' key={index}>
            <img className='bg-indigo-200 group-hover:bg-blue-500 transition-all duration-500' src={item.image} alt="" />
            <div className='p-4'>
              {/* ✅ Fix 1 - curly braces */}
              <p className='text-neutral-800 text-lg font-medium'>{item.name}</p>
              <p className='text-zinc-400 text-sm'>{item.speciality}</p> {/* ✅ Fix 2 */}
              <div className='mt-2 flex items-center gap-1 text-sm'>
                <input onChange={() => changeAvailability(item._id)} type="checkbox" checked={item.available} />
                <p>Available</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DoctorList