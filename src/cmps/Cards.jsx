import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { Swiper, SwiperSlide } from 'swiper/react'
import { smoothScroll } from '../services/util.service'

import 'swiper/css'
import 'swiper/css/effect-cards'

import { EffectCards, Navigation } from 'swiper/modules'

export function Cards({ trainers }) {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const navigate = useNavigate()
  const [swiperInstance, setSwiperInstance] = useState([])
  const [activeIndex, setActiveIndex] = useState(0)

  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  )

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions())
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [windowDimensions])

  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window

    return {
      width,
      height,
    }
  }

  const navigateToTrainer = (trainerId) => {
    // support for safari browsers
    event.preventDefault() // Stop the link from navigating immediately
    smoothScroll()

    setTimeout(() => {
      navigate(`/class/trainer/${trainerId}`)
    }, 300) // Adjust time based on your smoothScroll timing
  }

  return (
    <>
      <Swiper
        effect={'cards'}
        grabCursor={true}
        modules={[EffectCards, Navigation]}
        className='cards'
        style={{
          width: windowDimensions.width >= 1050 ? '400px' : '275px',
          height: windowDimensions.width >= 1050 ? '400px' : '275px',
          margin: '0px',
          direction: 'rtl',
        }}
        navigation={true}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.activeIndex)
        }}
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
                    navigateToTrainer(trainer._id)
                  } else {
                    // Focus on the card
                    swiperInstance?.slideTo(index)
                  }
                }}
              >
                <div
                  className='gradient-container'
                  style={{
                    width: windowDimensions.width >= 1050 ? '400px' : '275px',
                    height: windowDimensions.width >= 1050 ? '400px' : '275px',
                  }}
                ></div>
                <img
                  src={trainer.img}
                  alt=''
                  style={{
                    width: windowDimensions.width >= 1050 ? '400px' : '275px',
                    height: windowDimensions.width >= 1050 ? '400px' : '275px',
                  }}
                />{' '}
                <span className='shadow-text'>
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
