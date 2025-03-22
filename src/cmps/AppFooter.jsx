import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import InstagramIcon from '@mui/icons-material/Instagram'
import FacebookIcon from '@mui/icons-material/Facebook'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import PlaceIcon from '@mui/icons-material/Place'
import LocalPhoneIcon from '@mui/icons-material/LocalPhone'
import MailIcon from '@mui/icons-material/Mail'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { smoothScroll } from '../services/util.service'

export function AppFooter() {
  const navigate = useNavigate()

  const prefs = useSelector((storeState) => storeState.systemModule.prefs)

  const footerRef = useRef()

  const address = prefs.isEnglish ? 'Keren hayesod 19,' : 'קרן היסוד 19,'

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
      // // console.log(err)
      showErrorMsg(prefs.isEnglish ? `Couldn't copy email` : 'מייל לא הועתק')
    }
  }

  const openLink = (link) => {
    window.open(link)
  }

  const navigateToAbout = (event) => {
    event.preventDefault() // Stop the link from navigating immediately
    smoothScroll()

    setTimeout(() => {
      navigate('/about')
    }, 300) // Adjust time based on your smoothScroll timing
  }

  const call = () => {
    window.location.href = 'tel:099580404'
  }

  return (
    <footer className='app-footer full' ref={footerRef}>
      <div className='contact-container'>
        <div className='method-container address' onClick={navigateToAbout}>
          <PlaceIcon />
          <div className='address-container'>
            <span>{address}</span>
            <span>{prefs.isEnglish ? 'Kfar Shmaryahu' : 'כפר שמריהו'}</span>
          </div>
        </div>
        <div className='method-container phone' onClick={call}>
          <LocalPhoneIcon />
          <span className={prefs.isDarkMode ? 'dark-mode' : ''}>{phone}</span>
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

      <span>{rights} &copy; 2024</span>
    </footer>
  )
}
