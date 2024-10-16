import { NavLink, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

import Divider from '@mui/material/Divider'

export function Activities() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  return (
    <section className='activities-page-container'>
      <h2>{prefs.isEnglish ? 'Activities' : 'פעילויות במועדון'}</h2>
      <nav className='page-navigation-container'>
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

  return (
    <div className='swimming-container'>
      <h3> {prefs.isEnglish ? 'Swimming School' : 'בית הספר לשחייה'}</h3>
    </div>
  )
}

export function Tennis() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)

  return (
    <div className='tennis-container'>
      <h3> {prefs.isEnglish ? 'Tennis School' : 'בית הספר לטניס'}</h3>
    </div>
  )
}

export function Care() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)

  return (
    <div className='care-container'>
      <h3> {prefs.isEnglish ? 'Care' : 'מרכז הטיפולים'}</h3>
    </div>
  )
}

export function SummerCamp() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  return (
    <div className='care-container'>
      <h3> {prefs.isEnglish ? 'Summer Camp' : 'קייטנת הקיץ'}</h3>
    </div>
  )
}

export function Restaurant() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  return (
    <div className='restaurant-container'>
      <h3> {prefs.isEnglish ? 'Restaurant' : 'שף הכפר'}</h3>
    </div>
  )
}
