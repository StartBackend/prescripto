import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets_admin/assets'
import { AdminContext } from '../../context/AdminContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [experience, setExperience] = useState('1 year')
  const [fees, setFees] = useState('')
  const [about, setAbout] = useState('')
  const [Speciality, setSpeciality] = useState('General physician')
  const [degree, setDegree] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const { backendUrl, aToken } = useContext(AdminContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    try {
      if (!docImg) {
        return toast.error('Image Not Selected')
      }

      const formData = new FormData()
      formData.append('image', docImg)
      formData.append('name', name)
      formData.append('email', email)
      formData.append('password', password)
      formData.append('experience', experience)
      formData.append('fees', Number(fees))
      formData.append('about', about)
      formData.append('speciality', Speciality)
      formData.append('degree', degree)
      formData.append('address', JSON.stringify({ line1: address1, line2: address2 }))

      const { data } = await axios.post(
        backendUrl + '/api/admin/add-doctor',
        formData,
        { headers: { aToken } }
      )

      if (data.success) {
        toast.success(data.message)
        // ✅ Reset ALL fields
        setDocImg(false)
        setName('')
        setEmail('')
        setPassword('')                    // ✅ fixed
        setExperience('1 year')            // ✅ fixed
        setFees('')
        setAbout('')
        setSpeciality('General physician') // ✅ fixed
        setDegree('')
        setAddress1('')
        setAddress2('')
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)           // ✅ fixed
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='m-5 w-full'>
      <p className='mb-3 text-lg font-medium'>Add Doctor</p>
      <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>

        {/* Image Upload */}
        {/* what is items centre / what is gap on which element how gap work */}
        <div className='flex items-center gap-4 mb-8 text-gray-500'>
          <label htmlFor="doc-img">
            <img className='w-16 bg-gray-200 rounded-full cursor-pointer'
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} alt="" />
          </label>
          <input onChange={(e) => setDocImg(e.target.files[0])}
            type="file" id="doc-img" hidden />
          <p>Upload Doctor <br />picture</p>
        </div>

        <div className='flex flex-col lg:flex-row gap-10 text-gray-600'>
          {/* Left Column */}
          <div className='w-full lg:flex-1 flex flex-col gap-3'>
            <div className='flex flex-col gap-1'>
              <p>Doctor name</p>
              <input onChange={(e) => setName(e.target.value)} value={name}
                className='border rounded px-3 py-2' type="text" placeholder='Name' required />
            </div>
            <div className='flex flex-col gap-1'>
              <p>Doctor Email</p>
              <input onChange={(e) => setEmail(e.target.value)} value={email}
                className='border rounded px-3 py-2' type="email" placeholder='Doctor email' required />
            </div>
            <div className='flex flex-col gap-1'>
              <p>Doctor Password</p>
              <input onChange={(e) => setPassword(e.target.value)} value={password}
                className='border rounded px-3 py-2' type="password" placeholder='Password' required />
            </div>
            <div className='flex flex-col gap-1'>
              <p>Experience</p>
              <select onChange={(e) => setExperience(e.target.value)} value={experience}
                className='border rounded px-3 py-2'>
                <option value="1 year">1 year</option>
                <option value="2 year">2 year</option>
                <option value="3 year">3 year</option>
                <option value="4 year">4 year</option>
                <option value="5 year">5 year</option>
                <option value="6 year">6 year</option>
              </select>
            </div>
            <div className='flex flex-col gap-1'>
              <p>Fees</p>
              <input onChange={(e) => setFees(e.target.value)} value={fees}
                className='border rounded px-3 py-2' type="number" placeholder='Fees' required />
            </div>
          </div>

          {/* Right Column */}
          <div className='w-full lg:flex-1 flex flex-col gap-4'>
            <div className='flex flex-col gap-1'>
              <p>Speciality</p>
              {/* ✅ No duplicate options */}
              <select onChange={(e) => setSpeciality(e.target.value)} value={Speciality}
                className='border rounded px-3 py-2'>
                <option value="General physician">General physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>
            <div className='flex flex-col gap-1'>
              <p>Education</p>
              {/* ✅ Added value prop */}
              <input onChange={(e) => setDegree(e.target.value)} value={degree}
                className='border rounded px-3 py-2' type="text" placeholder='Education' required />
            </div>
            <div className='flex flex-col gap-1'>
              <p>Address</p>
              {/* ✅ Added value props */}
              <input onChange={(e) => setAddress1(e.target.value)} value={address1}
                className='border rounded px-3 py-2' type="text" placeholder='Address 1' required />
              <input onChange={(e) => setAddress2(e.target.value)} value={address2}
                className='border rounded px-3 py-2 mt-1' type="text" placeholder='Address 2' required />
            </div>
          </div>
        </div>

        {/* About */}
        <div>
          <p className='mt-4 mb-2'>About Doctor</p>
          <textarea onChange={(e) => setAbout(e.target.value)} value={about}
            className='border rounded w-full px-4 pt-2'
            placeholder='Write about doctor' rows={5} required />
        </div>

        <button type='submit'
          className='bg-blue-700 px-10 py-3 mt-4 text-white rounded-full'>
          Add Doctor
        </button>
      </div>
    </form>
  )
}

export default AddDoctor