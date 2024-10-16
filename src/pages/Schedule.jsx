import React, { useState } from 'react'
import { NavLink, Link, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Divider from '@mui/material/Divider'

export function Schedule() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  return (
    <section className='schedule-container'>
      <h2>{prefs.isEnglish ? 'Class' : 'שיעורים'}</h2>
      <nav className='page-navigation-container'>
        <NavLink to='/class/schedule'>
          {prefs.isEnglish ? 'Schedule' : 'לוח החוגים'}
        </NavLink>
        <Divider orientation='vertical' flexItem />
        <NavLink to='/class/trainer'>
          {prefs.isEnglish ? 'Our Instructors' : 'המדריכים שלנו'}
        </NavLink>
      </nav>
      <h3>{prefs.isEnglish ? 'Schedule' : 'לוח החוגים'}</h3>
    </section>
  )
}
