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
      link: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1734352231/34_gdwu4o.jpg',
      text: {
        first: { he: 'בריכה חצי אולימפית', eng: 'Half Olympic Pool' },
        second: {
          he: 'מחוממת ומקורה, פעילה בכל ימות השנה',
          eng: 'Heated and covered, active all year round',
        },
      },
    },
    {
      id: makeId(),
      title: 'Gym',
      link: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1734352231/DSC06048_risthm_r8f74a.jpg',
      text: {
        first: { he: 'חדר הכושר', eng: 'Our gym' },
        second: {
          he: 'ציוד מתקדם, יחס אישי',
          eng: 'Advanced equipment, personalized attention',
        },
      },
    },
    {
      id: makeId(),
      title: 'Courts',
      link: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1734352231/DSC06197_vctg4k_vqbkyd.jpg',
      text: {
        first: { he: 'מתחם מגרשי טניס', eng: 'Tennis complex' },
        second: { he: 'הכולל שלושה מגרשים', eng: 'Three courts' },
      },
    },
    {
      id: makeId(),
      title: 'Studio',
      link: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1734352231/DSC06024_rr6o6a_rh7xya.jpg',
      text: {
        first: { he: 'סטודיו לחוגים', eng: 'Class studio' },
        second: { he: 'בקבוצות קטנות', eng: 'Small and personal groups' },
      },
    },
    {
      id: makeId(),
      title: 'Child Activity',
      link: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1734352230/HPIM0595_iiklas.jpg',
      text: {
        first: { he: 'פעילויות לילדים', eng: 'Activities for kids' },
        second: {
          he: 'קייטנות מתחמי משחק והפעלות',
          eng: 'Summer camp, play areas for kids',
        },
      },
    },
  ]

  const preview = {
    eng: `The Kfar Shmaryahu Sport and Leisure Club is located in the heart of the village, surrounded by greenery and trees that blend the site with nature and pastoral tranquility.

    The club serves a limited number of members, making it unique and an ideal meeting point for families for recreation, leisure, and sports.
    
    The club offers a variety of activities for all ages, including children's activities, shared family activities, and even unique programs for seniors.`,
    he: `מועדון ספורט ונופש כפר שמריהו ממוקם בלב הכפר. מוקף בירק ובעצים הממזגים את המקום עם טבע ושלווה פסטורלית. המועדון משרת מספר מצומצם של מנויים, דבר ההופך
    אותו ליחודי ולנקודת מפגש אידיאלית למשפחות למטרות בילוי, נופש וספורט. המועדון מקיים מגוון פעילויות לכל הגילאים כולל פעילויות ילדים, פעילויות משותפות לכל המשפחה
    ואף פעילויות ייחודיות לגיל הזהב.`,
  }

  const mouseWheelImgs = [
    {
      img: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1731947258/DSC06129_dxs8kb.jpg',
      text: {
        he: 'בריכה חצי אולימפית, מחוממת ומקורה',
        eng: 'Semi-Olympic Pool - 7 Swimming Lanes',
      },
    },
    {
      img: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1731946217/DSC06063_bwttoj.jpg',
      text: {
        he: 'חדר כושר חדיש ומאובזר, אימונים באווירה אישית',
        eng: 'Modern and Fully Equipped Gym',
      },
    },
    {
      img: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1731947117/DSC06370_1_obeicj.jpg',
      text: {
        he: 'בית ספר לטניס',
        eng: 'Tennis school',
      },
    },
    {
      img: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1731946647/DSC06225_pvjmhd.jpg',
      text: {
        he: 'סטודיו חוגים בקבוצות קטנות',
        eng: 'Personalized Studio Classes',
      },
    },
    {
      img: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1731946648/DSC06537_guaopk.jpg',
      text: {
        he: 'מתחם מיני גולף עם 8 מסלולים',
        eng: 'Mini Golf Area with 8 Tracks',
      },
    },
    {
      img: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1731946217/DSC06444_pmpgpf.jpg',
      text: {
        he: 'מגרש סנוקרגל ייחודי ומהנה',
        eng: 'Unique and Fun Snookball Court',
      },
    },
    {
      img: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1731946219/DSC06189_yuuula.jpg',
      text: {
        he: 'מסעדה באווירה כפרית',
        eng: 'Charming Restaurant with a Rustic Atmosphere',
      },
    },
    {
      img: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1731946219/DSC06487_nuowb1.jpg',
      text: {
        he: 'מתחם נינג׳ה, משחקים והפעלות לילדים',
        eng: 'Ninja Area, Games, and activities for Kids',
      },
    },
    {
      img: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1733484121/45_shdnag_1_y1sfqo.jpg',
      text: {
        he: 'בריכת פעוטות מקורה',
        eng: 'Covered Toddler Pool',
      },
    },
    {
      img: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1732274704/DSC09047_gxxqfy.jpg',
      text: {
        he: 'חניה גדולה, נוחה וללא תשלום',
        eng: 'Large, Convenient, and Free Parking Lot',
      },
    },
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const t = await loadTrainers({
          ...trainerService.getDefaultFilter(),
          isRandom: true,
        })
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
        }`}
      >
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
          <SwiperCarousel imgs={imgs} />
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
          <div
            className='updates-carousel-container'
            onMouseEnter={() => setIsUpdatesHover(true)}
            onMouseLeave={() => setIsUpdatesHover(false)}
          >
            <b>{prefs.isEnglish ? 'Updates' : 'עדכונים'}</b>
            <Updates isHover={isUpdatesHover} updates={updates} />
          </div>
        </div>

        <div
          className='reasons-header'
          onClick={() => {
            navigate('/facilities')
            smoothScroll()
          }}
          style={{ cursor: 'pointer' }}
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
