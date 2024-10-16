import React, { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Divider from '@mui/material/Divider'

export function Class() {
  const location = useLocation()
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)

  return (
    <section className='class-page-container'>
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
    </section>
  )
}
