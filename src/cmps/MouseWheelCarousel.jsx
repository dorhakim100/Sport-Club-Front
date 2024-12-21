import React, { useRef, useState, useEffect } from 'react'
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

  const swiperRef = useRef(null)

  useEffect(() => {
    const handleWheel = (event) => {
      const swiper = swiperRef.current.swiper

      if (swiper.isEnd || swiper.isBeginning) {
        // Allow the scroll to propagate to the page container
        swiper.params.mousewheel.releaseOnEdges = true
      } else {
        swiper.params.mousewheel.releaseOnEdges = false
      }
    }

    const swiperInstance = swiperRef.current.swiper

    if (swiperInstance) {
      swiperInstance.el.addEventListener('wheel', handleWheel)
    }
    return () => {
      if (swiperInstance.el) {
        swiperInstance.el.removeEventListener('wheel', handleWheel)
      }
    }
  }, [])
  return (
    <>
      <Swiper
        ref={swiperRef}
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
            <SwiperSlide key={makeId()} className='mouse-wheel carousel-text'>
              <img
                src={slide.img}
                alt=''
                style={{
                  objectFit: 'cover',
                  height: 'calc(50vw)',
                  maxHeight: '600px',
                  minHeight: '300px',
                }}
                loading='lazy'
              />
              <span style={{ color: 'white' }} className='shadow-text'>
                {prefs.isEnglish ? slide.text.eng : slide.text.he}
              </span>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </>
  )
}
