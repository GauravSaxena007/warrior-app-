import React from 'react'
import Hero from '../hero/Hero'
import Welcome from '../welcome text/Welcome'
import Cards from '../cards/Cards'
import Testing from '../Testing'
import ReelComp from '../ReelComp/ReelComp'

const Home = () => {
  return (
    <div>
      <div><ReelComp/></div>
        <Hero/>
        <Welcome/>
        <Cards/>
    </div>
  )
}

export default Home