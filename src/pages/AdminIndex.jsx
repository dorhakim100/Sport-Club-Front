import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { loadUsers } from '../store/actions/user.actions'
import { useNavigate, Outlet, useLocation } from 'react-router'
import Lottie from 'react-lottie'

import { Nav } from '../cmps/Nav'
import { Percentage } from '../cmps/Percentage'
import { TodayClass } from '../cmps/TodayClass.jsx'
import { userService } from '../services/user/user.service'
import { getTodayDayName } from '../services/util.service'
import { classService } from '../services/class/class.service'
import { showErrorMsg } from '../services/event-bus.service'
import { setIsLoading } from '../store/actions/system.actions'
import { HeadContainer } from '../cmps/HeadContainer'
import { LoginSignupForm } from '../cmps/LoginSignupForm'
import { LoginSignup } from './LoginSignup.jsx'

import noTasks from '../../public/imgs/no-tasks.json'
import noTasksDark from '../../public/imgs/no-tasks-dark-mode.json'

export function AdminIndex() {
  const navigate = useNavigate()
  const location = useLocation()

  const [animation, setAnimation] = useState(noTasks)

  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const user = useSelector((storeState) => storeState.userModule.user)
  const users = useSelector((storeState) => storeState.userModule.users)
  const isLoading = useSelector((storeState) => storeState.userModule.isLoading)

  const openOrders = useSelector(
    (stateSelector) => stateSelector.paymentModule.openLength
  )
  const openMessages = useSelector(
    (stateSelector) => stateSelector.messageModule.openLength
  )

  const [classes, setClasses] = useState([])

  useEffect(() => {
    const checkUser = async () => {
      const loggedIn = await userService.getLoggedinUser()
      if (!loggedIn) {
        navigate('/admin/login')
        return
      }
      if (!loggedIn.isAdmin) {
        navigate('/')
        return
      }
    }
    const setTodayClasses = async () => {
      try {
        setIsLoading(true)
        const day = getTodayDayName()
        const oc = await classService.getOccurrences({ isAll: true, day: day })
        setClasses(oc)
      } catch (err) {
        showErrorMsg(
          prefs.isEnglish
            ? `Couldn't show classes`
            : 'לא היה ניתן להראות שיעורים'
        )
      } finally {
        setIsLoading(false)
      }
    }
    setTodayClasses()

    checkUser()
  }, [])

  useEffect(() => {
    prefs.isDarkMode ? setAnimation(noTasksDark) : setAnimation(noTasks)
  }, [prefs.isDarkMode])

  const origin = {
    path: '/admin',
    he: 'מנהל',
    eng: 'Admin',
  }

  const links = [
    {
      path: 'message',
      he: 'הודעות',
      eng: 'Messages',
    },
    {
      path: 'order',
      he: 'הזמנות',
      eng: 'Orders',
    },
    // {
    //   path: 'member',
    //   he: 'מנויים חדשים',
    //   eng: 'New Members',
    // },
    {
      path: 'user',
      he: 'משתמשים',
      eng: 'Users',
    },
    {
      path: 'coupon',
      he: 'קופונים',
      eng: 'Coupons',
    },
  ]

  const defaultOptions = {
    loop: false,
    autoplay: true, // Animation will autoplay
    animationData: animation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  }

  if (!user) return <LoginSignup />

  return (
    <section className='admin'>
      <h2>{prefs.isEnglish ? origin.eng : origin.he}</h2>
      <Nav origin={origin} links={links} />
      {isLoading && 'Loading...'}
      {location.pathname === '/admin' && (
        <div className='admin-interface-container'>
          {(openOrders + openMessages !== 0 && (
            <Percentage percentages={openOrders} />
          )) || (
            <div className='tasks-animation-container'>
              <Lottie
                options={defaultOptions}
                width={'fit-content'}
                height={'fit-content'}
              />
              <b>{prefs.isEnglish ? `No tasks` : 'אין משימות פתוחות'}</b>
            </div>
          )}
          <div className='today-class-container'>
            <HeadContainer
              text={{ he: 'שיעורים היום', eng: `Today's classes` }}
            />
            {/* <b>{prefs.isEnglish ?  : }</b> */}
            <TodayClass classes={classes} />
          </div>
        </div>
      )}

      <Outlet />
    </section>
  )
}
