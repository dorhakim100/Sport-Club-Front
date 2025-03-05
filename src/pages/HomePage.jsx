import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'

import { trainerService } from '../services/trainer/trainer.service.js'
import { smoothScroll, textAnimation } from '../services/util.service.js'
import { loadTrainers } from '../store/actions/trainer.actions.js'
import { loadUpdates } from '../store/actions/update.actions.js'
import { updateService } from '../services/update/update.service.js'
import { setIsLoading } from '../store/actions/system.actions.js'
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
    textAnimation(prefs)
  }, [prefs.isEnglish, prefs.isDarkMode])

  const navigateToClass = (event) => {
    // support for safari browsers
    event.preventDefault() // Stop the link from navigating immediately
    smoothScroll()

    setTimeout(() => {
      navigate('/class')
    }, 300) // Adjust time based on your smoothScroll timing
  }
  const navigateToFacilities = (event) => {
    // support for safari browsers
    event.preventDefault() // Stop the link from navigating immediately
    smoothScroll()

    setTimeout(() => {
      navigate('/facilities')
    }, 300) // Adjust time based on your smoothScroll timing
  }
  const navigateToUpdates = (event) => {
    // support for safari browsers
    event.preventDefault() // Stop the link from navigating immediately
    smoothScroll()

    setTimeout(() => {
      navigate('/update')
    }, 300) // Adjust time based on your smoothScroll timing
  }
  const navigateToTrainers = (event) => {
    // support for safari browsers
    event.preventDefault() // Stop the link from navigating immediately
    smoothScroll()

    setTimeout(() => {
      navigate('/class/trainer')
    }, 300) // Adjust time based on your smoothScroll timing
  }

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
          className={
            prefs.isEnglish
              ? 'text-container shadow-text'
              : 'text-container rtl shadow-text'
          }
        >
          <h2>
            {prefs.isEnglish
              ? 'Sport Club kfar Shmaryahu'
              : 'מועדון הספורט כפר שמריהו'}
          </h2>

          <h2>
            {prefs.isEnglish
              ? 'Your choice for the good life'
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
            onClick={navigateToClass}
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
            <b
              onClick={navigateToTrainers}
              className={prefs.isDarkMode ? 'dark-mode' : ''}
            >
              {prefs.isEnglish ? 'Our trainers' : 'המאמנים שלנו'}
            </b>
            <Cards trainers={trainers} />
          </div>
          <div className='updates-carousel-container'>
            <b>{prefs.isEnglish ? 'Updates' : 'עדכונים'}</b>
            <Updates updates={updates} navigateToUpdates={navigateToUpdates} />
          </div>
        </div>

        <div
          className='reasons-header clickable'
          onClick={navigateToFacilities}
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
