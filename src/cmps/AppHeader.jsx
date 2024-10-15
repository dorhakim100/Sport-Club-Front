import { Link, NavLink } from 'react-router-dom'

import { useSelector } from 'react-redux'
import { useState, useEffect, useRef } from 'react'

import { useNavigate, useParams } from 'react-router-dom'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { logout } from '../store/actions/user.actions'

import { DropDown } from '../cmps/DropDown.jsx'

import { Button } from '@mui/material'
import logo from '../../public/imgs/logo.png'

export function AppHeader({ bodyRef }) {
  const user = useSelector((storeState) => storeState.userModule.user)
  const navigate = useNavigate()

  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  // console.log(prefs)

  const [isDropdownVisible, setDropdownVisible] = useState(false)
  const [hoveredSection, setHoveredSection] = useState()
  const [options, setOptions] = useState([])

  const [scrolled, setScrolled] = useState(false)
  const headerRef = useRef()
  const waterRef = useRef()
  const logoRef = useRef()

  const handleScroll = () => {
    console.log(bodyRef)
    const scrollY = window.scrollY
    if (scrollY > 0) {
      setScrolled(true)

      logoRef.current.style.height = '70px'

      logoRef.current.style.transition = '0.3s ease-out'
    } else {
      setScrolled(false)
      logoRef.current.style.height = '100px'

      logoRef.current.style.transition = '0.3s ease-out'
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

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
          {
            text: prefs.isEnglish ? 'Facilities' : 'מתקני המועדון',
            path: `${section}/facilities`,
          },
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
            to='login'
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