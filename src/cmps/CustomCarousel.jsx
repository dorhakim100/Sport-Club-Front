import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// import required modules

// Import required modules
import { FreeMode, Navigation, Thumbs, Autoplay } from 'swiper/modules'
import { makeId } from '../services/util.service'

export function CustomCarousel({ imgs }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null) // Initialize thumbsSwiper state
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const location = useLocation()
  return (
    <Swiper
      autoplay={{
        delay: 5000, // Delay between transitions (in milliseconds)
        disableOnInteraction: false, // Continue autoplay after user interactions
      }}
      style={{
        direction: 'rtl',
      }}
      // loop={true}
      loop={true}
      spaceBetween={10}
      // navigation={true}
      thumbs={{
        swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
      }}
      modules={[FreeMode, Navigation, Thumbs, Autoplay]} // Include the Autoplay module
      navigation={imgs.length > 1 ? true : false}
      className='item-details-swiper'
    >
      {imgs.map((img, index) => (
        <SwiperSlide key={`${location.pathname}-${index}`}>
          <div className='img-container'>
            <img src={img} alt={`${index + 1}`} />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
