import React, { useEffect, useState, useRef } from 'react'
import { HeadContainer } from '../cmps/HeadContainer'
import { loadUsers } from '../store/actions/user.actions'
import { userService } from '../services/user/user.service'
import { showErrorMsg } from '../services/event-bus.service'
import { useSelector } from 'react-redux'
import { setIsLoading } from '../store/actions/system.actions'

import { debounce } from '../services/util.service'

import { UserPreview } from '../cmps/UserPreview.jsx'
import { Controller } from '../cmps/Controller'
import { UserFilter } from '../cmps/UserFilter.jsx'

export function UserIndex() {
  const text = { he: 'משתמשים', eng: 'Users' }

  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)

  const user = useSelector((stateSelector) => stateSelector.userModule.user)

  const users = useSelector((stateSelector) => stateSelector.userModule.users)
  const filter = useSelector((stateSelector) => stateSelector.userModule.filter)

  const [filterBy, setFilterBy] = useState(userService.getDefaultFilter())
  const [maxPage, setMaxPage] = useState()

  useEffect(() => {
    setUsers()
  }, [])

  useEffect(() => {
    setUsers(filterBy)
  }, [filterBy])

  async function setUsers(filterBy) {
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

      const u = await loadUsers({ ...filterBy, calledUserId: loggedIn._id })
      const m = await userService.getMaxPage({
        ...filterBy,
        calledUserId: loggedIn._id,
      })
      setMaxPage(m)
    } catch (err) {
      //   console.log(err)
      showErrorMsg(
        prefs.isenglish ? `Couldn't load users` : 'לא ניתן היה לטעון משתמשים'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='user-index-container'>
      <HeadContainer text={text} />
      <Controller filter={filter} setFilter={setFilterBy} maxPage={maxPage} />
      <UserFilter setFilter={setFilterBy} />
      <div
        className={`list-container users ${
          prefs.isDarkMode ? 'dark-mode' : ''
        }`}
      >
        {users.map((user) => {
          return <UserPreview user={user} key={user._id} />
        })}
      </div>
    </div>
  )
}
