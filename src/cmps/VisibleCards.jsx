import React, { useRef, useState } from 'react'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'

import { EffectCoverflow, Pagination } from 'swiper/modules'

export function VisibleCards() {
  const slides = [
    'https://swiperjs.com/demos/images/nature-1.jpg',
    'https://swiperjs.com/demos/images/nature-2.jpg',
    'https://swiperjs.com/demos/images/nature-3.jpg',
  ]
  return (
    <>
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={3}
        coverflowEffect={{
          rotate: 40,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        spaceBetween={window.width > 500 ? 50 : 10}
        initialSlide={Math.floor(slides.length / 2)} // Set initial focus to the middle slide
        pagination={true}
        modules={[EffectCoverflow, Pagination]}
        className='visible-cards'
      >
        {slides.map((slide, index) => (
          <SwiperSlide
            key={index}
            style={{
              color: 'black',
              minHeight: '100px',
              height: '20vw',
              maxHeight: '200px',

              //   minWidth: '200px',
              width: '30vw',
              maxWidth: '400px',
            }}
          >
            {/* <img
              src={slide}
              alt={`Slide ${index + 1}`}
              style={{ width: '100%', borderRadius: '10px' }}
            /> */}
            <b>bla</b>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  )
}
