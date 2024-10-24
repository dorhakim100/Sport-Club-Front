import React from 'react'
import { useState, useEffect, userRef } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { Link, NavLink } from 'react-router-dom'

import { trainerService } from '../services/trainer/trainer.service.js'
import { makeId } from '../services/util.service.js'
import { loadTrainers } from '../store/actions/trainer.actions.js'

import { SwiperCarousel } from '../cmps/SwiperCarousel.jsx'
import { HeadContainer } from '../cmps/HeadContainer.jsx'

import { MouseWheelCarousel } from '../cmps/MouseWheelCarousel.jsx'
import { Cards } from '../cmps/Cards.jsx'
import { Updates } from '../cmps/Updates.jsx'
import { ContactUs } from '../cmps/ContactUs.jsx'

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { loadUpdates } from '../store/actions/update.actions.js'
import { updateService } from '../services/update/update.service.js'

export function HomePage() {
  const navigate = useNavigate()
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const schedule = useSelector(
    (stateSelector) => stateSelector.systemModule.schedule
  )
  const updates = useSelector(
    (stateSelector) => stateSelector.updateModule.updates
  )

  const imgs = [
    {
      id: makeId(),
      title: 'Pool',
      link: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1729002513/34_gdwu4o.jpg',
    },
    {
      id: makeId(),
      title: 'Flowers',
      link: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1729009146/picture_nhyvs7.jpg',
    },
    {
      id: makeId(),
      title: 'Mini Golf',
      link: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1729002702/DJI_0481_e3lubw.jpg',
    },
    {
      id: makeId(),
      title: 'Child Activity',
      link: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1729002559/HPIM0595_iiklas.jpg',
    },
  ]

  const [isUpdatesHover, setIsUpdatesHover] = useState(false)

  const trainers = useSelector(
    (stateSelector) => stateSelector.trainerModule.trainers
  )

  useEffect(() => {
    const getTrainers = async () => {
      const t = await loadTrainers(trainerService.getDefaultFilter())
    }
    const getUpdates = async () => {
      const u = await loadUpdates(updateService.getDefaultFilter())
    }
    getTrainers()
    getUpdates()
  }, [])
  return (
    <section className='home-container'>
      {/* <h2>Home sweet Home</h2> */}
      <SwiperCarousel imgs={imgs} />

      <div className='info-center-container'>
        <div className='schedule-container'>
          <Link
            to='class/schedule'
            className={prefs.isDarkMode ? 'dark' : ''}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
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
          <b>{prefs.isEnglish ? 'Our trainers' : 'המאמנים שלנו'}</b>
          <Cards trainers={trainers} />
        </div>
        <div
          className='updates-carousel-container'
          onMouseEnter={() => setIsUpdatesHover(true)}
          onMouseLeave={() => setIsUpdatesHover(false)}
        >
          <b>{prefs.isEnglish ? 'Updates' : 'עדכונים'}</b>
          <Updates isHover={isUpdatesHover} updates={updates} />
        </div>
      </div>
      <HeadContainer
        text={{
          eng: '9 reasons to join us',
          he: '9 סיבות להצטרף למועדון הספורט',
        }}
      />

      <MouseWheelCarousel />

      <ContactUs />
    </section>
  )
}
