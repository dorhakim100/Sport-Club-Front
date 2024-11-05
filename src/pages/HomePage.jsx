import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'

import { trainerService } from '../services/trainer/trainer.service.js'
import { makeId } from '../services/util.service.js'
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

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

export function HomePage() {
  const navigate = useNavigate()
  const prefs = useSelector((state) => state.systemModule.prefs)
  const trainers = useSelector((state) => state.trainerModule.trainers)
  const updates = useSelector((state) => state.updateModule.updates)

  const [isUpdatesHover, setIsUpdatesHover] = useState(false)

  const imgs = [
    {
      id: makeId(),
      title: 'Pool',
      link: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1729002513/34_gdwu4o.jpg',
      text: {
        first: { he: 'בריכה חצי אולימפית', eng: 'Half Olympic Pool' },
        second: { he: 'שבעה מסלולי שחייה', eng: 'Seven swimming lanes' },
      },
    },
    {
      id: makeId(),
      title: 'Flowers',
      link: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1729009146/picture_nhyvs7.jpg',
      text: {
        first: { he: 'מתחם טניס יוקרתי', eng: 'Luxury tennis complex' },
        second: { he: 'שלושה מגרשים', eng: 'Three courts' },
      },
    },
    {
      id: makeId(),
      title: 'Mini Golf',
      link: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1729002702/DJI_0481_e3lubw.jpg',
      text: {
        first: { he: 'מתחם מיני גולף', eng: 'Mini golf area' },
        second: { he: 'מתאים לכל הגילאים', eng: 'Suitable for all ages' },
      },
    },
    {
      id: makeId(),
      title: 'Child Activity',
      link: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1729002559/HPIM0595_iiklas.jpg',
      text: {
        first: { he: 'פעילויות קיץ לילדים', eng: 'Summer activities for kids' },
        second: {
          he: 'מתנפחים ומתחמי משחק',
          eng: 'Inflatables and play areas',
        },
      },
    },
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        await loadTrainers(trainerService.getDefaultFilter())
        await loadUpdates(updateService.getDefaultFilter())
      } catch (err) {
        showErrorMsg(
          prefs.isEnglish ? `Couldn't load data` : 'טעינת נתונים נכשלה'
        )
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [prefs.isEnglish])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(prefs.isEnglish ? 'show' : 'show-rtl')
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
        className={`main-header-container section hidden ${
          !prefs.isEnglish && 'rtl'
        }`}
      >
        <div
          className={prefs.isEnglish ? 'text-container' : 'text-container rtl'}
        >
          <h2>
            {prefs.isEnglish
              ? 'Sports and Action in Winter, Family Experience in Summer'
              : 'נופש משפחתי בקיץ, אקשן בחורף'}
          </h2>
          <h2>
            {prefs.isEnglish
              ? 'A Year-Round Sports and Leisure Club'
              : 'מועדון ספורט אחד כל השנה'}
          </h2>
        </div>
      </div>

      <div className='home-carousel'>
        <SwiperCarousel imgs={imgs} />
      </div>

      <div
        className={`info-center-container section hidden ${
          !prefs.isEnglish && 'rtl'
        }`}
      >
        <div className='schedule-container'>
          <Link
            to='class'
            className={prefs.isDarkMode ? 'dark' : ''}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
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
