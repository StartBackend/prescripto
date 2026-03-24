import React from 'react'
import Login from './pages/Login'
import { AdminContext } from './context/AdminContext.jsx'

import { ToastContainer, toast } from 'react-toastify';
import Navbar from './components/Navbar.jsx';
import SideBar from './components/SideBar.jsx';
import { Route,Routes } from 'react-router-dom';
import Dashboard from './pages/Admin/Dashboard.jsx';
import AllAppointment from './pages/Admin/AllAppointment.jsx';
import AddDoctor from './pages/Admin/AddDoctor.jsx';
import DoctorList from './pages/Admin/DoctorList.jsx';

function App() {

 const{aToken}=React.useContext(AdminContext)
 //const aToken=true

  return aToken? (
    <div className='bg-[#F8F9FD]'>
      
      <ToastContainer/>
      <Navbar/>
      <div className='flex items-start'>
        <SideBar/>
        <Routes>
          <Route path='/' element={<></>}/>
          <Route path='/admin-dashboard' element={<Dashboard/>}/>
          <Route path='/all-appointment' element={<AllAppointment/>}/>
          <Route path='/add-doctor' element={<AddDoctor/>}/>
          <Route path='/doctor-list' element={<DoctorList/>}/>
          
        </Routes>
      </div>
    </div>
  ):(
    <>
    <Login />
    <ToastContainer/>    
    </>
  )
}

export default App