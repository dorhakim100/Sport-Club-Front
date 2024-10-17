import { useState, useEffect, userRef } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { Link, NavLink } from 'react-router-dom'

import { SwiperCarousel } from '../cmps/SwiperCarousel.jsx'

import React from 'react'
import { makeId } from '../services/util.service.js'
import { MouseWheelCarousel } from '../cmps/MouseWheelCarousel.jsx'
import { Cards } from '../cmps/Cards.jsx'
import { Updates } from '../cmps/Updates.jsx'
import { ContactUs } from '../cmps/ContactUs.jsx'

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

export function HomePage() {
  const navigate = useNavigate()
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const schedule = useSelector(
    (stateSelector) => stateSelector.systemModule.schedule
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
          <Cards />
        </div>
        <div
          className='updates-container'
          onMouseEnter={() => setIsUpdatesHover(true)}
          onMouseLeave={() => setIsUpdatesHover(false)}
        >
          <b>{prefs.isEnglish ? 'Updates' : 'עדכונים'}</b>
          <Updates isHover={isUpdatesHover} />
        </div>
      </div>
      <div className='head-container'>
        <h3>
          <span
            style={
              prefs.isDarkMode
                ? { backgroundColor: '#2C3E50' }
                : { backgroundColor: '#F5F5F5' }
            }
          >
            {prefs.isEnglish
              ? '9 reasons to join us'
              : '9 סיבות להצטרף למועדון הספורט'}
          </span>
        </h3>
      </div>
      <MouseWheelCarousel />

      <ContactUs />
    </section>
  )
}
