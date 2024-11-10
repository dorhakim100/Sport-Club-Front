import { NavLink, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

import { Nav } from '../cmps/Nav'
import { HeadContainer } from '../cmps/HeadContainer'
import { InstagramPost } from '../cmps/InstagramPost'

import Divider from '@mui/material/Divider'

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

  console.log(location)

  return (
    <section className='activities-page-container'>
      <h2>{prefs.isEnglish ? 'Activities' : 'פעילויות במועדון'}</h2>
      <Nav origin={origin} links={links} isMain={true} />

      <section>
        {location.pathname === '/activities' && <HeadContainer text={head} />}
        <Outlet />
      </section>
    </section>
  )
}

export function Swimming() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)

  const headText = { he: 'בית הספר לשחייה', eng: 'Swimming School' }
  const instagram =
    'https://www.instagram.com/reel/DBRbR0WObHd/?utm_source=ig_web_copy_link'
  return (
    <div className='swimming-container'>
      <HeadContainer text={headText} />
      <InstagramPost postUrl={instagram} />
    </div>
  )
}

export function Tennis() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)

  const headText = { he: 'בית הספר לטניס', eng: 'Tennis School' }
  return (
    <div className='tennis-container'>
      <HeadContainer text={headText} />
    </div>
  )
}

export function Pilates() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)

  const headText = { he: 'פילאטיס מכשירים', eng: 'Reformer Pilates' }
  return (
    <div className='pilates-container'>
      <HeadContainer text={headText} />
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
