import { Link, NavLink } from 'react-router-dom'

import { useSelector } from 'react-redux'
import { useState, useEffect, useRef, useMemo } from 'react'

import { useNavigate } from 'react-router-dom'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { login, logout, setRemembered } from '../store/actions/user.actions'
import { loadOpenMessages } from '../store/actions/message.actions'
import { smoothScroll, getWindowDimensions } from '../services/util.service'

import {
  SOCKET_EVENT_ADD_MSG,
  SOCKET_EVENT_ADD_ORDER,
} from '../services/socket.service'

import { DropDown } from '../cmps/DropDown.jsx'

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'

import { Button, SvgIcon } from '@mui/material'
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
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip'

import ListSubheader from '@mui/material/ListSubheader'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Collapse from '@mui/material/Collapse'

import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import HomeIcon from '@mui/icons-material/Home'

import Divider from '@mui/material/Divider'

import { socketService } from '../services/socket.service'
import { userService } from '../services/user/user.service'
import {
  setPrefs,
  setIsPrefs,
  setModalMessage,
  setIsModal,
  setIsAccessibility,
  setIsScrolled,
} from '../store/actions/system.actions'
import { loadOpenPayments } from '../store/actions/payment.actions'
import { Logout } from '@mui/icons-material'

import goggles from '../../public/imgs/goggles-svgrepo-com.svg'

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
  const isScrolled = useSelector(
    (stateSelector) => stateSelector.systemModule.isScrolled
  )
  const [logo, setLogo] = useState(
    'https://ik.imagekit.io/n4mhohkzp/logo.png?updatedAt=1755684259540'
  )

  const [isDropdownVisible, setDropdownVisible] = useState(false)
  const [hoveredSection, setHoveredSection] = useState()
  const [options, setOptions] = useState([])

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
      setIsScrolled(true)
    } else if (scrollY === 0) {
      setIsScrolled(false)
    }
  }

  const setHeaderDarkMode = () => {
    if (prefs.isDarkMode) {
      headerRef.current.style.backgroundColor = '#181e24'
      headerRef.current.style.color = 'white'
      headerRef.current.style.transition =
        'background-color 0.3s ease, color 0.3s ease'
      setLogo(
        'https://ik.imagekit.io/n4mhohkzp/logo-dark-mode.png?updatedAt=1755684257089'
      )
    } else {
      headerRef.current.style.backgroundColor = '#dff9ff'
      headerRef.current.style.color = '#2C3E50'
      headerRef.current.style.transition =
        'background-color 0.3s ease, color 0.3s ease'
      setLogo(
        'https://ik.imagekit.io/n4mhohkzp/logo.png?updatedAt=1755684259540'
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
          {
            text: prefs.isEnglish ? 'Privacy Policy' : 'מדיניות פרטיות',
            path: `${section}/privacy`,
          },
        ]
        break

      default:
        break
    }

    setOptions(optionsToSet)
  }

  // const firstVisit = () => {
  //   setModalMessage({
  //     he: (
  //       <div style={{ display: 'grid' }}>
  //         <span style={{ direction: 'rtl' }}>
  //           מעכשיו האתר תומך במצב כהה ושפה האנגלית.
  //         </span>
  //         <span style={{ direction: 'ltr' }}>
  //           We now have both dark mode and English version.
  //         </span>
  //       </div>
  //     ),
  //     eng: (
  //       <div style={{ display: 'grid' }}>
  //         <span style={{ direction: 'rtl' }}>
  //           האתר החדש תומך באנגלית ובמצב כהה.{' '}
  //         </span>
  //         <span style={{ direction: 'ltr' }}>
  //           Our new site now has both dark mode and English support.{' '}
  //         </span>
  //       </div>
  //     ),
  //     func: () => {
  //       setIsPrefs(true)
  //       setIsModal(false)
  //     },
  //   })
  //   setIsModal(true)
  //   setPrefs({ ...prefs, isFirstTime: false })
  // }
  // useEffect(() => {
  //   if (prefs.isFirstTime) {
  //     setTimeout(() => {
  //       firstVisit()
  //     }, 2000)
  //   }
  // }, [])

  const opacityUp = () => {
    headerRef.current.style.opacity = '1'
    headerRef.current.style.transition = '0.1s ease-in'
  }

  const opacityDown = () => {
    if (isScrolled) {
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

    setMenu(false)
    delayedNavigate(path)

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
      id: 9,
      title: { eng: 'Admin', he: 'מנהל' },
      to: 'admin',
      onClick: () => {
        selectLink('/admin')
      },
      dropdown: false,
      icon: <AdminPanelSettingsIcon />,
    },
    {
      id: 0,
      title: { eng: 'Home', he: 'בית' },
      to: '',
      onClick: () => {
        delayedNavigate('')
      },
      dropdown: false,
      icon: <HomeIcon />,
    },
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
      title: { eng: 'Opening times', he: 'שעות הפתיחה' },
      to: `about/times`,
      icon: <QueryBuilderIcon />,
      onClick: () => {
        // setMenu(false)
        delayedNavigate('/about/times')
      },
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
      title: { eng: 'Facilities', he: 'מתקני המועדון' },
      to: 'facilities',
      onClick: () => {
        delayedNavigate('/facilities')
      },
      dropdown: false,
      icon: <PoolIcon />,
    },
    {
      id: 5,
      title: { eng: 'Member', he: 'מנויים' },
      to: 'member',
      onClick: () => {
        delayedNavigate('/member')
      },
      dropdown: false,
      icon: <CardMembershipIcon />,
    },
    {
      id: 6,
      title: { eng: 'Store', he: 'כרטיסיות וציוד' },
      to: 'item',
      onClick: () => {
        selectLink('/item')
      },
      dropdown: [
        {
          title: { eng: 'All Items', he: 'כל המוצרים' },
          path: `item`,
          icon: <ShoppingBagIcon />,
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
          icon: <GogglesIcon />,
          // icon: <MoreIcon />,
          onClick: () => {
            setMenu(false)
            delayedNavigate('/item/accessories')
          },
        },
      ],
      icon: <AddShoppingCartIcon />,
      isOpen: false,
    },
    {
      id: 7,
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
          icon: <PilatesIcon />,
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
      id: 8,
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
        {
          title: { eng: 'Privacy Policy', he: 'מדיניות פרטיות' },
          path: `about/privacy`,
          icon: <PrivacyTipIcon />,
          onClick: () => {
            setMenu(false)
            delayedNavigate('/about/privacy')
          },
        },
      ],
      isOpen: false,
      icon: <InfoIcon />,
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
          isScrolled
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
                opacity: isScrolled ? '0.8' : '',
                paddingLeft: windowDimensions.width <= 1150 && '1.5em',
              }
            : {
                direction: 'rtl',
                opacity: isScrolled ? '0.8' : '',
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
              variant="contained"
              onClick={toggleMenu}
              className="menu-btn"
            >
              {(menu && (
                <>
                  {(user && user.isAdmin && openTasks > 0 && (
                    <div className="notification">
                      <span>{openTasks}</span>
                    </div>
                  )) ||
                    (user && cart && cart.length > 0 && (
                      <div className="notification">
                        {' '}
                        <span>{cartLength}</span>
                      </div>
                    ))}
                  <MenuOpenIcon />
                </>
              )) || (
                <>
                  {(user && user.isAdmin && openTasks > 0 && (
                    <div className="notification">
                      <span>{openTasks}</span>
                    </div>
                  )) ||
                    (user && cart && cart.length > 0 && (
                      <div className="notification">
                        {' '}
                        <span>{cartLength}</span>
                      </div>
                    ))}
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
            id="basic-menu"
            anchorEl={anchorEl}
            open={menu}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
            // disableScrollLock={false}
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
              component="nav"
              aria-labelledby="nested-list-subheader"
              subheader={
                <ListSubheader
                  component="div"
                  id="nested-list-subheader"
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
                    <div key={`${index}Login`}>
                      <Divider
                        orientation="horizontal"
                        flexItem
                        sx={{
                          backgroundColor: prefs.isDarkMode ? '#fff' : '',
                        }}
                      />
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
                          onClick={() => {
                            setMenu(false)

                            delayedNavigate(`/user/${user._id}/cart`)
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              color: prefs.isDarkMode ? '#fff' : '',
                            }}
                          >
                            <ShoppingCartIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={prefs.isEnglish ? 'Cart' : 'עגלת קניות'}
                          />
                          {cart && cart.length > 0 && (
                            <div className="notification list">
                              {' '}
                              <span>{cartLength}</span>
                            </div>
                          )}
                        </ListItemButton>
                      )}
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
                      )}{' '}
                      <Divider
                        orientation="horizontal"
                        flexItem
                        sx={{
                          backgroundColor: prefs.isDarkMode ? '#fff' : '',
                        }}
                      />
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
                        orientation="horizontal"
                        flexItem
                        sx={{
                          backgroundColor: prefs.isDarkMode ? '#fff' : '',
                        }}
                      />
                    )}
                    <Collapse in={link.isOpen} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {link.dropdown.map((option, index) => {
                          return (
                            <ListItemButton
                              sx={{
                                pl: 4,
                                '&:hover': {
                                  backgroundColor: prefs.isDarkMode
                                    ? '#111'
                                    : '',
                                },
                              }}
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
                        orientation="horizontal"
                        flexItem
                        sx={{
                          backgroundColor: prefs.isDarkMode ? '#fff' : '',
                        }}
                      />
                    )}
                  </div>
                ) : (
                  <div key={`${index}Link`}>
                    {link.to === 'admin' && (
                      <Divider
                        orientation="horizontal"
                        flexItem
                        sx={{
                          backgroundColor: prefs.isDarkMode ? '#fff' : '',
                        }}
                      />
                    )}
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
                        primary={
                          prefs.isEnglish ? link.title.eng : link.title.he
                        }
                      />
                      {link.to === 'admin' &&
                        user &&
                        user.isAdmin &&
                        openTasks > 0 && (
                          <div className="notification list">
                            {' '}
                            <span>{openTasks}</span>
                          </div>
                        )}
                    </ListItemButton>
                    {link.to === 'admin' && (
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
                    {link.to === 'admin' && (
                      <Divider
                        orientation="horizontal"
                        flexItem
                        sx={{
                          backgroundColor: prefs.isDarkMode ? '#fff' : '',
                        }}
                      />
                    )}
                  </div>
                )
              })}
            </List>
          </Menu>
        )}
        <nav
          className={`${isScrolled ? 'small-header' : ''} ${
            menu ? 'shown' : ''
          } ${menu && prefs.isEnglish ? 'ltr' : ''}`}
          style={isScrolled ? { top: '100px' } : { top: '128px' }}
          onMouseLeave={checkHoverOptionsButton}
        >
          <NavLink
            ref={logoRef}
            to="/"
            className="logo"
            onClick={() => selectLink('/')}
          >
            <img src={logo} alt="" />
          </NavLink>
          {links.map((link, index) => {
            if (
              (link.to === 'admin' && !user) ||
              (link.to === 'admin' && !user.isAdmin)
            )
              return
            if (link.to === '') return
            return (
              <NavLink
                to={link.to}
                onClick={() => selectLink(`/${link.to}`)}
                key={`${index}Link`}
                className={`${!link.dropdown ? 'underline-animation' : ''}`}
              >
                {(link.dropdown && (
                  <div
                    className="menu"
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
                )) ||
                  (link.to === 'admin' &&
                  user &&
                  user.isAdmin &&
                  openTasks > 0 ? (
                    <span className="notification-link">
                      {prefs.isEnglish ? link.title.eng : link.title.he}
                      <div className="notification">
                        <span>{openTasks}</span>
                      </div>
                    </span>
                  ) : (
                    <span>
                      {prefs.isEnglish ? link.title.eng : link.title.he}
                    </span>
                  ))}
              </NavLink>
            )
          })}

          {!user && (
            <NavLink
              to="user/login"
              className="login-link underline-animation"
              onClick={() => selectLink('/user/login')}
            >
              {prefs.isEnglish ? 'Login' : 'כניסה'}
            </NavLink>
          )}

          {user && (
            <div className="user-info">
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
                    variant="contained"
                    onClick={() => selectLink(`/user/${user._id}/cart`)}
                    className="notification-btn"
                  >
                    {cart && cart.length > 0 && <span>{cartLength}</span>}
                    <ShoppingCartIcon />
                  </Button>
                </NavLink>
              )}
              <Button onClick={clickOnLogout} variant="contained">
                {prefs.isEnglish ? 'Logout' : 'יציאה'}
              </Button>
            </div>
          )}
        </nav>
        {windowDimensions.width <= 1150 && (
          <NavLink
            to="/"
            className="logo"
            onClick={() => selectLink('/')}
            ref={logoRef}
          >
            <img
              src={logo}
              alt=""
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

function GogglesIcon() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  if (prefs.isDarkMode)
    return (
      <svg
        fill="#ffffff"
        height="200px"
        width="200px"
        version="1.1"
        id="Capa_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 59 59"
        xml:space="preserve"
        stroke="#ffffff"
        style={{
          width: '1.5em',
          height: '1.5em',
        }}
      >
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          <g>
            <g>
              <path d="M58.987,34.691c0,0,0.013-0.325,0.013-0.416c0-10.843-4.598-17.677-14.033-20.894c-0.157-0.952-0.952-1.739-2.047-1.972 l-2.025-0.431c-7.781-1.655-16.008-1.655-23.789,0l-2.025,0.431c-1.225,0.26-2.08,1.212-2.08,2.315v0.031 C4.378,17.088,0,23.986,0,34.275c0,0.087,0.012,0.392,0.012,0.393c0.005,0.307,0.085,0.603,0.222,0.871 C0.097,35.941,0,36.36,0,36.8v5.903C0,44.07,0.713,45.332,1.865,46c1.141,0.661,2.865,1.659,5.086,2.425 c1.631,0.563,3.333,0.839,5.04,0.839c3.352,0,6.719-1.064,9.585-3.113c1.17-0.836,2.337-1.806,3.48-2.876h8.887 c1.143,1.07,2.31,2.04,3.48,2.876c2.866,2.049,6.233,3.113,9.585,3.113c1.706,0,3.41-0.276,5.04-0.839 c2.221-0.766,3.945-1.765,5.09-2.428C58.287,45.332,59,44.07,59,42.704V36.8c0-0.44-0.096-0.859-0.234-1.26 C58.903,35.275,58.983,34.985,58.987,34.691z M45,15.506c7.821,2.912,11.752,8.777,11.988,17.883 c-0.174-0.115-0.363-0.212-0.542-0.322c-0.265-0.163-0.529-0.326-0.803-0.477c-0.249-0.137-0.507-0.26-0.763-0.387 c-0.286-0.141-0.571-0.284-0.865-0.412c-0.073-0.032-0.141-0.071-0.214-0.102c-0.049-1.073-0.107-1.769-0.176-2.071l-0.055-0.17 c-0.739-3.779-2.425-6.632-5.152-8.722c-0.962-0.737-2.15-1.208-3.418-1.362C45,19.364,45,15.506,45,15.506z M15,13.724 c0-0.106,0.173-0.291,0.496-0.359l2.025-0.431c7.509-1.598,15.448-1.598,22.957,0l2.025,0.431C42.827,13.434,43,13.618,43,13.724 v6.436l-0.004,0.075c-0.094,0.034-0.341,0.078-0.788-0.017l-1.234-0.26c-1.924-2.249-6.352-3.683-11.474-3.683 c-4.971,0-9.352,1.378-11.339,3.539l-0.096,0.017c-0.26,0.046-0.52,0.092-0.777,0.146l-1.131,0.241 c-0.567,0.121-1.003,0.026-1.157-0.054C15,20.164,15,13.724,15,13.724z M13,15.903v3.787c-0.901,0.155-1.735,0.506-2.414,1.025 c-2.727,2.084-4.412,4.94-5.144,8.697c-0.029,0.124-0.11,0.473-0.179,2.251c-0.08,0.034-0.154,0.076-0.234,0.111 c-0.311,0.135-0.612,0.283-0.913,0.431c-0.251,0.124-0.502,0.245-0.746,0.378c-0.281,0.154-0.551,0.321-0.823,0.487 c-0.177,0.108-0.364,0.204-0.536,0.318C2.247,24.788,5.939,18.914,13,15.903z M7.604,46.534c-2.038-0.703-3.598-1.606-4.74-2.268 C2.331,43.958,2,43.359,2,42.704V36.8c0-0.284,0.068-0.559,0.185-0.807l0.061-0.109c0.068-0.122,0.143-0.23,0.226-0.325 c0.084-0.094,0.175-0.182,0.277-0.253c0.39-0.272,0.798-0.523,1.213-0.763c0.106-0.061,0.213-0.122,0.32-0.181 c0.405-0.223,0.817-0.436,1.243-0.629c0.032-0.015,0.065-0.029,0.097-0.044c0.987-0.441,2.028-0.804,3.119-1.082H8.739 c2.948-0.751,5.984-0.608,8.784,0.369c-0.519-0.051-1.047-0.085-1.592-0.085c-5.646,0-10.068,2.845-10.068,6.478 s4.423,6.478,10.068,6.478c0.934,0,1.83-0.085,2.683-0.231C15.154,47.435,11.242,47.79,7.604,46.534z M15.932,43.847 c-4.373,0-8.068-2.051-8.068-4.478s3.695-4.478,8.068-4.478S24,36.942,24,39.369S20.305,43.847,15.932,43.847z M33,41.275h-7v-3h7 V41.275z M33.477,36.275h-7.954c-0.574-0.876-1.856-2.397-4.481-3.893c-3.888-2.216-8.436-2.823-12.795-1.713H8.246 c-0.323,0.082-0.632,0.189-0.947,0.285c0.046-0.839,0.088-1.071,0.099-1.123c0.642-3.291,2.082-5.752,4.403-7.526 c0.495-0.379,1.142-0.606,1.838-0.674c0.021,0.019,0.037,0.042,0.06,0.06c0.788,0.639,2.003,0.669,2.875,0.484l1.131-0.241 c0.234-0.05,0.471-0.091,0.707-0.133l0.83-0.153l0.231-0.292c1.436-1.814,5.56-3.081,10.027-3.081 c5.368,0,9.005,1.65,10.112,3.184l0.228,0.316l1.952,0.4c0.314,0.067,0.616,0.1,0.9,0.1c0.643,0,1.196-0.169,1.604-0.5 c0.149-0.121,0.267-0.266,0.37-0.421c0.948,0.1,1.834,0.423,2.534,0.96c2.323,1.781,3.765,4.24,4.407,7.523 c0.019,0.092,0.043,0.182,0.073,0.27c0.014,0.093,0.043,0.337,0.078,0.865c-0.334-0.102-0.662-0.215-1.005-0.302h-0.001 c-4.363-1.109-8.906-0.502-12.795,1.713C35.332,33.878,34.051,35.399,33.477,36.275z M35,39.369c0-2.427,3.695-4.478,8.068-4.478 s8.068,2.05,8.068,4.478s-3.695,4.478-8.068,4.478S35,41.796,35,39.369z M57,42.704c0,0.655-0.331,1.254-0.867,1.565 c-1.139,0.659-2.698,1.562-4.736,2.265c-3.638,1.255-7.55,0.9-11.011-0.919c0.853,0.146,1.749,0.231,2.683,0.231 c5.646,0,10.068-2.846,10.068-6.478s-4.423-6.478-10.068-6.478c-0.545,0-1.073,0.034-1.592,0.085 c2.8-0.977,5.837-1.12,8.784-0.369c0.88,0.224,1.718,0.517,2.53,0.847c0.449,0.183,0.888,0.382,1.317,0.597 c0.168,0.084,0.338,0.165,0.503,0.255c0.566,0.307,1.117,0.634,1.637,0.996c0.002,0.001,0.003,0.002,0.005,0.003 c0.103,0.071,0.193,0.159,0.277,0.253c0.082,0.095,0.158,0.203,0.226,0.325l0.061,0.109C56.932,36.241,57,36.517,57,36.8V42.704z"></path>{' '}
            </g>
          </g>
        </g>
      </svg>
    )
  return (
    <svg
      fill={prefs.isDarMode ? 'white' : '#757575'}
      height="200px"
      width="200px"
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 59 59"
      xml:space="preserve"
      stroke={prefs.isDarMode ? 'white' : '#757575'}
      style={{
        width: '1.5em',
        height: '1.5em',
      }}
    >
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <g>
          <g>
            <path d="M58.987,34.691c0,0,0.013-0.325,0.013-0.416c0-10.843-4.598-17.677-14.033-20.894c-0.157-0.952-0.952-1.739-2.047-1.972 l-2.025-0.431c-7.781-1.655-16.008-1.655-23.789,0l-2.025,0.431c-1.225,0.26-2.08,1.212-2.08,2.315v0.031 C4.378,17.088,0,23.986,0,34.275c0,0.087,0.012,0.392,0.012,0.393c0.005,0.307,0.085,0.603,0.222,0.871 C0.097,35.941,0,36.36,0,36.8v5.903C0,44.07,0.713,45.332,1.865,46c1.141,0.661,2.865,1.659,5.086,2.425 c1.631,0.563,3.333,0.839,5.04,0.839c3.352,0,6.719-1.064,9.585-3.113c1.17-0.836,2.337-1.806,3.48-2.876h8.887 c1.143,1.07,2.31,2.04,3.48,2.876c2.866,2.049,6.233,3.113,9.585,3.113c1.706,0,3.41-0.276,5.04-0.839 c2.221-0.766,3.945-1.765,5.09-2.428C58.287,45.332,59,44.07,59,42.704V36.8c0-0.44-0.096-0.859-0.234-1.26 C58.903,35.275,58.983,34.985,58.987,34.691z M45,15.506c7.821,2.912,11.752,8.777,11.988,17.883 c-0.174-0.115-0.363-0.212-0.542-0.322c-0.265-0.163-0.529-0.326-0.803-0.477c-0.249-0.137-0.507-0.26-0.763-0.387 c-0.286-0.141-0.571-0.284-0.865-0.412c-0.073-0.032-0.141-0.071-0.214-0.102c-0.049-1.073-0.107-1.769-0.176-2.071l-0.055-0.17 c-0.739-3.779-2.425-6.632-5.152-8.722c-0.962-0.737-2.15-1.208-3.418-1.362C45,19.364,45,15.506,45,15.506z M15,13.724 c0-0.106,0.173-0.291,0.496-0.359l2.025-0.431c7.509-1.598,15.448-1.598,22.957,0l2.025,0.431C42.827,13.434,43,13.618,43,13.724 v6.436l-0.004,0.075c-0.094,0.034-0.341,0.078-0.788-0.017l-1.234-0.26c-1.924-2.249-6.352-3.683-11.474-3.683 c-4.971,0-9.352,1.378-11.339,3.539l-0.096,0.017c-0.26,0.046-0.52,0.092-0.777,0.146l-1.131,0.241 c-0.567,0.121-1.003,0.026-1.157-0.054C15,20.164,15,13.724,15,13.724z M13,15.903v3.787c-0.901,0.155-1.735,0.506-2.414,1.025 c-2.727,2.084-4.412,4.94-5.144,8.697c-0.029,0.124-0.11,0.473-0.179,2.251c-0.08,0.034-0.154,0.076-0.234,0.111 c-0.311,0.135-0.612,0.283-0.913,0.431c-0.251,0.124-0.502,0.245-0.746,0.378c-0.281,0.154-0.551,0.321-0.823,0.487 c-0.177,0.108-0.364,0.204-0.536,0.318C2.247,24.788,5.939,18.914,13,15.903z M7.604,46.534c-2.038-0.703-3.598-1.606-4.74-2.268 C2.331,43.958,2,43.359,2,42.704V36.8c0-0.284,0.068-0.559,0.185-0.807l0.061-0.109c0.068-0.122,0.143-0.23,0.226-0.325 c0.084-0.094,0.175-0.182,0.277-0.253c0.39-0.272,0.798-0.523,1.213-0.763c0.106-0.061,0.213-0.122,0.32-0.181 c0.405-0.223,0.817-0.436,1.243-0.629c0.032-0.015,0.065-0.029,0.097-0.044c0.987-0.441,2.028-0.804,3.119-1.082H8.739 c2.948-0.751,5.984-0.608,8.784,0.369c-0.519-0.051-1.047-0.085-1.592-0.085c-5.646,0-10.068,2.845-10.068,6.478 s4.423,6.478,10.068,6.478c0.934,0,1.83-0.085,2.683-0.231C15.154,47.435,11.242,47.79,7.604,46.534z M15.932,43.847 c-4.373,0-8.068-2.051-8.068-4.478s3.695-4.478,8.068-4.478S24,36.942,24,39.369S20.305,43.847,15.932,43.847z M33,41.275h-7v-3h7 V41.275z M33.477,36.275h-7.954c-0.574-0.876-1.856-2.397-4.481-3.893c-3.888-2.216-8.436-2.823-12.795-1.713H8.246 c-0.323,0.082-0.632,0.189-0.947,0.285c0.046-0.839,0.088-1.071,0.099-1.123c0.642-3.291,2.082-5.752,4.403-7.526 c0.495-0.379,1.142-0.606,1.838-0.674c0.021,0.019,0.037,0.042,0.06,0.06c0.788,0.639,2.003,0.669,2.875,0.484l1.131-0.241 c0.234-0.05,0.471-0.091,0.707-0.133l0.83-0.153l0.231-0.292c1.436-1.814,5.56-3.081,10.027-3.081 c5.368,0,9.005,1.65,10.112,3.184l0.228,0.316l1.952,0.4c0.314,0.067,0.616,0.1,0.9,0.1c0.643,0,1.196-0.169,1.604-0.5 c0.149-0.121,0.267-0.266,0.37-0.421c0.948,0.1,1.834,0.423,2.534,0.96c2.323,1.781,3.765,4.24,4.407,7.523 c0.019,0.092,0.043,0.182,0.073,0.27c0.014,0.093,0.043,0.337,0.078,0.865c-0.334-0.102-0.662-0.215-1.005-0.302h-0.001 c-4.363-1.109-8.906-0.502-12.795,1.713C35.332,33.878,34.051,35.399,33.477,36.275z M35,39.369c0-2.427,3.695-4.478,8.068-4.478 s8.068,2.05,8.068,4.478s-3.695,4.478-8.068,4.478S35,41.796,35,39.369z M57,42.704c0,0.655-0.331,1.254-0.867,1.565 c-1.139,0.659-2.698,1.562-4.736,2.265c-3.638,1.255-7.55,0.9-11.011-0.919c0.853,0.146,1.749,0.231,2.683,0.231 c5.646,0,10.068-2.846,10.068-6.478s-4.423-6.478-10.068-6.478c-0.545,0-1.073,0.034-1.592,0.085 c2.8-0.977,5.837-1.12,8.784-0.369c0.88,0.224,1.718,0.517,2.53,0.847c0.449,0.183,0.888,0.382,1.317,0.597 c0.168,0.084,0.338,0.165,0.503,0.255c0.566,0.307,1.117,0.634,1.637,0.996c0.002,0.001,0.003,0.002,0.005,0.003 c0.103,0.071,0.193,0.159,0.277,0.253c0.082,0.095,0.158,0.203,0.226,0.325l0.061,0.109C56.932,36.241,57,36.517,57,36.8V42.704z"></path>{' '}
          </g>
        </g>
      </g>
    </svg>
  )
}

function PilatesIcon() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)

  if (prefs.isDarkMode)
    return (
      <svg
        fill="#ffffff"
        height="200px"
        width="200px"
        version="1.1"
        id="Capa_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 399.421 399.421"
        xml:space="preserve"
        stroke="#ffffff"
        style={{
          width: '1.5em',
          height: '1.5em',
        }}
      >
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          <path d="M390.421,90.522h-25.905c-0.123-0.003-0.249-0.003-0.372,0h-25.901c-4.971,0-9,4.029-9,9s4.029,9,9,9h17.087v19.085 l-170.319,64.885H95.949l-22.765-31.203h14.013c4.971,0,9-4.029,9-9s-4.029-9-9-9H55.684c-0.144-0.004-0.287-0.004-0.431,0H35.021 c-4.971,0-9,4.029-9,9s4.029,9,9,9h15.882l22.765,31.203H9c-4.971,0-9,4.029-9,9v98.409c0,4.971,4.029,9,9,9h42.09 c4.971,0,9-4.029,9-9v-47.32h253.151v47.32c0,4.971,4.029,9,9,9h42.09c4.971,0,9-4.029,9-9v-98.409c0-0.063,0-0.127-0.002-0.191 v-67.284c0.003-0.139,0.003-0.278,0-0.418v-25.076h17.091c4.971,0,9-4.029,9-9S395.392,90.522,390.421,90.522z M355.33,146.869 v45.623H235.572L355.33,146.869z M42.09,290.901H18v-38.32h24.09V290.901z M355.332,290.901h-24.09v-38.32h24.09V290.901z M355.332,234.581h-33.09H18v-24.089h73.28c0.068,0.001,0.135,0.001,0.203,0h94.981c0.137,0.003,0.273,0.003,0.41,0h168.458V234.581 z"></path>{' '}
        </g>
      </svg>
    )

  return (
    <svg
      fill="#757575"
      height="200px"
      width="200px"
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 399.421 399.421"
      xml:space="preserve"
      stroke="#757575"
      style={{
        width: '1.5em',
        height: '1.5em',
      }}
    >
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <path d="M390.421,90.522h-25.905c-0.123-0.003-0.249-0.003-0.372,0h-25.901c-4.971,0-9,4.029-9,9s4.029,9,9,9h17.087v19.085 l-170.319,64.885H95.949l-22.765-31.203h14.013c4.971,0,9-4.029,9-9s-4.029-9-9-9H55.684c-0.144-0.004-0.287-0.004-0.431,0H35.021 c-4.971,0-9,4.029-9,9s4.029,9,9,9h15.882l22.765,31.203H9c-4.971,0-9,4.029-9,9v98.409c0,4.971,4.029,9,9,9h42.09 c4.971,0,9-4.029,9-9v-47.32h253.151v47.32c0,4.971,4.029,9,9,9h42.09c4.971,0,9-4.029,9-9v-98.409c0-0.063,0-0.127-0.002-0.191 v-67.284c0.003-0.139,0.003-0.278,0-0.418v-25.076h17.091c4.971,0,9-4.029,9-9S395.392,90.522,390.421,90.522z M355.33,146.869 v45.623H235.572L355.33,146.869z M42.09,290.901H18v-38.32h24.09V290.901z M355.332,290.901h-24.09v-38.32h24.09V290.901z M355.332,234.581h-33.09H18v-24.089h73.28c0.068,0.001,0.135,0.001,0.203,0h94.981c0.137,0.003,0.273,0.003,0.41,0h168.458V234.581 z"></path>{' '}
      </g>
    </svg>
  )
}
