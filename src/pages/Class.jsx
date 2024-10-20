import React, { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { Nav } from '../cmps/Nav'

import Divider from '@mui/material/Divider'

export function Class() {
  const location = useLocation()
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)

  const origin = {
    path: '/class',
    he: 'שיעורים',
    eng: 'Class',
  }

  const links = [
    {
      path: 'schedule',
      he: 'לוח החוגים',
      eng: 'Schedule',
    },
    {
      path: 'trainer',
      he: 'המדריכים שלנו',
      eng: 'Our Instructors',
    },
  ]

  return (
    <section className='class-page-container'>
      <h2>{prefs.isEnglish ? 'Class' : 'שיעורים'}</h2>
      <Nav origin={origin} links={links} />
    </section>
  )
}
