import React, { useEffect } from 'react'
import { HeadContainer } from '../cmps/HeadContainer'
import { loadUsers } from '../store/actions/user.actions'
import { userService } from '../services/user/user.service'
import { showErrorMsg } from '../services/event-bus.service'
import { useSelector } from 'react-redux'
import { setIsLoading } from '../store/actions/system.actions'

export function UserIndex() {
  const text = { he: 'משתמשים', eng: 'Users' }

  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)

  const user = useSelector((stateSelector) => stateSelector.userModule.user)

  const users = useSelector((stateSelector) => stateSelector.userModule.users)
  const filter = useSelector((stateSelector) => stateSelector.userModule.filter)
  useEffect(() => {
    const checkUser = async () => {
      try {
        setIsLoading(true)
        const loggedIn = await userService.getLoggedinUser()
        if (!user) {
          // navigate('/')
          // return
        }
        if (!loggedIn || !loggedIn.isAdmin) {
          navigate('/')
          return
        }

        const u = await loadUsers({ ...filter, calledUserId: loggedIn._id })
      } catch (err) {
        console.log(err)
        showErrorMsg(
          prefs.isenglish ? `Couldn't load users` : 'לא ניתן היה לטעון משתמשים'
        )
      } finally {
        setIsLoading(false)
      }
    }
    checkUser()
  }, [])

  return (
    <div className='user-index-container'>
      <HeadContainer text={text} />
      {users.map((user) => {
        return (
          <div className='user-container' key={user._id}>
            {user.fullname}
          </div>
        )
      })}
    </div>
  )
}
