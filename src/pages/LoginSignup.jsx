import { Outlet } from 'react-router'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { GoogleLoginCmp } from '../cmps/GoogleLoginCmp'
import { setIsLoading } from '../store/actions/system.actions'
import { login } from '../store/actions/user.actions'
import { showErrorMsg } from '../services/event-bus.service'
import { setPrefs } from '../store/actions/system.actions'

import Divider from '@mui/material/Divider'
import { HeadContainer } from '../cmps/HeadContainer'
import { RememberMeButton } from '../cmps/RememberMeButton'

export function LoginSignup() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  const location = useLocation()
  const navigate = useNavigate()
  const isRemember = useSelector(
    (stateSelector) => stateSelector.userModule.isRemember
  )

  const [text, setText] = useState({
    he: 'חיבור',
    eng: 'Login',
  })

  useEffect(() => {
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

  const handleGoogleLogin = async (credentials) => {
    try {
      setIsLoading(true)
      const userRes = await login({ ...credentials })

      if (isRemember) {
        setPrefs({ ...prefs, user: { _id: userRes._id } })
      }
      navigate('/')
    } catch (err) {
      // // console.log(err)
      showErrorMsg(prefs.isEnglish ? `Couldn't login` : 'חיבור לא הצליח')
    } finally {
      setIsLoading(false)
    }
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
        <RememberMeButton />
        <Divider
          orientation='horizontal'
          flexItem
          style={
            prefs.isDarkMode
              ? { backgroundColor: '#787878', margin: '2em 0em' }
              : { margin: '2em 0em' }
          }
        />
        <Outlet />
      </div>
    </div>
  )
}
