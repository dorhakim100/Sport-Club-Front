import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { loadUsers, removeUser } from '../store/actions/user.actions'
import { useNavigate, Outlet } from 'react-router'

import { Nav } from '../cmps/Nav'

export function AdminIndex() {
  const navigate = useNavigate()

  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const user = useSelector((storeState) => storeState.userModule.user)
  const users = useSelector((storeState) => storeState.userModule.users)
  const isLoading = useSelector((storeState) => storeState.userModule.isLoading)
  console.log(user)

  useEffect(() => {
    if (!user.isAdmin) navigate('/')
    loadUsers()
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
      path: 'order',
      he: 'הזמנות',
      eng: 'Orders',
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
