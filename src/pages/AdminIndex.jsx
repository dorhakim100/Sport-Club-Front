import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { loadUsers, removeUser } from '../store/actions/user.actions'
import { useNavigate, Outlet } from 'react-router'

import { Nav } from '../cmps/Nav'
import { userService } from '../services/user/user.service'

export function AdminIndex() {
  const navigate = useNavigate()

  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const user = useSelector((storeState) => storeState.userModule.user)
  const users = useSelector((storeState) => storeState.userModule.users)
  const isLoading = useSelector((storeState) => storeState.userModule.isLoading)

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
    checkUser()
  }, [])

  const origin = {
    path: '/admin',
    he: 'מנהל',
    eng: 'Admin',
  }

  const links = [
    {
      path: 'update',
      he: 'עדכונים',
      eng: 'Updates',
    },
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
    {
      path: 'member',
      he: 'מנויים חדשים',
      eng: 'New Members',
    },
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
