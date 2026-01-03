import React, { useState } from 'react'
import HeroBanner from '../components/header/HeroBanner.jsx'
import CategoryStrip from '../components/CategoryStrip/CategoryStrip.jsx'
import '../components/header/Header.css'
import '../components/CategoryStrip/CategoryStrip.css'
import FoodDisplay from '../components/fooddisplay/FoodDisplay.jsx'

const Home = () => {
    const [category, setCategory] = useState("All");
  return (
    <div>
        <HeroBanner />
        <CategoryStrip category={category} setCategory={setCategory}/>
        <FoodDisplay category={category}/>
    </div>
  )
}

export default Home