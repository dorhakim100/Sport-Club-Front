import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

import { Link } from 'react-router-dom'

import { Button } from '@mui/material'

import InstagramIcon from '@mui/icons-material/Instagram'
import FacebookIcon from '@mui/icons-material/Facebook'
import PlaceIcon from '@mui/icons-material/Place'
import LocalPhoneIcon from '@mui/icons-material/LocalPhone'
import MailIcon from '@mui/icons-material/Mail'

export function AppFooter() {
  const count = useSelector((storeState) => storeState.userModule.count)

  const prefs = useSelector((storeState) => storeState.systemModule.prefs)

  const footerRef = useRef()

  const address = prefs.isEnglish
    ? 'Keren hayesod 19, Kfar Shmaryahu'
    : 'קרן היסוד 19, כפר שמריהו'

  const phone = '09-958-0404'
  const email = 'service.kfar@gmail.com'
  const rights = prefs.isEnglish
    ? 'All rights reserved, Sport Club Kfar Shmaryahu'
    : `כל הזכויות שמורות למועדון הספורט כפר שמריהו`

  useEffect(() => {
    setFooterDarkMode()
  }, [prefs.isDarkMode])

  const setFooterDarkMode = () => {
    if (prefs.isDarkMode) {
      footerRef.current.style.backgroundColor = '#425c77'
      footerRef.current.style.color = 'white'
    } else {
      footerRef.current.style.backgroundColor = '#6EC1E4'
      footerRef.current.style.color = '#2C3E50'
    }
  }

  return (
    <footer className='app-footer full' ref={footerRef}>
      <div className='contact-container'>
        <div className='method-container address'>
          <PlaceIcon />
          <span>{address}</span>
        </div>
        <div className='method-container phone'>
          <LocalPhoneIcon />
          <span>{phone}</span>
        </div>
        <div className='method-container email'>
          <MailIcon />
          <span>{email}</span>
        </div>
      </div>
      <div className='links-container'>
        <div className='facebook-container'>
          <FacebookIcon />
        </div>
        <div className='instagram-container'>
          <InstagramIcon />
        </div>
      </div>
      <div className='times-container'>
        {/* <Link to={'/about'}>שעות פתיחה</Link> */}
      </div>
      <span>{rights} &copy; 2024</span>
    </footer>
  )
}
