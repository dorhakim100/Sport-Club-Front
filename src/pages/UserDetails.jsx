import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { loadUser } from '../store/actions/user.actions'
import { store } from '../store/store'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'

// import { socketService, SOCKET_EVENT_USER_UPDATED, SOCKET_EMIT_USER_WATCH } from '../services/socket.service'

import { HeadContainer } from '../cmps/HeadContainer'
import { OrderList } from '../cmps/OrderList.jsx'
import { setIsLoading } from '../store/actions/system.actions'
import { ContactUs } from '../cmps/ContactUs'

export function UserDetails() {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const params = useParams()
  const user = useSelector((storeState) => storeState.userModule.watchedUser)
  const [userName, setUserName] = useState({ he: '', eng: '' })

  useEffect(() => {
    const setUser = async () => {
      try {
        setIsLoading(true)
        const u = await loadUser(params.userId)
        console.log(u)
        setUserName({ he: u.fullname, eng: u.fullname })
      } catch (err) {
        showErrorMsg(
          prefs.isEnglish
            ? `Couldn't show user details`
            : 'לא היה ניתן להציג משתמש'
        )
      } finally {
        setIsLoading(false)
      }
    }
    setUser()

    // socketService.emit(SOCKET_EMIT_USER_WATCH, params.id)
    // socketService.on(SOCKET_EVENT_USER_UPDATED, onUserUpdate)

    return () => {
      // socketService.off(SOCKET_EVENT_USER_UPDATED, onUserUpdate)
    }
  }, [params.id])

  function onUserUpdate(user) {
    showSuccessMsg(
      `This user ${user.fullname} just got updated from socket, new score: ${user.score}`
    )
    store.dispatch({ type: 'SET_WATCHED_USER', user })
  }

  return (
    <section className='user-details'>
      {user && !user.isAdmin && (
        <div>
          {/* <HeadContainer text={userName} /> */}
          <OrderList user={user} />
        </div>
      )}
      <ContactUs />
    </section>
  )
}
