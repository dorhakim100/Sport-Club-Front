import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useSelector } from 'react-redux'

import { userService } from '../services/user/user.service'
import { login } from '../store/actions/user.actions'

import { LoginSignupForm } from '../cmps/LoginSignupForm'

export function Login() {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const [users, setUsers] = useState([])
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    fullname: '',
  })

  const navigate = useNavigate()

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    const users = await userService.getUsers()
    setUsers(users)
  }

  async function onLogin(ev = null) {
    if (ev) ev.preventDefault()

    if (!credentials.username) return
    await login(credentials)
    navigate('/')
  }

  function handleChange(ev) {
    const field = ev.target.name
    const value = ev.target.value
    setCredentials({ ...credentials, [field]: value })
  }

  return (
    <div className='login-form' onSubmit={onLogin}>
      <h2>{prefs.isEnglish ? 'Login' : 'חיבור'}</h2>
      <LoginSignupForm />
      {/* <select
        name='username'
        value={credentials.username}
        onChange={handleChange}
      >
        <option value=''>Select User</option>
        {users.map((user) => (
          <option key={user._id} value={user.username}>
            {user.fullname}
          </option>
        ))}
      </select>
      <button>Login</button> */}
    </div>
  )
}
