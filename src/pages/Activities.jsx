import { NavLink, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { Nav } from '../cmps/Nav'
import { HeadContainer } from '../cmps/HeadContainer'
import { DynamicCover } from '../cmps/DynamicCover'
import { InstagramPost } from '../cmps/InstagramPost'
import { ActivityInfo } from '../cmps/ActivityInfo.jsx'
import { Cards } from '../cmps/Cards'
import { ContactUs } from '../cmps/ContactUs'

import Divider from '@mui/material/Divider'

import cover from '../../public/imgs/picture.jpg'
import { showErrorMsg } from '../services/event-bus.service'
import { loadTrainers } from '../store/actions/trainer.actions'
import { trainerService } from '../services/trainer/trainer.service'

const animation = () => {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)

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
}
export function Activities() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  const location = useLocation()

  const origin = {
    path: '/activities',
    he: 'פעילויות במועדון',
    eng: 'Activities',
  }

  const links = [
    {
      path: 'swimming',
      he: 'בית הספר לשחייה',
      eng: 'Swimming School',
      icon: '/imgs/swimming.svg', // Updated path
      darkIcon: '/imgs/swimming-dark.svg',
    },
    {
      path: 'tennis',
      he: 'בית הספר לטניס',
      eng: 'Tennis School',
      icon: '/imgs/tennis.svg',
      darkIcon: '/imgs/tennis-dark.svg',
    },
    {
      path: 'pilates',
      he: 'פילאטיס מכשירים',
      eng: 'Reformer Pilates',
      icon: '/imgs/pilates.svg',
      darkIcon: '/imgs/pilates-dark.svg',
    },
    {
      path: 'care',
      he: 'מרכז הטיפולים',
      eng: 'Care',
      icon: '/imgs/care.svg',
      darkIcon: '/imgs/care-dark.svg',
    },
    {
      path: 'camp',
      he: 'קייטנת הקיץ',
      eng: 'Summer Camp',
      icon: '/imgs/camp.svg',
      darkIcon: '/imgs/camp-dark.svg',
    },
    {
      path: 'restaurant',
      he: 'שף הכפר',
      eng: 'Restaurant',
      icon: '/imgs/restaurant.svg',
      darkIcon: '/imgs/restaurant-dark.svg',
    },
  ]

  const head = {
    he: 'הפעילויות שלנו',
    eng: 'Our Activities',
  }

  return (
    <section className='activities-page-container'>
      <h2>{prefs.isEnglish ? 'Activities' : 'פעילויות במועדון'}</h2>
      <Nav origin={origin} links={links} isMain={true} />

      <section>
        {/* {location.pathname === '/activities' && <HeadContainer text={head} />} */}
        <Outlet />
      </section>
      <ContactUs />
    </section>
  )
}

export function Swimming() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)

  const headText = { he: 'בית הספר לשחייה', eng: 'Swimming School' }
  const instagram =
    'https://www.instagram.com/reel/DBRbR0WObHd/?utm_source=ig_web_copy_link'

  const options = {
    img: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1729002409/partush_051214_-_5_so0d8s.jpg',

    title: { he: 'H2o', eng: 'H2o' },
    preview: {
      he: `ברוכים הבאים לבית הספר לשחייה שלנו, בו כל תלמיד יכול ללמוד לשחות בביטחון! בין אם אתם מתחילים או מתאמנים לרמת שחייה מתקדמת, המדריכים המנוסים שלנו מציעים ליווי אישי בסביבה בטוחה ומעודדת. הצטרפו למגוון התכניות שלנו, כולל שיעורי מתחילים, שיפור סגנון ושחייה מתקדמת. השיעורים שלנו מתוכננים כדי לעזור לשחיינים מכל הגילאים להתקדם בקצב שלהם ולהנות מהמסע. הצטרפו אלינו ותחוו את השמחה שבשחייה!
        
        `,
      eng: `Welcome to our swimming school, where every student can learn to swim with confidence! Whether you're a beginner or training for advanced skills, our experienced instructors provide personalized guidance in a safe and encouraging environment. Dive into our range of programs, including beginner classes, stroke improvement, and advanced techniques. Our lessons are structured to help swimmers of all ages progress at their own pace, ensuring everyone enjoys the journey. Join us and experience the joy of swimming!`,
    },
  }

  const [trainers, setTrainers] = useState([])

  animation()

  useEffect(() => {
    const loadSwimmingTrainers = async () => {
      try {
        const filter = trainerService.getDefaultFilter()

        const t = await loadTrainers({ ...filter, types: ['swimming'] })
        setTrainers(t)
      } catch (err) {
        showErrorMsg(
          prefs.isEnglish
            ? `Couldn't load trainers`
            : 'לא היה ניתן לטעון מאמנים'
        )
      }
    }
    loadSwimmingTrainers()
  }, [])

  return (
    <div className='swimming-container'>
      <HeadContainer text={headText} />
      <DynamicCover prefs={prefs} coverSrc={options.img} />
      <div className='information-container'>
        <ActivityInfo options={options} />
      </div>
      <div className='trainers-social-container'>
        <div className='cards-container section hidden'>
          <Cards trainers={trainers} />
          <span>{prefs.isEnglish ? 'Swimming Trainers' : 'מדריכי השחייה'}</span>
        </div>
        <div className='instagram-container section hidden'>
          <InstagramPost postUrl={instagram} />
        </div>
      </div>
    </div>
  )
}

export function Tennis() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)

  const headText = { he: 'בית הספר לטניס', eng: 'Tennis School' }
  return (
    <div className='tennis-container'>
      <HeadContainer text={headText} />
      {/* <DynamicCover prefs={prefs} coverSrc={options.img} /> */}
    </div>
  )
}

export function Pilates() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)

  const headText = { he: 'פילאטיס מכשירים', eng: 'Reformer Pilates' }

  const options = {
    img: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1732027475/WhatsApp_Image_2024-11-19_at_15.24.47_ihj8yf.jpg',

    title: { he: 'סטודיו מיטל תמיר', eng: 'Meital Tamir Studio' },
    preview: {
      he: `ברוכים הבאים לבית הספר לשחייה שלנו, בו כל תלמיד יכול ללמוד לשחות בביטחון! בין אם אתם מתחילים או מתאמנים לרמת שחייה מתקדמת, המדריכים המנוסים שלנו מציעים ליווי אישי בסביבה בטוחה ומעודדת. הצטרפו למגוון התכניות שלנו, כולל שיעורי מתחילים, שיפור סגנון ושחייה מתקדמת. השיעורים שלנו מתוכננים כדי לעזור לשחיינים מכל הגילאים להתקדם בקצב שלהם ולהנות מהמסע. הצטרפו אלינו ותחוו את השמחה שבשחייה!
      
      `,
      eng: `Welcome to our swimming school, where every student can learn to swim with confidence! Whether you're a beginner or training for advanced skills, our experienced instructors provide personalized guidance in a safe and encouraging environment. Dive into our range of programs, including beginner classes, stroke improvement, and advanced techniques. Our lessons are structured to help swimmers of all ages progress at their own pace, ensuring everyone enjoys the journey. Join us and experience the joy of swimming!`,
    },
  }
  const instagram =
    'https://www.instagram.com/meitaltamir_studio?igsh=OGppbjJmZmlsNnB5&utm_source=qr'

  animation()

  return (
    <div className='pilates-container'>
      <HeadContainer text={headText} />
      <DynamicCover prefs={prefs} coverSrc={options.img} />
      <div className='information-container'>
        <ActivityInfo options={options} />
      </div>
      <div className='trainers-social-container'>
        <div className='section'>
          <div className='img-container hidden'>
            <img
              src='https://res.cloudinary.com/dnxi70mfs/image/upload/v1732027729/WhatsApp_Image_2024-11-19_at_15.24.46_2_vj7jvc.jpg'
              alt='Meital'
            />
          </div>
        </div>
        <div className='section'>
          <div className='text-container hidden'>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam
              illo exercitationem placeat, deleniti incidunt cum nam excepturi
              similique ducimus iusto eveniet ratione est fuga minus sapiente
              repellendus laudantium quis ex?
            </p>
          </div>
        </div>
        <div className='instagram-container section hidden'>
          <b>
            {prefs.isEnglish ? 'Follow me on Instagram' : 'עקבו אחרי באינסטגרם'}
          </b>
          <InstagramPost postUrl={instagram} />
        </div>
      </div>
    </div>
  )
}

export function Care() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)

  const headText = { he: 'מרכז הטיפולים', eng: 'Care' }
  return (
    <div className='care-container'>
      <HeadContainer text={headText} />
    </div>
  )
}

export function SummerCamp() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  const headText = { he: 'קייטנת הקיץ', eng: 'Summer Camp' }
  return (
    <div className='care-container'>
      <HeadContainer text={headText} />
    </div>
  )
}

export function Restaurant() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  const headText = { he: 'שף הכפר', eng: 'Restaurant' }
  return (
    <div className='restaurant-container'>
      <HeadContainer text={headText} />
    </div>
  )
}
