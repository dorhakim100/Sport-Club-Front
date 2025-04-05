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
import IconButton from '@mui/material/IconButton'
import SettingsIcon from '@mui/icons-material/Settings'
import AccessibleIcon from '@mui/icons-material/Accessible'

// list

import Menu from '@mui/material/Menu'

import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'

import EventNoteIcon from '@mui/icons-material/EventNote'
import CardMembershipIcon from '@mui/icons-material/CardMembership'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'

import InfoIcon from '@mui/icons-material/Info'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import LogoutIcon from '@mui/icons-material/Logout'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi'
import RecentActorsIcon from '@mui/icons-material/RecentActors'
import MoreIcon from '@mui/icons-material/More'
import PoolIcon from '@mui/icons-material/Pool'
import SportsTennisIcon from '@mui/icons-material/SportsTennis'
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement'
import SpaIcon from '@mui/icons-material/Spa'
import CabinIcon from '@mui/icons-material/Cabin'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'
import MyLocationIcon from '@mui/icons-material/MyLocation'
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder'
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary'
import AccessibilityIcon from '@mui/icons-material/Accessibility'
import DoDisturbIcon from '@mui/icons-material/DoDisturb'
import LoginIcon from '@mui/icons-material/Login'
import PersonIcon from '@mui/icons-material/Person'

import ListSubheader from '@mui/material/ListSubheader'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Collapse from '@mui/material/Collapse'

import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'

import Divider from '@mui/material/Divider'

import { socketService } from '../services/socket.service'
import { userService } from '../services/user/user.service'
import {
  setPrefs,
  setIsPrefs,
  setModalMessage,
  setIsModal,
  setIsAccessibility,
} from '../store/actions/system.actions'
import { loadOpenPayments } from '../store/actions/payment.actions'
import { Logout } from '@mui/icons-material'

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

  const logoRef = useRef()

  const isPrefs = useSelector(
    (stateSelector) => stateSelector.systemModule.isPrefs
  )
  const isAccessibility = useSelector(
    (stateSelector) => stateSelector.systemModule.isAccessibility
  )

  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  )

  const [menu, setMenu] = useState(false)

  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
    setMenu(false)
  }

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
      showSuccessMsg(prefs.isEnglish ? `Bye now` : 'להתראות')
      smoothScroll()

      setTimeout(() => {
        navigate('/')
      }, 300) // Adjust time based on your smoothScroll timing
    } catch (err) {
      showErrorMsg(prefs.isEnglish ? 'Had error logging out' : 'בעיה בחיבור')
    }
  }

  const handleMouseEnter = (section) => {
    // if (windowDimensions.width <= 1150) return
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

  const toggleMenu = (event) => {
    // if (!menu) {
    // } else setMenuRef(null)
    setAnchorEl(event.currentTarget)
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

  const delayedNavigate = (path) => {
    smoothScroll()

    setTimeout(() => {
      navigate(path)
    }, 300) // Adjust time based on your smoothScroll timing
  }
  const handleMenuItemClick = (linkId) => {
    // setOpenDropdown(!openDropdown)
    setLinks((prevLinks) =>
      prevLinks.map((link) =>
        // link.id === linkId ? { ...link, isOpen: !link.isOpen } : link
        link.id === linkId
          ? { ...link, isOpen: !link.isOpen }
          : { ...link, isOpen: false }
      )
    )
  }
  const [links, setLinks] = useState([
    {
      id: 1,
      title: { eng: 'Updates', he: 'עדכונים' },
      to: 'update',
      onClick: () => {
        delayedNavigate('/update')
      },
      dropdown: false,
      icon: <NotificationsNoneIcon />,
    },
    {
      id: 2,
      title: { eng: 'Facilities', he: 'מתקני המועדון' },
      to: 'facilities',
      onClick: () => {
        delayedNavigate('/facilities')
      },
      dropdown: false,
      icon: <PoolIcon />,
    },
    {
      id: 3,
      title: { eng: 'Class', he: 'חוגים' },
      to: 'class',
      onClick: () => {
        selectLink('/class')
      },
      dropdown: [
        {
          title: { eng: 'Classes', he: 'שיעורים' },
          path: `class`,
          icon: <SelfImprovementIcon />,
          onClick: () => {
            setMenu(false)
            delayedNavigate('/class')
          },
        },
        {
          title: { eng: 'Schedule', he: 'מערכת החוגים' },
          path: `class/schedule`,
          icon: <CalendarTodayIcon />,
          onClick: () => {
            setMenu(false)
            delayedNavigate('/class/schedule')
          },
        },
        {
          title: { eng: 'Our Trainers', he: 'צוות המדריכים שלנו' },
          path: `class/trainer`,
          icon: <SportsKabaddiIcon />,
          onClick: () => {
            setMenu(false)
            delayedNavigate('/class/trainer')
          },
        },
      ],
      isOpen: false,
      icon: <EventNoteIcon />,
    },
    {
      id: 4,
      title: { eng: 'Member', he: 'מנויים' },
      to: 'member',
      onClick: () => {
        delayedNavigate('/member')
      },
      dropdown: false,
      icon: <CardMembershipIcon />,
    },
    {
      id: 5,
      title: { eng: 'Store', he: 'כרטיסיות וציוד' },
      to: 'item',
      onClick: () => {
        selectLink('/item')
      },
      dropdown: [
        {
          title: { eng: 'All Items', he: 'כל המוצרים' },
          path: `item`,
          icon: <AddShoppingCartIcon />,
          onClick: () => {
            setMenu(false)
            delayedNavigate('/item')
          },
        },
        {
          title: { eng: 'Cards', he: 'כרטיסיות' },
          path: `item/card`,
          icon: <RecentActorsIcon />,
          onClick: () => {
            setMenu(false)
            delayedNavigate('/item/card')
          },
        },
        {
          title: { eng: 'Accessories', he: 'אביזרים' },
          path: `item/accessories`,
          icon: <MoreIcon />,
          onClick: () => {
            setMenu(false)
            delayedNavigate('/item/accessories')
          },
        },
      ],
      isOpen: false,
      icon: <AddShoppingCartIcon />,
    },
    {
      id: 6,
      title: { eng: 'Activities', he: 'פעילויות' },
      to: 'activities',
      onClick: () => {
        selectLink('/activities')
      },
      dropdown: [
        {
          title: { eng: 'Swimming School', he: 'בית הספר לשחייה' },
          path: `activities/swimming`,
          icon: <PoolIcon />,
          onClick: () => {
            setMenu(false)
            delayedNavigate('/activities/swimming')
          },
        },
        {
          title: { eng: 'Tennis Academy', he: 'האקדמיה לטניס' },
          path: `activities/tennis`,
          icon: <SportsTennisIcon />,
          onClick: () => {
            setMenu(false)
            delayedNavigate('/activities/tennis')
          },
        },
        {
          title: { eng: 'Reformer Pilates', he: 'פילאטיס מכשירים' },
          path: `activities/pilates`,
          icon: <SelfImprovementIcon />,
          onClick: () => {
            setMenu(false)
            delayedNavigate('/activities/pilates')
          },
        },
        {
          title: { eng: 'Care Center', he: 'מרכז הטיפולים' },
          path: `activities/care`,
          icon: <SpaIcon />,
          onClick: () => {
            setMenu(false)
            delayedNavigate('/activities/care')
          },
        },
        {
          title: { eng: 'Summer Camp', he: 'קייטנת הקיץ' },
          path: `activities/camp`,
          icon: <CabinIcon />,
          onClick: () => {
            setMenu(false)
            delayedNavigate('/activities/camp')
          },
        },
        {
          title: { eng: 'Restaurant', he: 'שף הכפר' },
          path: `activities/restaurant`,
          icon: <RestaurantMenuIcon />,
          onClick: () => {
            setMenu(false)
            delayedNavigate('/activities/restaurant')
          },
        },
      ],
      isOpen: false,
      icon: <SportsTennisIcon />,
    },
    {
      id: 7,
      title: { eng: 'About', he: 'אודות' },
      to: 'about',
      onClick: () => {
        selectLink('/about')
      },
      dropdown: [
        {
          title: { eng: 'About us', he: 'אודותינו' },
          path: `about`,
          icon: <MyLocationIcon />,
          onClick: () => {
            setMenu(false)
            delayedNavigate('/about')
          },
        },
        {
          title: { eng: 'Opening times', he: 'שעות הפתיחה' },
          path: `about/times`,
          icon: <QueryBuilderIcon />,
          onClick: () => {
            setMenu(false)
            delayedNavigate('/about/times')
          },
        },
        {
          title: { eng: 'Organization', he: 'העמותה' },
          path: `about/organization`,
          icon: <LocalLibraryIcon />,
          onClick: () => {
            setMenu(false)
            delayedNavigate('/about/organization')
          },
        },
        {
          title: { eng: 'Accessibility', he: 'נגישות' },
          path: `about/accessibility`,
          icon: <AccessibilityIcon />,
          onClick: () => {
            setMenu(false)
            delayedNavigate('/about/accessibility')
          },
        },
        {
          title: { eng: 'Cenceling', he: 'ביטולים' },
          path: `about/cancel`,
          icon: <DoDisturbIcon />,
          onClick: () => {
            setMenu(false)
            delayedNavigate('/about/cancel')
          },
        },
      ],
      isOpen: false,
      icon: <InfoIcon />,
    },
    {
      id: 8,
      title: { eng: 'Admin', he: 'מנהל' },
      to: 'admin',
      onClick: () => {
        selectLink('/admin')
      },
      dropdown: false,
      icon: <AdminPanelSettingsIcon />,
    },
  ])

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
                windowDimensions.width <= 1150 ? 'mobile' : ''
              }`
            : `app-header full ${
                windowDimensions.width <= 1150 ? 'mobile' : ''
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
                paddingLeft: windowDimensions.width <= 1150 && '1.5em',
              }
            : {
                direction: 'rtl',
                opacity: scrolled ? '0.8' : '',
                paddingRight: windowDimensions.width <= 1150 && '1.5em',
              }
        }
      >
        {' '}
        {windowDimensions.width <= 1150 && (
          <div
            className={`header-buttons-container ${
              prefs.isDarkMode ? 'dark-mode' : ''
            }`}
          >
            <IconButton
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
            </IconButton>
            <IconButton onClick={() => setIsPrefs(!isPrefs)}>
              <SettingsIcon></SettingsIcon>
            </IconButton>
            <IconButton onClick={() => setIsAccessibility(!isAccessibility)}>
              <AccessibleIcon></AccessibleIcon>
            </IconButton>
          </div>
        )}
        {windowDimensions.width <= 1150 && (
          <Menu
            id='basic-menu'
            anchorEl={anchorEl}
            open={menu}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
            disableScrollLock
            PaperProps={{
              sx: {
                bgcolor: prefs.isDarkMode ? '#222' : '#fff',
                color: prefs.isDarkMode ? '#fff' : '#000',
                minWidth: 200,
              },
            }}
          >
            <List
              sx={{
                width: '100%',
                maxWidth: 360,
                bgcolor: 'background.paper',
                // display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                direction: prefs.isEnglish ? 'ltr' : 'rtl',

                bgcolor: prefs.isDarkMode ? '#222' : '#fff',
                color: prefs.isDarkMode ? '#fff' : '#000',
                minWidth: 230,
              }}
              component='nav'
              aria-labelledby='nested-list-subheader'
              subheader={
                <ListSubheader
                  component='div'
                  id='nested-list-subheader'
                  // sx={{ alignSelf: 'center' }}
                  sx={{
                    fontSize: '1.2em',
                    backgroundColor: prefs.isDarkMode ? '#222' : '#fff',
                    color: prefs.isDarkMode ? '#fff' : '#000',
                  }}
                >
                  {prefs.isEnglish ? 'Menu' : 'תפריט'}
                </ListSubheader>
              }
            >
              {links.map((link, index) => {
                if (
                  (link.to === 'admin' && !user) ||
                  (link.to === 'admin' && !user.isAdmin)
                )
                  return (
                    <div key={'LoginOption'}>
                      <ListItemButton
                        sx={{
                          textAlign: 'start',
                          '&:hover': {
                            backgroundColor: prefs.isDarkMode ? '#111' : '',
                          },
                        }}
                        onClick={() => {
                          setMenu(false)
                          if (!user) delayedNavigate('/user/login')
                          else delayedNavigate(`/user/${user._id}`)
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            color: prefs.isDarkMode ? '#fff' : '',
                          }}
                        >
                          {user ? <PersonIcon /> : <LoginIcon />}
                        </ListItemIcon>
                        {user ? (
                          <ListItemText primary={user.fullname} />
                        ) : (
                          <ListItemText
                            primary={prefs.isEnglish ? 'Login' : 'כניסה'}
                          />
                        )}
                      </ListItemButton>
                      {user && (
                        <ListItemButton
                          sx={{
                            textAlign: 'start',
                            '&:hover': {
                              backgroundColor: prefs.isDarkMode ? '#111' : '',
                            },
                          }}
                          onClick={onLogout}
                        >
                          <ListItemIcon
                            sx={{
                              color: prefs.isDarkMode ? '#fff' : '',
                            }}
                          >
                            <LogoutIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={prefs.isEnglish ? 'Logout' : 'יציאה'}
                          />
                        </ListItemButton>
                      )}
                    </div>
                  )
                return link.dropdown ? (
                  <div key={`${index}Link`}>
                    <ListItemButton
                      sx={{
                        textAlign: 'start',
                        '&:hover': {
                          backgroundColor: prefs.isDarkMode ? '#111' : '',
                        },
                      }}
                      onClick={() => handleMenuItemClick(link.id)}
                    >
                      <ListItemIcon
                        sx={{
                          color: prefs.isDarkMode ? '#fff' : '',
                        }}
                      >
                        {link.icon}
                      </ListItemIcon>

                      <ListItemText
                        primary={
                          prefs.isEnglish ? link.title.eng : link.title.he
                        }
                      />
                      {link.isOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    {link.isOpen && (
                      <Divider
                        orientation='horizontal'
                        flexItem
                        sx={{
                          backgroundColor: prefs.isDarkMode ? '#fff' : '',
                        }}
                      />
                    )}
                    <Collapse in={link.isOpen} timeout='auto' unmountOnExit>
                      <List component='div' disablePadding>
                        {link.dropdown.map((option, index) => {
                          return (
                            <ListItemButton
                              sx={{ pl: 4 }}
                              key={`${index}Dropdown`}
                              onClick={option.onClick}
                            >
                              <ListItemIcon
                                sx={{
                                  color: prefs.isDarkMode ? '#fff' : '',
                                }}
                              >
                                {option.icon}
                              </ListItemIcon>
                              <ListItemText
                                primary={
                                  prefs.isEnglish
                                    ? option.title.eng
                                    : option.title.he
                                }
                                sx={{
                                  textAlign: prefs.isEnglish ? 'left' : 'right',
                                }}
                              />
                            </ListItemButton>
                          )
                        })}
                      </List>
                    </Collapse>
                    {link.isOpen && (
                      <Divider
                        orientation='horizontal'
                        flexItem
                        sx={{
                          backgroundColor: prefs.isDarkMode ? '#fff' : '',
                        }}
                      />
                    )}
                  </div>
                ) : (
                  <ListItemButton
                    sx={{
                      textAlign: 'start',
                      '&:hover': {
                        backgroundColor: prefs.isDarkMode ? '#111' : '',
                      },
                    }}
                    key={`${index}ButtonLink`}
                    onClick={() => {
                      setMenu(false)

                      delayedNavigate(`/${link.to}`)
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: prefs.isDarkMode ? '#fff' : '',
                      }}
                    >
                      {link.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={prefs.isEnglish ? link.title.eng : link.title.he}
                    />
                  </ListItemButton>
                )
              })}
            </List>
          </Menu>
        )}
        <nav
          className={`${scrolled ? 'small-header' : ''} ${
            menu ? 'shown' : ''
          } ${menu && prefs.isEnglish ? 'ltr' : ''}`}
          style={scrolled ? { top: '100px' } : { top: '128px' }}
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
          {links.map((link, index) => {
            if (
              (link.to === 'admin' && !user) ||
              (link.to === 'asmin' && !user.isAdmin)
            )
              return
            return (
              <NavLink
                to={link.to}
                onClick={() => selectLink(`/${link.to}`)}
                key={`${index}Link`}
              >
                {(link.dropdown && (
                  <div
                    className='menu'
                    onMouseEnter={handlers[link.to]}
                    onMouseLeave={removeDropdown}
                  >
                    <span>
                      {prefs.isEnglish ? link.title.eng : link.title.he}
                    </span>
                    {isDropdownVisible && hoveredSection === link.to && (
                      <DropDown
                        options={options}
                        setDropdownVisible={setDropdownVisible}
                      />
                    )}
                  </div>
                )) || (
                  <span>
                    {prefs.isEnglish ? link.title.eng : link.title.he}
                  </span>
                )}
              </NavLink>
            )
          })}

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
                    windowDimensions.width <= 1150
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
        {windowDimensions.width <= 1150 && (
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
                      paddingLeft: windowDimensions.width <= 1150 && '0.5em',
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
