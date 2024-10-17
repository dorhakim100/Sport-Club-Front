import React, { useState } from 'react'
import { NavLink, Link, Outlet } from 'react-router-dom'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { HeadContainer } from '../cmps/HeadContainer'

import Divider from '@mui/material/Divider'

export function TrainerIndex() {
  const location = useLocation()
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)

  const headText = { he: 'המדריכים שלנו', eng: 'Our Instructors' }

  return (
    <section className='trainer-index-container'>
      <h2>{prefs.isEnglish ? 'Class' : 'שיעורים'}</h2>
      <nav className='page-navigation-container'>
        <NavLink to='/class'>{prefs.isEnglish ? 'Class' : 'שיעורים'}</NavLink>
        <Divider orientation='vertical' flexItem />
        <NavLink to='/class/schedule'>
          {prefs.isEnglish ? 'Schedule' : 'לוח החוגים'}
        </NavLink>
        <Divider orientation='vertical' flexItem />
        <NavLink to='/class/trainer'>
          {prefs.isEnglish ? 'Our Instructors' : 'המדריכים שלנו'}
        </NavLink>
      </nav>
      <HeadContainer text={headText} />
    </section>
  )
}
