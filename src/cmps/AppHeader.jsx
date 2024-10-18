import { Link, NavLink } from 'react-router-dom'

import { useSelector } from 'react-redux'
import { useState, useEffect, useRef } from 'react'

import { useNavigate, useParams } from 'react-router-dom'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { logout } from '../store/actions/user.actions'

import { DropDown } from '../cmps/DropDown.jsx'

import Divider from '@mui/material/Divider'

import { Button } from '@mui/material'
// import logo from '../../public/imgs/logo.png'

export function AppHeader({ bodyRef }) {
  const user = useSelector((storeState) => storeState.userModule.user)
  const navigate = useNavigate()

  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  // console.log(prefs)
  const [logo, setLogo] = useState(
    'https://res.cloudinary.com/dnxi70mfs/image/upload/v1729075214/logo_mp3dgh.png'
  )

  const [isDropdownVisible, setDropdownVisible] = useState(false)
  const [hoveredSection, setHoveredSection] = useState()
  const [options, setOptions] = useState([])

  const [scrolled, setScrolled] = useState(false)
  const headerRef = useRef()
  const waterRef = useRef()
  const logoRef = useRef()

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    setHeaderDarkMode()
  }, [prefs.isDarkMode])

  const handleScroll = () => {
    const scrollY = window.scrollY
    if (scrollY > 0) {
      setScrolled(true)
      logoRef.current.style.transform = 'scale(0.8)' // Shrinks logo to 80% size
      // headerRef.current.style.transform = 'scaleY(0.8)'
      // headerRef.current.style.height = '100px'
      // headerRef.current.style.transition =
      //   'height 0.3s ease-out, transform 0.3s ease-out'
      headerRef.current.style.opacity = '0.8'
    } else if (scrollY === 0) {
      setScrolled(false)
      logoRef.current.style.transform = 'scale(1)' // Resets logo to original size
      // headerRef.current.style.transform = 'scaleY(1)'
      // headerRef.current.style.height = '150px'
      // headerRef.current.style.transition =
      //   'height 0.3s ease-out, transform 0.3s ease-out'
      headerRef.current.style.opacity = '1'
    }
  }

  const setHeaderDarkMode = () => {
    if (prefs.isDarkMode) {
      headerRef.current.style.backgroundColor = '#181e24'
      headerRef.current.style.color = 'white'
      headerRef.current.style.transition =
        'background-color 0.3s ease, color 0.3s ease'
      setLogo(
        'https://res.cloudinary.com/dnxi70mfs/image/upload/v1729070986/logoDarkMode_i25wgx.png'
      )
    } else {
      headerRef.current.style.backgroundColor = '#dff9ff'
      headerRef.current.style.color = '#2C3E50'
      headerRef.current.style.transition =
        'background-color 0.3s ease, color 0.3s ease'
      setLogo(
        'https://res.cloudinary.com/dnxi70mfs/image/upload/v1729075214/logo_mp3dgh.png'
      )
    }
  }

  async function onLogout() {
    try {
      await logout()
      navigate('/')
      showSuccessMsg(`Bye now`)
    } catch (err) {
      showErrorMsg('Cannot logout')
    }
  }

  const handleMouseEnter = (section) => {
    setHoveredSection(section)
    setDropdownVisible(true)
  }

  const handleMouseLeave = () => {
    setDropdownVisible(false)
  }

  const setDropdownOptions = (section) => {
    let optionsToSet
    switch (section) {
      case 'class':
        optionsToSet = [
          {
            text: prefs.isEnglish ? 'Schedule' : 'מערכת החוגים',
            path: `${section}/schedule`,
          },
          {
            text: prefs.isEnglish ? 'Our Trainers' : 'צוות המדריכים שלנו',
            path: `${section}/trainer`,
          },
        ]
        break
      case 'activities':
        optionsToSet = [
          {
            text: prefs.isEnglish ? 'Swimming School' : 'בית הספר לשחייה',
            path: `${section}/swimming`,
          },
          {
            text: prefs.isEnglish ? 'Tennis School' : 'בית הספר לטניס',
            path: `${section}/tennis`,
          },
          {
            text: prefs.isEnglish ? 'Care Center' : 'מרכז הטיפולים',
            path: `${section}/care`,
          },
          {
            text: prefs.isEnglish ? 'Restaurant' : 'שף הכפר',
            path: `${section}/restaurant`,
          },
        ]
        break
      case 'about':
        optionsToSet = [
          // {
          //   text: prefs.isEnglish ? 'Facilities' : 'מתקני המועדון',
          //   path: `${section}/facilities`,
          // },
          {
            text: prefs.isEnglish ? 'Our Team' : 'צוות המועדון',
            path: `${section}/team`,
          },
          {
            text: prefs.isEnglish ? 'Organization' : 'העמותה',
            path: `${section}/organization`,
          },
          {
            text: prefs.isEnglish ? 'Accessibility' : 'נגישות',
            path: `${section}/accessibility`,
          },
        ]
        break

      default:
        break
    }

    setOptions(optionsToSet)
  }

  return (
    <header
      className={scrolled ? 'app-header sticky full' : 'app-header full'}
      onClick={() => setDropdownVisible(false)}
      ref={headerRef}
      onMouseEnter={() => {
        if (scrolled) {
          headerRef.current.style.opacity = '1'
          headerRef.current.style.transition = '0.1s ease-in'
        }
      }}
      onMouseLeave={() => {
        if (scrolled) {
          headerRef.current.style.opacity = '0.8'
          headerRef.current.style.transition = '0.1s ease-in'
        }
      }}
    >
      <nav>
        <NavLink
          to='/'
          className='logo'
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <img src={logo} alt='' ref={logoRef} />
        </NavLink>
        <NavLink
          to='facilities'
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <span>{prefs.isEnglish ? 'Facilities' : 'מתקני המועדון'}</span>
        </NavLink>

        <NavLink
          to='class'
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div
            className='menu'
            onMouseEnter={() => {
              setDropdownOptions('class')
              handleMouseEnter('class')
            }}
            onMouseLeave={() => setDropdownVisible(false)}
          >
            <span>{prefs.isEnglish ? 'Class' : 'חוגים'}</span>
            {isDropdownVisible && hoveredSection === 'class' && (
              <DropDown
                options={options}
                setDropdownVisible={setDropdownVisible}
              />
            )}
          </div>
        </NavLink>
        <NavLink
          to='item'
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <span>{prefs.isEnglish ? 'Store' : 'חנות'}</span>
        </NavLink>

        <NavLink
          to='activities'
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div
            className='menu'
            onMouseEnter={() => {
              setDropdownOptions('activities')
              handleMouseEnter('activities')
            }}
            onMouseLeave={handleMouseLeave}
          >
            <span>{prefs.isEnglish ? 'Activities' : 'פעילויות'}</span>
            {isDropdownVisible && hoveredSection === 'activities' && (
              <DropDown
                options={options}
                setDropdownVisible={setDropdownVisible}
              />
            )}
          </div>
        </NavLink>

        <NavLink
          to='about'
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div
            className='menu'
            onMouseEnter={() => {
              setDropdownOptions('about')
              handleMouseEnter('about')
            }}
            onMouseLeave={handleMouseLeave}
          >
            <span>{prefs.isEnglish ? 'About' : 'אודות'}</span>
            {isDropdownVisible && hoveredSection === 'about' && (
              <DropDown
                options={options}
                setDropdownVisible={setDropdownVisible}
              />
            )}
          </div>
        </NavLink>

        {user?.isAdmin && (
          <NavLink
            to='/admin'
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            {prefs.isEnglish ? 'Admin' : 'מנהל'}
          </NavLink>
        )}

        {!user && (
          <NavLink
            to='user/login'
            className='login-link'
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            {prefs.isEnglish ? 'Login' : 'כניסה'}
          </NavLink>
        )}

        {user && (
          <div className='user-info'>
            <Link to={`user/${user._id}`}>{user.fullname}</Link>
            <Button onClick={onLogout} variant='contained'>
              {prefs.isEnglish ? 'Logout' : 'יציאה'}
            </Button>
          </div>
        )}
      </nav>
    </header>
  )
}
