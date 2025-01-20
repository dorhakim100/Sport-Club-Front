import React, { useState } from 'react'
import { useSelector } from 'react-redux'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'

// Import required modules
import { FreeMode, Navigation, Thumbs, Autoplay } from 'swiper/modules'
import { makeId } from '../services/util.service'

export function SwiperCarousel({ imgs }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null) // Initialize thumbsSwiper state
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  return (
    <>
      <Swiper
        // style={{ direction: 'rtl' }}
        autoplay={{
          delay: 3500, // Delay between transitions (in milliseconds)
          disableOnInteraction: false, // Continue autoplay after user interactions
        }}
        style={{
          direction: 'rtl',
        }}
        // loop={true}
        loop={false}
        spaceBetween={10}
        // navigation={true}
        thumbs={{
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }}
        modules={[FreeMode, Navigation, Thumbs, Autoplay]} // Include the Autoplay module
        className='home-swiper shadow-text carousel-text'
      >
        {imgs.map((img, index) => (
          <SwiperSlide key={`${makeId()}Main`} className='home-slide'>
            <img
              src={img.link}
              alt={`Slide ${index + 1}Blur`}
              className='blur'
              loading='lazy'
            />

            <div className='img-container'>
              <img src={img.link} alt={`Slide ${index + 1}`} loading='lazy' />
              {img.text && (
                <div className='header-container carousel-text'>
                  <div className='text'>
                    <h2>
                      {prefs.isEnglish ? img.text.first.eng : img.text.first.he}
                    </h2>
                    <h2>
                      {prefs.isEnglish
                        ? img.text.second.eng
                        : img.text.second.he}
                    </h2>
                  </div>
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <Swiper
        onSwiper={setThumbsSwiper} // Set the thumbsSwiper reference here
        loop={false}
        spaceBetween={10}
        slidesPerView={imgs.length}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className='mySwiper'
      >
        {imgs.map((img, index) => (
          <SwiperSlide key={`${makeId()}Nav`}>
            <img
              src={img.link}
              alt={`Thumbnail ${index + 1}`}
              className='nav-img'
              loading='lazy' // Lazy load images
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  )
}
