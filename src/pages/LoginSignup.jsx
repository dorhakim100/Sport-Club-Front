import { Outlet } from 'react-router'
import { NavLink, useLocation } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { GoogleLoginCmp } from '../cmps/GoogleLoginCmp'

import Divider from '@mui/material/Divider'
import { HeadContainer } from '../cmps/HeadContainer'

export function LoginSignup() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  const location = useLocation()

  const [text, setText] = useState({
    he: 'חיבור',
    eng: 'Login',
  })

  useEffect(() => {
    console.log(location.pathname)
    switch (location.pathname) {
      case '/user/signup':
        setText({
          he: 'רישום',
          eng: 'Signup',
        })
        break
      case '/user/login':
        setText({
          he: 'חיבור',
          eng: 'Login',
        })
        break

      default:
        break
    }
  }, [location.pathname])

  const handleGoogleLogin = async (cred) => {
    console.log(cred)
  }

  return (
    <div className='login-page'>
      <nav className='page-navigation-container'>
        <NavLink to='login'>{prefs.isEnglish ? 'Login' : 'חיבור'}</NavLink>
        <Divider orientation='vertical' flexItem />
        <NavLink to='signup'>{prefs.isEnglish ? 'Signup' : 'רישום'}</NavLink>
      </nav>
      <HeadContainer text={text} />
      <div className={`login-container ${prefs.isDarkMode && 'dark-mode'}`}>
        <GoogleLoginCmp handleGoogleLogin={handleGoogleLogin} />
        <Divider
          orientation='horizontal'
          flexItem
          style={
            prefs.isDarkMode
              ? { backgroundColor: '#787878', margin: '2em 0em' }
              : {}
          }
        />
        <Outlet />
      </div>
    </div>
  )
}
