import { NavLink, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { HeadContainer } from '../cmps/HeadContainer'

import Divider from '@mui/material/Divider'

export function Activities() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  return (
    <section className='activities-page-container'>
      <h2>{prefs.isEnglish ? 'Activities' : 'פעילויות במועדון'}</h2>
      <nav className='page-navigation-container'>
        <NavLink to='/activities'>
          {prefs.isEnglish ? 'Activities' : 'פעילויות במועדון'}
        </NavLink>
        <Divider orientation='vertical' flexItem />
        <NavLink to='swimming'>
          {prefs.isEnglish ? 'Swimming School' : 'בית הספר לשחייה'}
        </NavLink>
        <Divider orientation='vertical' flexItem />
        <NavLink to='tennis'>
          {prefs.isEnglish ? 'Tennis School' : 'בית הספר לטניס'}
        </NavLink>
        <Divider orientation='vertical' flexItem />
        <NavLink to='care'>
          {prefs.isEnglish ? 'Care' : 'מרכז הטיפולים'}
        </NavLink>
        <Divider orientation='vertical' flexItem />
        <NavLink to='camp'>
          {prefs.isEnglish ? 'Summer Camp' : 'קייטנת הקיץ'}
        </NavLink>
        <Divider orientation='vertical' flexItem />

        <NavLink to='restaurant'>
          {prefs.isEnglish ? 'Restaurant' : 'שף הכפר'}
        </NavLink>
      </nav>

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
