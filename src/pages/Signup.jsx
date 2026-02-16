import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'

import { LoginSignupForm } from '../cmps/LoginSignupForm'
import { userService } from '../services/user/user.service'

export function Signup() {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const [credentials, setCredentials] = useState(userService.getEmptyUser())
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

  const isRemember = useSelector(
    (stateSelector) => stateSelector.userModule.isRemember
  )
  return (
    <div className='signup-form'>
      <img
        src={logo}
        alt='logo'
        width='100%'
        style={{ maxWidth: '100px' }}
      />
      <h2>{prefs.isEnglish ? 'Signup' : 'רישום'}</h2>{' '}
      <LoginSignupForm
        isSignup={true}
        isRemember={isRemember}
      />
    </div>
  )
}
