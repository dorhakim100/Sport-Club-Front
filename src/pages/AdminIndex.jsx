import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { loadUsers, removeUser } from '../store/actions/user.actions'
import { useNavigate, Outlet, useLocation } from 'react-router'

import { Nav } from '../cmps/Nav'
import { Percentage } from '../cmps/Percentage'
import { TodayClass } from '../cmps/TodayClass.jsx'
import { userService } from '../services/user/user.service'
import { getTodayDayName } from '../services/util.service'
import { classService } from '../services/class/class.service'
import { showErrorMsg } from '../services/event-bus.service'
import { setIsLoading } from '../store/actions/system.actions'
import { HeadContainer } from '../cmps/HeadContainer'

export function AdminIndex() {
  const navigate = useNavigate()
  const location = useLocation()

  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const user = useSelector((storeState) => storeState.userModule.user)
  const users = useSelector((storeState) => storeState.userModule.users)
  const isLoading = useSelector((storeState) => storeState.userModule.isLoading)

  const [classes, setClasses] = useState([])

  useEffect(() => {
    const checkUser = async () => {
      const loggedIn = await userService.getLoggedinUser()
      if (!user) {
        // navigate('/')
        // return
      }
      if (!loggedIn || !loggedIn.isAdmin) {
        navigate('/')
        return
      }
      loadUsers()
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
      path: 'coupon',
      he: 'קופונים',
      eng: 'Coupons',
    },
  ]

  return (
    <section className='admin'>
      <h2>{prefs.isEnglish ? origin.eng : origin.he}</h2>
      <Nav origin={origin} links={links} />
      {isLoading && 'Loading...'}
      {location.pathname === '/admin' && (
        <div className='admin-interface-container'>
          <Percentage percentages={68} />
          <div className='today-class-container'>
            <HeadContainer
              text={{ he: 'שיעורים היום', eng: `Today's classes` }}
            />
            {/* <b>{prefs.isEnglish ?  : }</b> */}
            <TodayClass classes={classes} />
          </div>
        </div>
      )}

      {/* {users && (
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              <pre>{JSON.stringify(user, null, 2)}</pre>
              <button onClick={() => removeUser(user._id)}>
                Remove {user.username}
              </button>
            </li>
          ))}
        </ul>
      )} */}
      <Outlet />
    </section>
  )
}
