import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'

import { signup } from '../store/actions/user.actions'

import { LoginSignupForm } from '../cmps/LoginSignupForm'
import { ImgUploader } from '../cmps/ImgUploader'
import { userService } from '../services/user/user.service'

export function Signup() {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const [credentials, setCredentials] = useState(userService.getEmptyUser())
  const navigate = useNavigate()

  function clearState() {
    setCredentials({ username: '', password: '', fullname: '', imgUrl: '' })
  }

  function handleChange(ev) {
    const type = ev.target.type

    const field = ev.target.name
    const value = ev.target.value
    setCredentials({ ...credentials, [field]: value })
  }

  async function onSignup(ev = null) {
    if (ev) ev.preventDefault()

    if (!credentials.username || !credentials.password || !credentials.fullname)
      return
    await signup(credentials)
    clearState()
    navigate('/')
  }

  function onUploaded(imgUrl) {
    setCredentials({ ...credentials, imgUrl })
  }

  return (
    <div className='signup-form' onSubmit={onSignup}>
      <h2>{prefs.isEnglish ? 'Signup' : 'רישום'}</h2>
      <LoginSignupForm isSignup={true} />
      {/* <input
        type='text'
        name='fullname'
        value={credentials.fullname}
        placeholder='Fullname'
        onChange={handleChange}
        required
      />
      <input
        type='text'
        name='username'
        value={credentials.username}
        placeholder='Username'
        onChange={handleChange}
        required
      />
      <input
        type='password'
        name='password'
        value={credentials.password}
        placeholder='Password'
        onChange={handleChange}
        required
      /> */}
      {/* <ImgUploader onUploaded={onUploaded} /> */}
    </div>
  )
}
