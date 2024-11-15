import React, { useState } from 'react'
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
  const [swiperInstance, setSwiperInstance] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <>
      <Swiper
        effect={'cards'}
        grabCursor={true}
        modules={[EffectCards, Navigation]}
        className='cards'
        style={{
          width: '275px',
          height: '275px',
          margin: '0px',
          direction: 'rtl',
        }}
        navigation={true}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        onSwiper={(swiper) => setSwiperInstance(swiper)} // Save the Swiper instance
      >
        {trainers.map((trainer, index) => {
          const isFocused = activeIndex === index

          return (
            <SwiperSlide
              style={{ borderRadius: '15px' }}
              key={`${trainer._id}Card`}
            >
              <div
                className='card-container'
                onClick={() => {
                  if (isFocused) {
                    // Navigate if the card is already focused
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                    navigate(`/class/trainer/${trainer._id}`)
                  } else {
                    // Focus on the card
                    swiperInstance?.slideTo(index)
                  }
                }}
              >
                <div className='gradient-container'></div>
                <img src={trainer.img} alt='' />{' '}
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
