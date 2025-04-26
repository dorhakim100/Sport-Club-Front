import React from 'react'
import { useRef, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'
import { getWindowDimensions } from '../services/util.service'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules'

export function Updates({ updates, navigateToUpdates }) {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const navigate = useNavigate()

  const progressCircle = useRef(null)
  const progressContent = useRef(null)
  const onAutoplayTimeLeft = (s, time, progress) => {
    progressCircle.current.style.setProperty('--progress', 1 - progress)
    progressContent.current.textContent = `${Math.ceil(time / 1000)}s`
  }

  const swiperRef = useRef()

  const [width, setWidth] = useState()

  useEffect(() => {
    setWidth(getWindowDimensions().width)
  }, [window.innerWidth])

  return (
    <>
      <Swiper
        ref={swiperRef}
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 5000,
          //   disableOnInteraction: true,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
        }}
        // navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        onAutoplayTimeLeft={onAutoplayTimeLeft}
        className={
          prefs.isDarkMode ? 'updates-carousel dark-mode' : 'updates-carousel'
        }
        style={{ height: '100px', direction: 'rtl' }}
      >
        {updates.map((update) => {
          return (
            <SwiperSlide
              className={
                prefs.isDarkMode ? 'update-banner dark-mode' : 'update-banner'
              }
              key={update._id}
              onClick={navigateToUpdates}
            >
              <div className='title-container'>
                <b>{update.title}</b>
                <span>
                  {prefs.isEnglish
                    ? new Date(update.createdAt).toLocaleDateString('eng')
                    : new Date(update.createdAt).toLocaleDateString('he')}
                </span>
              </div>
              <div className='update-content-container'>
                <p className={width <= 800 ? 'mobile' : ''}>{update.content}</p>

                <span className='read-more'>
                  {prefs.isEnglish ? 'Read more...' : 'קרא עוד...'}
                </span>
              </div>
            </SwiperSlide>
          )
        })}

        <div
          className={
            prefs.isDarkMode
              ? 'autoplay-progress dark-mode'
              : 'autoplay-progress'
          }
          slot='container-end'
        >
          <svg viewBox='0 0 48 48' ref={progressCircle}>
            <circle cx='24' cy='24' r='20'></circle>
          </svg>
          <span ref={progressContent}></span>
        </div>
      </Swiper>
    </>
  )
}
