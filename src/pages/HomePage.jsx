import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'

import { trainerService } from '../services/trainer/trainer.service.js'
import { makeId, smoothScroll } from '../services/util.service.js'
import { loadTrainers } from '../store/actions/trainer.actions.js'
import { loadUpdates } from '../store/actions/update.actions.js'
import { updateService } from '../services/update/update.service.js'
import {
  setIsLoading,
  setIsModal,
  setIsPrefs,
  setModalMessage,
  setPrefs,
} from '../store/actions/system.actions.js'
import { showErrorMsg } from '../services/event-bus.service.js'

import { SwiperCarousel } from '../cmps/SwiperCarousel.jsx'
import { HeadContainer } from '../cmps/HeadContainer.jsx'
import { MouseWheelCarousel } from '../cmps/MouseWheelCarousel.jsx'
import { Cards } from '../cmps/Cards.jsx'
import { Updates } from '../cmps/Updates.jsx'
import { ContactUs } from '../cmps/ContactUs.jsx'

import dumbbells from '/public/imgs/yoga.svg'
import dumbbellsDarkMode from '/public/imgs/yoga-dark-mode.svg'

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

import mouseWheelImgs from '/public/jsons/HomePage/MouseWheel/MouseWheel.json'
import carouselImgs from '/public/jsons/HomePage/Carousel/Carousel.json'
import preview from '/public/jsons/HomePage/Preview/Preview.json'

export function HomePage() {
  const navigate = useNavigate()
  const prefs = useSelector((state) => state.systemModule.prefs)
  const trainers = useSelector((state) => state.trainerModule.trainers)
  const updates = useSelector((state) => state.updateModule.updates)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [trainers, updates] = await Promise.all([
          loadTrainers({
            ...trainerService.getDefaultFilter(),
            isRandom: true,
          }),
          loadUpdates(updateService.getDefaultFilter()),
        ])
      } catch (err) {
        showErrorMsg(
          prefs.isEnglish ? "Couldn't load data" : 'טעינת נתונים נכשלה'
        )
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [prefs.isEnglish])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          const timeout = index + 1
          setTimeout(() => {
            entry.target.classList.add(prefs.isEnglish ? 'show' : 'show-rtl')
          }, 300)
          // entry.target.classList.remove('hidden')
        } else {
          entry.target.classList.remove(prefs.isEnglish ? 'show' : 'show-rtl')
        }
      })
    })

    const elements = document.querySelectorAll('.section')
    elements.forEach((el) => observer.observe(el))

    return () => elements.forEach((el) => observer.unobserve(el))
  }, [prefs.isEnglish])

  return (
    <section className='home-container'>
      <div
        className={`main-header-container background-img section hidden ${
          !prefs.isEnglish && 'rtl'
        } `}
      >
        <div
          className={`gradient-container ${prefs.isDarkMode && 'dark-mode'}`}
        ></div>
        <div
          className={prefs.isEnglish ? 'text-container' : 'text-container rtl'}
        >
          <h2>
            {prefs.isEnglish
              ? 'Sport Club kfar Shmaryahu'
              : 'מועדון הספורט כפר שמריהו'}
          </h2>

          <h2>
            {prefs.isEnglish
              ? 'Your choise for the good life'
              : 'הבחירה שלכם לחיים הטובים'}
          </h2>

          <p>{prefs.isEnglish ? preview.eng : preview.he}</p>
        </div>
      </div>

      <div className='home-content-container'>
        <div
          className={`section hidden ${
            !prefs.isEnglish && 'rtl'
          } text-container`}
        ></div>
        <div className='home-carousel'>
          <SwiperCarousel imgs={carouselImgs} />
        </div>

        <div
          className={`info-center-container section hidden ${
            !prefs.isEnglish && 'rtl'
          }`}
        >
          <div
            className='arrow-link-container schedule'
            onClick={() => {
              smoothScroll()
              navigate('/class')
            }}
          >
            <img
              src={prefs.isDarkMode ? dumbbellsDarkMode : dumbbells}
              alt=''
            />
            <Link
              to='class'
              className={prefs.isDarkMode ? 'dark' : ''}
              onClick={smoothScroll}
            >
              {prefs.isEnglish ? 'Our classes' : 'השיעורים שלנו'}
              {prefs.isEnglish ? (
                <ArrowForwardIosIcon className='arrow right' />
              ) : (
                <ArrowBackIosNewIcon className='arrow left' />
              )}
            </Link>
          </div>
          <div className='cards-container'>
            <Link
              to={'/class/trainer'}
              onClick={() => smoothScroll()}
              className={prefs.isDarkMode ? 'dark-mode' : ''}
            >
              {prefs.isEnglish ? 'Our trainers' : 'המאמנים שלנו'}
            </Link>
            <Cards trainers={trainers} />
          </div>
          <div className='updates-carousel-container'>
            <b>{prefs.isEnglish ? 'Updates' : 'עדכונים'}</b>
            <Updates updates={updates} />
          </div>
        </div>

        <div
          className='reasons-header clickable'
          onClick={() => {
            navigate('/facilities')
            smoothScroll()
          }}
        >
          <HeadContainer
            text={{
              eng: '10 reasons to join us',
              he: '10 סיבות להצטרף למועדון הספורט',
            }}
          />
        </div>

        <MouseWheelCarousel imgs={mouseWheelImgs} />

        <ContactUs />
      </div>
    </section>
  )
}
