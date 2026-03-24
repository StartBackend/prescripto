import React from 'react'
import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import TopDoctor from '../components/TopDoctor'
import Banner from '../components/Banner'

function Home() {
  return (
    <div id=''>
      <Header/>
      <SpecialityMenu/>
      <TopDoctor/>
      <Banner/>
      
    </div>
  )
}

export default Home