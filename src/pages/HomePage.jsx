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
      title: 'Courts',
      link: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1731949255/DSC06197_vctg4k.jpg',
      text: {
        first: { he: 'מתחם טניס יוקרתי', eng: 'Luxury tennis complex' },
        second: { he: 'שלושה מגרשים', eng: 'Three courts' },
      },
    },
    {
      id: makeId(),
      title: 'Gym',
      link: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1731947256/DSC06048_risthm.jpg',
      text: {
        first: { he: 'חדר הכושר', eng: 'Our gym' },
        second: {
          he: 'חווית אימון אישית',
          eng: 'Personal training experience',
        },
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

  const preview = {
    eng: 'Join us for a year-round experience blending the thrill of winter sports with the warmth of summer family activities. From action-packed classes to serene leisure moments, we’re here to make every season memorable.',
    he: 'הצטרפו אלינו לחוויה ייחודית כל השנה, שמשלבת את הריגוש של ספורט החורף עם פעילויות קיץ לכל המשפחה. שיעורים מלאי אקשן לצד רגעים של רוגע ונחת - אנחנו כאן כדי להפוך כל עונה לבלתי נשכחת.',
  }

  const mouseWheelImgs = [
    {
      img: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1731947258/DSC06129_dxs8kb.jpg',
      text: {
        he: 'בריכה חצי אולימפית עם 7 מסלולי שחייה',
        eng: 'Semi-Olympic Pool - 7 Swimming Lanes',
      },
    },
    {
      img: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1731946217/DSC06063_bwttoj.jpg',
      text: {
        he: 'חדר כושר חדיש ומאובזר',
        eng: 'Modern and Fully Equipped Gym',
      },
    },
    {
      img: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1731947117/DSC06370_1_obeicj.jpg',
      text: {
        he: 'קהילת טניס מקצועית',
        eng: 'Professional Tennis Community',
      },
    },
    {
      img: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1731946647/DSC06225_pvjmhd.jpg',
      text: {
        he: 'סטודיו חוגים באווירה נעימה ואישית',
        eng: 'Personalized Studio Classes in a Pleasant Atmosphere',
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
        he: 'מתחם נינג׳ה, משחקים ומתנפחים לילדים',
        eng: 'Ninja Area, Games, and Inflatables for Kids',
      },
    },
    {
      img: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1731947762/DSC06140_txbg2f.jpg',
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
        {/* <img
          src='https://res.cloudinary.com/dnxi70mfs/image/upload/v1729002473/20_rjsrgf.jpg'
          alt=''
          className='background-img'
        /> */}

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
            <Link
              to={'/class/trainer'}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
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
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          style={{ cursor: 'pointer' }}
        >
          <HeadContainer
            text={{
              eng: '9 reasons to join us',
              he: '9 סיבות להצטרף למועדון הספורט',
            }}
          />
        </div>

        <MouseWheelCarousel imgs={mouseWheelImgs} />

        <ContactUs />
      </div>
    </section>
  )
}
