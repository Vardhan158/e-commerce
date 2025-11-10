import React from 'react'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import Banner from '../components/Banner'
import BrandMarquee from '../components/BrandMarquee'
import HeroSlider from '../components/HeroSlider'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div>
        <Banner />
        <Navbar />
        <HeroSection/>
        <BrandMarquee />
        <HeroSlider />
        <Footer />
    </div>
  )
}

export default Home 