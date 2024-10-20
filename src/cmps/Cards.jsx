import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/effect-cards'

// import required modules
import { EffectCards, Navigation } from 'swiper/modules'

export function Cards({ trainers }) {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const navigate = useNavigate()
  console.log(trainers)
  return (
    <>
      <Swiper
        effect={'cards'}
        grabCursor={true}
        modules={[EffectCards, Navigation]}
        className='cards'
        style={{ width: '300px', height: '300px', margin: '0px' }}
        navigation={true}
      >
        {trainers.map((trainer) => {
          return (
            <SwiperSlide
              style={{ borderRadius: '15px' }}
              key={`${trainer._id}Card`}
            >
              <div
                className='card-container'
                onClick={() => {
                  navigate(`/class/trainer/${trainer._id}`)
                }}
              >
                <div className='gradient-container'></div>
                <img src={trainer.img} alt='' srcset='' />{' '}
                <span>
                  {prefs.isEnglish ? trainer.name.eng : trainer.name.he}
                </span>
              </div>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </>
  )
}
