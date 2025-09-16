import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'

import { login } from '../store/actions/user.actions'

import { LoginSignupForm } from '../cmps/LoginSignupForm'
import { showErrorMsg } from '../services/event-bus.service'
import { setIsLoading } from '../store/actions/system.actions'

export function Login() {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const [users, setUsers] = useState([])
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    fullname: '',
  })

  const isRemember = useSelector(
    (stateSelector) => stateSelector.userModule.isRemember
  )

  const navigate = useNavigate()

  const [logo, setLogo] = useState(
    'https://ik.imagekit.io/n4mhohkzp/logo.png?updatedAt=1755684259540'
  )

  const setLogoMode = () => {
    if (prefs.isDarkMode) {
      setLogo(
        'https://ik.imagekit.io/n4mhohkzp/logo-dark-mode.png?updatedAt=1755684257089'
      )
    } else {
      setLogo(
        'https://ik.imagekit.io/n4mhohkzp/logo.png?updatedAt=1755684259540'
      )
    }
  }

  useEffect(() => {
    setLogoMode()
  }, [prefs.isDarkMode])

  // useEffect(() => {
  //   loadUsers()
  // }, [])

  // async function loadUsers() {
  //   const users = await userService.getUsers()
  //   setUsers(users)
  // }

  async function onLogin(ev = null) {
    if (ev) ev.preventDefault()

    if (!credentials.username) return

    try {
      setIsLoading(true)
      await login(credentials)
      navigate('/')
    } catch (err) {
      showErrorMsg(prefs.isEnglish ? `Couldn't login` : 'חיבור לא הצליח')
    } finally {
      setIsLoading(false)
    }
  }

  function handleChange(ev) {
    const field = ev.target.name
    const value = ev.target.value
    setCredentials({ ...credentials, [field]: value })
  }

  return (
    <div className='login-form' onSubmit={onLogin}>
      <img src={logo} alt='logo' width='100%' style={{ maxWidth: '100px' }} />

      <h2 className={prefs.isDarkMode ? 'dark-mode' : ''}>
        {prefs.isEnglish ? 'Login' : 'חיבור'}
      </h2>
      <LoginSignupForm isRemember={isRemember} />
    </div>
  )
}
