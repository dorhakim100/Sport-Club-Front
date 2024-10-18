import React, { useRef, useState } from 'react'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'

// Import required modules
import {
  FreeMode,
  Navigation,
  Thumbs,
  Autoplay,
  Pagination,
} from 'swiper/modules'
import { makeId } from '../services/util.service'

export function SwiperCarousel({ imgs }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null) // Initialize thumbsSwiper state
  console.log(imgs)
  return (
    <>
      <Swiper
        style={{
          '--swiper-navigation-color': '#4CAF50',
          '--swiper-pagination-color': '#fff',
        }}
        // loop={true}
        spaceBetween={10}
        // navigation={true}
        thumbs={{
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }}
        autoplay={{
          delay: 3500, // Delay between transitions (in milliseconds)
          disableOnInteraction: false, // Continue autoplay after user interactions
        }}
        // pagination={{
        //   clickable: false,
        // }}
        modules={[FreeMode, Navigation, Thumbs, Autoplay]} // Include the Autoplay module
        className='mySwiper2'
      >
        {imgs.map((img, index) => (
          <SwiperSlide key={img.id}>
            <img src={img.link} alt={`Slide ${index + 1}`} />
          </SwiperSlide>
        ))}
      </Swiper>

      <Swiper
        onSwiper={setThumbsSwiper} // Set the thumbsSwiper reference here
        loop={true}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className='mySwiper'
      >
        {imgs.map((img, index) => (
          <SwiperSlide key={img.id}>
            <img
              src={img.link}
              alt={`Thumbnail ${index + 1}`}
              className='nav-img'
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  )
}
