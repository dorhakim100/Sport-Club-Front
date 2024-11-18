import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'

// import required modules
import { Mousewheel, Pagination } from 'swiper/modules'
import { makeId } from '../services/util.service'

export function MouseWheelCarousel({ imgs }) {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  return (
    <>
      <Swiper
        direction={'vertical'}
        slidesPerView={1}
        spaceBetween={30}
        mousewheel={true}
        pagination={{
          clickable: true,
        }}
        modules={[Mousewheel, Pagination]}
        className='mouse-wheel'
        style={{
          width: '80vw',
          height: 'calc(50vw)',
          maxHeight: '600px',
          minHeight: '300px',
        }}
      >
        {imgs.map((slide) => {
          return (
            <SwiperSlide key={makeId()} className='mouse-wheel'>
              <img
                src={slide.img}
                alt=''
                style={{
                  objectFit: 'cover',
                  height: 'calc(50vw)',
                  maxHeight: '600px',
                  minHeight: '300px',
                }}
              />
              <span>{prefs.isEnglish ? slide.text.eng : slide.text.he}</span>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </>
  )
}
