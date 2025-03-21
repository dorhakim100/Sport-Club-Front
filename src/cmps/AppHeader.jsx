import { Link, NavLink } from 'react-router-dom'

import { useSelector } from 'react-redux'
import { useState, useEffect, useRef, useMemo } from 'react'

import { useNavigate } from 'react-router-dom'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { login, logout, setRemembered } from '../store/actions/user.actions'
import { loadOpenMessages } from '../store/actions/message.actions'
import { smoothScroll } from '../services/util.service'

import {
  SOCKET_EVENT_ADD_MSG,
  SOCKET_EVENT_ADD_ORDER,
} from '../services/socket.service'

import { DropDown } from '../cmps/DropDown.jsx'

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'

import { Button } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import { socketService } from '../services/socket.service'
import { userService } from '../services/user/user.service'
import {
  setPrefs,
  setIsPrefs,
  setModalMessage,
  setIsModal,
} from '../store/actions/system.actions'
import { loadOpenPayments } from '../store/actions/payment.actions'

export function AppHeader() {
  const user = useSelector((storeState) => storeState.userModule.user)
  const cart = useSelector((stateSelector) => stateSelector.userModule.cart)

  const navigate = useNavigate()

  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  const openMessages = useSelector(
    (stateSelector) => stateSelector.messageModule.openLength
  )

  const openOrders = useSelector(
    (stateSelector) => stateSelector.paymentModule.openLength
  )

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

  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window

    return {
      width,
      height,
    }
  }

  useEffect(() => {
    setHeaderDarkMode()
  }, [prefs.isDarkMode])

  useEffect(() => {
    const setTasks = async () => {
      if (!user) return
      try {
        if (user && user.isAdmin) {
          await loadOpenMessages()
          socketService.on(SOCKET_EVENT_ADD_MSG, async () => {
            try {
              await loadOpenMessages()

              showSuccessMsg(
                prefs.isEnglish ? `New message received` : 'הודעה חדשה התקבלה'
              )
            } catch (err) {
              // console.log(`Couldn't load socket event`)
            }
          })
        }
      } catch (err) {
        // // console.log(err)
        showErrorMsg(
          prefs.isEnglish ? `Tasks couldn't be load` : 'משימות לא נטענו'
        )
      }
    }
    const setOrders = async () => {
      if (!user) return
      try {
        if (user && user.isAdmin) {
          await loadOpenPayments()
          socketService.on(SOCKET_EVENT_ADD_ORDER, async () => {
            try {
              await loadOpenPayments()

              showSuccessMsg(
                prefs.isEnglish ? `New order received` : 'הזמנה חדשה התקבלה'
              )
            } catch (err) {
              // console.log(`Couldn't load socket event`)
            }
          })
        }
      } catch (err) {
        // // console.log(err)
        showErrorMsg(
          prefs.isEnglish ? `Orders couldn't be load` : 'הזמנות לא נטענו'
        )
      }
    }
    setTasks()
    setOrders()
  }, [user])

  const openTasks = useMemo(() => {
    let open
    open = openMessages + openOrders
    return open
  }, [openMessages, openOrders])

  const cartLength = useMemo(() => {
    let length = 0

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
    } else if (scrollY === 0) {
      setScrolled(false)
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

  useEffect(() => {
    const setRememberedUser = async () => {
      try {
        const remembered = await userService.getRememberedUser()

        if (!remembered) return

        setRemembered(remembered)

        const cred = {
          username: remembered.username,
          password: '',
          isRemembered: true,
        }
        await login(cred)
      } catch (err) {
        // // console.log(err)
        showErrorMsg(
          prefs.isEnglish
            ? `Couldn't load saved user`
            : 'לא היה ניתן לטעון משתמש שמור'
        )
      }
    }
    setRememberedUser()
  }, [])

  async function onLogout() {
    try {
      event.preventDefault() // Stop the link from navigating immediately
      await logout()
      const prefsToSet = prefs
      delete prefsToSet.user
      setPrefs({ ...prefsToSet })
      // support for safari browsers
      smoothScroll()
      showSuccessMsg(prefs.isEnglish ? `Bye now` : 'להתראות')

      setTimeout(() => {
        navigate('/')
      }, 300) // Adjust time based on your smoothScroll timing
    } catch (err) {
      showErrorMsg(prefs.isEnglish ? 'Had error logging out' : 'בעיה בחיבור')
    }
  }

  const handleMouseEnter = (section) => {
    // if (windowDimensions.width <= 1050) return
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
            text: prefs.isEnglish ? 'Classes' : 'שיעורים',
            path: `${section}`,
          },
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
      case 'item':
        optionsToSet = [
          {
            text: prefs.isEnglish ? 'All Items' : 'כל המוצרים',
            path: `${section}`,
          },
          {
            text: prefs.isEnglish ? 'Cards' : 'כרטיסיות',
            path: `${section}/card`,
          },
          {
            text: prefs.isEnglish ? 'Accessories' : 'אביזרים',
            path: `${section}/accessories`,
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
            text: prefs.isEnglish ? 'Tennis Academy' : 'האקדמיה לטניס',
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
          // {
          //   text: prefs.isEnglish ? 'Our Team' : 'צוות המועדון',
          //   path: `${section}/team`,
          // },
          {
            text: prefs.isEnglish ? 'About us' : 'אודותינו',
            path: `${section}`,
          },
          {
            text: prefs.isEnglish ? 'Opening times' : 'שעות הפתיחה',
            path: `${section}/times`,
          },
          {
            text: prefs.isEnglish ? 'Organization' : 'העמותה',
            path: `${section}/organization`,
          },
          {
            text: prefs.isEnglish ? 'Accessibility' : 'נגישות',
            path: `${section}/accessibility`,
          },
          {
            text: prefs.isEnglish ? 'Cenceling' : 'ביטולים',
            path: `${section}/cancel`,
          },
        ]
        break

      default:
        break
    }

    setOptions(optionsToSet)
  }

  const firstVisit = () => {
    setModalMessage({
      he: (
        <div style={{ display: 'grid' }}>
          <span style={{ direction: 'rtl' }}>
            מעכשיו האתר תומך במצב כהה ושפה האנגלית.
          </span>
          <span style={{ direction: 'ltr' }}>
            We now have both dark mode and English version.
          </span>
        </div>
      ),
      eng: (
        <div style={{ display: 'grid' }}>
          <span style={{ direction: 'rtl' }}>
            האתר החדש תומך באנגלית ובמצב כהה.{' '}
          </span>
          <span style={{ direction: 'ltr' }}>
            Our new site now has both dark mode and English support.{' '}
          </span>
        </div>
      ),
      func: () => {
        setIsPrefs(true)
        setIsModal(false)
      },
    })
    setIsModal(true)
    setPrefs({ ...prefs, isFirstTime: false })
  }
  useEffect(() => {
    if (prefs.isFirstTime) {
      setTimeout(() => {
        firstVisit()
      }, 2000)
    }
  }, [])

  const opacityUp = () => {
    headerRef.current.style.opacity = '1'
    headerRef.current.style.transition = '0.1s ease-in'
  }

  const opacityDown = () => {
    if (scrolled) {
      headerRef.current.style.opacity = '0.8'
      headerRef.current.style.transition = '0.1s ease-in'
    }
  }

  const toggleMenu = () => {
    setMenu((prev) => (prev = !prev))
  }

  const checkHoverOptionsButton = (event) => {
    if (event.relatedTarget.className === 'prefs-button') return
    setMenu(false)
  }

  const selectLink = (path) => {
    // support for safari browsers
    event.preventDefault() // Stop the link from navigating immediately
    smoothScroll()

    setMenu(false)
    return
  }

  const clickOnLogout = () => {
    setMenu(false)

    onLogout()
  }

  const handlers = useMemo(() => {
    const options = [
      'facilities',
      'update',
      'class',
      'item',
      'member',
      'activities',
      'about',
    ]
    return options.reduce((acc, option) => {
      acc[option] = () => {
        setDropdownOptions(option)
        handleMouseEnter(option)
      }
      return acc
    }, {})
  }, [setDropdownOptions, handleMouseEnter])

  const removeDropdown = () => {
    setDropdownVisible(false)
  }

  const clickOutsideMenu = (event) => {
    setMenu(false)
  }

  return (
    <>
      {menu && (
        <div
          className={`background ${menu && 'visible'}`}
          onClick={clickOutsideMenu}
        ></div>
      )}
      <header
        className={
          scrolled
            ? `app-header sticky full ${
                windowDimensions.width <= 1050 ? 'mobile' : ''
              }`
            : `app-header full ${
                windowDimensions.width <= 1050 ? 'mobile' : ''
              }`
        }
        onClick={removeDropdown}
        ref={headerRef}
        onMouseEnter={opacityUp}
        onMouseLeave={opacityDown}
        style={
          prefs.isEnglish
            ? {
                direction: 'ltr',
                opacity: scrolled ? '0.8' : '',
                paddingLeft: windowDimensions.width <= 1050 && '1.5em',
              }
            : {
                direction: 'rtl',
                opacity: scrolled ? '0.8' : '',
                paddingRight: windowDimensions.width <= 1050 && '1.5em',
              }
        }
      >
        {' '}
        {windowDimensions.width <= 1050 && (
          <Button
            variant='contained'
            onClick={toggleMenu}
            className='notification-btn menu-btn'
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
          className={`${scrolled ? 'small-header' : ''} ${
            menu ? 'shown' : ''
          } ${menu && prefs.isEnglish ? 'ltr' : ''}`}
          style={scrolled ? { top: '100px' } : { top: '148px' }}
          onMouseLeave={checkHoverOptionsButton}
        >
          <NavLink
            ref={logoRef}
            to='/'
            className='logo'
            onClick={() => selectLink('/')}
          >
            <img src={logo} alt='' />
          </NavLink>
          <NavLink to='update' onClick={() => selectLink('/update')}>
            <span>{prefs.isEnglish ? 'Updates' : 'עדכונים'}</span>
          </NavLink>
          <NavLink to='facilities' onClick={() => selectLink('/facilities')}>
            <span>{prefs.isEnglish ? 'Facilities' : 'מתקני המועדון'}</span>
          </NavLink>

          <NavLink to='class' onClick={() => selectLink('/class')}>
            <div
              className='menu'
              onMouseEnter={handlers['class']}
              onMouseLeave={removeDropdown}
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
          <NavLink to='member' onClick={() => selectLink('/member')}>
            <span>{prefs.isEnglish ? 'Member' : 'מנויים'}</span>
          </NavLink>
          <NavLink to='item' onClick={() => selectLink('/')}>
            <div
              className='menu'
              onMouseEnter={handlers['item']}
              onMouseLeave={handleMouseLeave}
            >
              <span>{prefs.isEnglish ? 'Store' : 'כרטיסיות וציוד'}</span>
              {isDropdownVisible && hoveredSection === 'item' && (
                <DropDown
                  options={options}
                  setDropdownVisible={setDropdownVisible}
                />
              )}
            </div>
          </NavLink>

          <NavLink to='activities' onClick={() => selectLink('/activities')}>
            <div
              className='menu'
              onMouseEnter={handlers['activities']}
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

          <NavLink to='about' onClick={() => selectLink('/about')}>
            <div
              className='menu'
              onMouseEnter={handlers['about']}
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
            <NavLink to='/admin' onClick={() => selectLink('/admin')}>
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
              onClick={() => selectLink('/user/login')}
            >
              {prefs.isEnglish ? 'Login' : 'כניסה'}
            </NavLink>
          )}

          {user && (
            <div className='user-info'>
              {!user.isAdmin ? (
                <NavLink
                  to={`user/${user._id}`}
                  onClick={() => selectLink(`/user/${user._id}`)}
                >
                  <b style={{ color: '#4A90E2' }}>{user.fullname}</b>
                </NavLink>
              ) : (
                <b
                  style={
                    windowDimensions.width <= 1050
                      ? { color: '#2C3E50' }
                      : { color: '#4A90E2' }
                  }
                >
                  {user.fullname}
                </b>
              )}
              {!user.isAdmin && (
                <NavLink to={`/user/${user._id}/cart`}>
                  <Button
                    variant='contained'
                    onClick={() => selectLink(`/user/${user._id}/cart`)}
                    className='notification-btn'
                  >
                    {cart && cart.length > 0 && <span>{cartLength}</span>}
                    <ShoppingCartIcon />
                  </Button>
                </NavLink>
              )}
              <Button onClick={clickOnLogout} variant='contained'>
                {prefs.isEnglish ? 'Logout' : 'יציאה'}
              </Button>
            </div>
          )}
        </nav>
        {windowDimensions.width <= 1050 && (
          <NavLink
            to='/'
            className='logo'
            onClick={() => selectLink('/')}
            ref={logoRef}
          >
            <img
              src={logo}
              alt=''
              style={
                prefs.isEnglish
                  ? { transition: '0.3s ease' }
                  : {
                      paddingLeft: windowDimensions.width <= 1050 && '1.5em',
                      transition: '0.3s ease',
                    }
              }
            />
          </NavLink>
        )}
      </header>
    </>
  )
}
