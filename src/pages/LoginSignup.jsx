import { Outlet } from 'react-router'
import { NavLink } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import Divider from '@mui/material/Divider'

export function LoginSignup() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)

  return (
    <div className='login-page'>
      <nav className='page-navigation-container'>
        <NavLink to='login'>{prefs.isEnglish ? 'Login' : 'חיבור'}</NavLink>
        <Divider orientation='vertical' flexItem />
        <NavLink to='signup'>{prefs.isEnglish ? 'Signup' : 'רישום'}</NavLink>
      </nav>
      <Outlet />
    </div>
  )
}
