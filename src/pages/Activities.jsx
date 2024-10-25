import { NavLink, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { Nav } from '../cmps/Nav'
import { HeadContainer } from '../cmps/HeadContainer'

import Divider from '@mui/material/Divider'

export function Activities() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)

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
    },
    {
      path: 'tennis',
      he: 'בית הספר לטניס',
      eng: 'Tennis School',
    },
    {
      path: 'pilates',
      he: 'פילאטיס מכשירים',
      eng: 'Reformer Pilates',
    },
    {
      path: 'care',
      he: 'מרכז הטיפולים',
      eng: 'Care',
    },
    {
      path: 'camp',
      he: 'קייטנת הקיץ',
      eng: 'Summer Camp',
    },
    {
      path: 'restaurant',
      he: 'שף הכפר',
      eng: 'Restaurant',
    },
  ]

  return (
    <section className='activities-page-container'>
      <h2>{prefs.isEnglish ? 'Activities' : 'פעילויות במועדון'}</h2>
      <Nav origin={origin} links={links} />

      <section>
        <Outlet />
      </section>
    </section>
  )
}

export function Swimming() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)

  const headText = { he: 'בית הספר לשחייה', eng: 'Swimming School' }
  return (
    <div className='swimming-container'>
      <HeadContainer text={headText} />
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
