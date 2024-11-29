import { Link, NavLink } from 'react-router-dom'

import { useSelector } from 'react-redux'
import { useState, useEffect, useRef, useMemo } from 'react'

import { useNavigate, useParams } from 'react-router-dom'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { login, logout, setRemembered } from '../store/actions/user.actions'
import { loadOpenMessages } from '../store/actions/message.actions'

import { SOCKET_EVENT_ADD_MSG } from '../services/socket.service'

import { DropDown } from '../cmps/DropDown.jsx'

import Divider from '@mui/material/Divider'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'

import { Button } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import { socketService } from '../services/socket.service'
import { userService } from '../services/user/user.service'
import { setPrefs } from '../store/actions/system.actions'

export function AppHeader({ bodyRef }) {
  const user = useSelector((storeState) => storeState.userModule.user)
  const cart = useSelector((stateSelector) => stateSelector.userModule.cart)

  const navigate = useNavigate()

  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  const openMessages = useSelector(
    (stateSelector) => stateSelector.messageModule.openLength
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
              console.log(`Couldn't load socket event`)
            }
          })
        }
      } catch (err) {
        console.log(err)
        showErrorMsg(
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
      headerRef.current.style.transition = '0.3s ease'
      logoRef.current.style.transform = 'scale(0.8)' // Shrinks logo to 80% size
      headerRef.current.style.opacity = '0.8'
      headerRef.current.style.opacity = '0.8'
      headerRef.current.style.transition = '0.1s ease-in'
    } else if (scrollY === 0) {
      setScrolled(false)
      headerRef.current.style.transition = '0.3s ease'
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
        console.log(err)
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
      await logout()
      const prefsToSet = prefs
      delete prefsToSet.user
      setPrefs({ ...prefsToSet })
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
          // {
          //   text: prefs.isEnglish ? 'Our Team' : 'צוות המועדון',
          //   path: `${section}/team`,
          // },
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

  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window

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
      // style={{ position: 'fixed', left: '0px', right: '0px', top: '0px' }}
      style={
        prefs.isEnglish
          ? {
              direction: 'ltr',
              opacity: scrolled ? '0.8' : '',
              paddingLeft: windowDimensions.width < 1050 && '1.5em',
            }
          : {
              direction: 'rtl',
              opacity: scrolled ? '0.8' : '',
              paddingRight: windowDimensions.width < 1050 && '1.5em',
            }
      }
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
        style={scrolled ? { top: '100px' } : { top: '148px' }}
        onMouseLeave={(event) => {
          if (event.relatedTarget.className === 'prefs-button') return

          setMenu(false)
        }}
      >
        <NavLink
          ref={logoRef}
          to='/'
          className='logo'
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' })
            setMenu(false)
          }}
        >
          <img src={logo} alt='' />
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
          to='update'
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' })
            setMenu(false)
          }}
        >
          <span>{prefs.isEnglish ? 'Updates' : 'עדכונים'}</span>
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
            {!user.isAdmin ? (
              <Link
                to={`user/${user._id}`}
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                  setMenu(false)
                }}
              >
                {user.fullname}
              </Link>
            ) : (
              <b style={{ color: '#4A90E2' }}>{user.fullname}</b>
            )}
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
            <Button
              onClick={() => {
                setMenu(false)

                onLogout()
              }}
              variant='contained'
            >
              {prefs.isEnglish ? 'Logout' : 'יציאה'}
            </Button>
          </div>
        )}
      </nav>
      {windowDimensions.width < 1050 && (
        <NavLink
          to='/'
          className='logo'
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' })
            setMenu(false)
          }}
          ref={logoRef}
        >
          <img
            src={logo}
            alt=''
            style={
              prefs.isEnglish
                ? { transition: '0.3s ease' }
                : {
                    paddingLeft: windowDimensions.width < 1050 && '1.5em',
                    transition: '0.3s ease',
                  }
            }
          />
        </NavLink>
      )}
    </header>
  )
}
