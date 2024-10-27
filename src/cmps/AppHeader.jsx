import { Link, NavLink } from 'react-router-dom'

import { useSelector } from 'react-redux'
import { useState, useEffect, useRef, useMemo } from 'react'

import { useNavigate, useParams } from 'react-router-dom'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { logout } from '../store/actions/user.actions'
import { loadOpenMessages } from '../store/actions/message.actions'

import { DropDown } from '../cmps/DropDown.jsx'

import Divider from '@mui/material/Divider'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'

import { Button } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'

export function AppHeader({ bodyRef }) {
  const user = useSelector((storeState) => storeState.userModule.user)
  const cart = useSelector((stateSelector) => stateSelector.userModule.cart)

  const navigate = useNavigate()

  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  const openMessages = useSelector(
    (stateSelector) => stateSelector.messageModule.openLength
  )
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

  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  )

  const [menu, setMenu] = useState(false)

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions())
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [windowDimensions])

  useEffect(() => {
    setHeaderDarkMode()
  }, [prefs.isDarkMode])

  useEffect(() => {
    const setTasks = async () => {
      try {
        await loadOpenMessages()
      } catch (err) {
        console.log(err)
        showSuccessMsg(
          prefs.isEnglish ? `Tasks couldn't be load` : 'משימות לא נטענו'
        )
      }
    }
    setTasks()
  }, [user])

  const openTasks = useMemo(() => {
    let open
    open = openMessages
    return open
  }, [openMessages])

  console.log(openTasks)

  const cartLength = useMemo(() => {
    let length = 0
    console.log(user)
    console.log(cart)
    if (!cart) {
      return 0
    }
    const cartLength = cart.reduce((accu, item) => accu + item.quantity, length)
    return cartLength
  }, [cart, user]) // using useMemo to prevent calculating each and every render

  const handleScroll = () => {
    const scrollY = window.scrollY
    if (scrollY > 0) {
      setScrolled(true)
      logoRef.current.style.transform = 'scale(0.8)' // Shrinks logo to 80% size

      headerRef.current.style.opacity = '0.8'
    } else if (scrollY === 0) {
      setScrolled(false)
      logoRef.current.style.transform = 'scale(1)' // Resets logo to original size

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
            text: prefs.isEnglish ? 'Reformer Pilates' : 'פילאטיס מכשירים',
            path: `${section}/pilates`,
          },
          {
            text: prefs.isEnglish ? 'Care Center' : 'מרכז הטיפולים',
            path: `${section}/care`,
          },
          {
            text: prefs.isEnglish ? 'Summer Camp' : 'קייטנת הקיץ',
            path: `${section}/camp`,
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

  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window
    // console.log(width)
    return {
      width,
      height,
    }
  }

  return (
    <header
      className={scrolled ? 'app-header sticky full' : 'app-header full'}
      onClick={() => setDropdownVisible(false)}
      ref={headerRef}
      onMouseEnter={() => {
        headerRef.current.style.opacity = '1'
        headerRef.current.style.transition = '0.1s ease-in'
      }}
      onMouseLeave={() => {
        if (scrolled) {
          headerRef.current.style.opacity = '0.8'
          headerRef.current.style.transition = '0.1s ease-in'
        }
      }}
    >
      {' '}
      {windowDimensions.width < 1050 && (
        <Button
          variant='contained'
          onClick={() => setMenu((prev) => (prev = !prev))}
          className='notification-btn'
        >
          {(menu && (
            <>
              {user && user.isAdmin && openTasks > 0 && (
                <span>{openTasks}</span>
              )}
              <MenuOpenIcon />
            </>
          )) || (
            <>
              {user && user.isAdmin && openTasks > 0 && (
                <span>{openTasks}</span>
              )}
              <MenuIcon />
            </>
          )}
        </Button>
      )}
      <nav
        className={`${scrolled ? 'small-header' : ''} ${menu ? 'shown' : ''} ${
          menu && prefs.isEnglish ? 'ltr' : ''
        }`}
      >
        <NavLink
          to='/'
          className='logo'
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' })
            setMenu(false)
          }}
        >
          <img src={logo} alt='' ref={logoRef} />
        </NavLink>
        <NavLink
          to='facilities'
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' })
            setMenu(false)
          }}
        >
          <span>{prefs.isEnglish ? 'Facilities' : 'מתקני המועדון'}</span>
        </NavLink>

        <NavLink
          to='class'
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' })
            setMenu(false)
          }}
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
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' })
            setMenu(false)
          }}
        >
          <span>{prefs.isEnglish ? 'Store' : 'חנות'}</span>
        </NavLink>

        <NavLink
          to='activities'
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' })
            setMenu(false)
          }}
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
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' })
            setMenu(false)
          }}
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
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' })
              setMenu(false)
            }}
          >
            {' '}
            <Button variant='contained' className='notification-btn'>
              {openTasks > 0 && <span>{openTasks}</span>}
              {prefs.isEnglish ? 'Admin' : 'מנהל'}
            </Button>
          </NavLink>
        )}

        {!user && (
          <NavLink
            to='user/login'
            className='login-link'
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' })
              setMenu(false)
            }}
          >
            {prefs.isEnglish ? 'Login' : 'כניסה'}
          </NavLink>
        )}

        {user && (
          <div className='user-info'>
            <Link to={`user/${user._id}`}>{user.fullname}</Link>
            {!user.isAdmin && (
              <Button
                variant='contained'
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                  setMenu(false)
                  navigate(`/user/${user._id}/cart`)
                }}
                className='notification-btn'
              >
                {cart && cart.length > 0 && <span>{cartLength}</span>}
                <ShoppingCartIcon />
              </Button>
            )}
            <Button onClick={onLogout} variant='contained'>
              {prefs.isEnglish ? 'Logout' : 'יציאה'}
            </Button>
          </div>
        )}
      </nav>
      {windowDimensions.width < 1050 && (
        <NavLink
          to='/'
          className='logo'
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <img src={logo} alt='' ref={logoRef} />
        </NavLink>
      )}
    </header>
  )
}
