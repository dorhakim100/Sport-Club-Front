import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

import { Link } from 'react-router-dom'

import { Button } from '@mui/material'

import InstagramIcon from '@mui/icons-material/Instagram'
import FacebookIcon from '@mui/icons-material/Facebook'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import PlaceIcon from '@mui/icons-material/Place'
import LocalPhoneIcon from '@mui/icons-material/LocalPhone'
import MailIcon from '@mui/icons-material/Mail'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'

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
    ? 'Dor Hakim, Sport Club Kfar Shmaryahu'
    : `דור חכים, מועדון הספורט כפר שמריהו`

  const links = {
    facebook: 'https://www.facebook.com/moadonsportkfar/?locale=he_IL',
    instagram: 'https://www.instagram.com/moadonsport/',
    whatsapp: 'https://wa.me/972522681757',
  }

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

  const handleCopyToClipboard = async (e) => {
    e.preventDefault() // Prevent navigation to `mailto`
    try {
      await navigator.clipboard.writeText(email)
      showSuccessMsg(prefs.isEnglish ? 'Email copied' : 'מייל הועתק')
    } catch (err) {
      console.log(err)
      showErrorMsg(prefs.isEnglish ? `Couldn't copy email` : 'מייל לא הועתק')
    }
  }

  const openLink = (link) => {
    window.open(link)
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
          <a
            href='tel:099580404'
            className={prefs.isDarkMode ? 'dark-mode' : ''}
          >
            {phone}
          </a>
        </div>
        <div
          className={`method-container email`}
          onClick={handleCopyToClipboard}
        >
          <MailIcon />
          <span className={`clickable ${prefs.isDarkMode && 'dark-mode'}`}>
            {email}
          </span>
        </div>
      </div>
      <div className='links-container'>
        <div
          className='social-container facebook-container'
          onClick={() => {
            openLink(links.facebook)
          }}
        >
          <FacebookIcon />
        </div>
        <div
          className='social-container whatsapp-container'
          onClick={() => {
            openLink(links.whatsapp)
          }}
        >
          <WhatsAppIcon />
        </div>
        <div
          className='social-container instagram-container'
          onClick={() => {
            openLink(links.instagram)
          }}
        >
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
