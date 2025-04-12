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
    'https://res.cloudinary.com/dnxi70mfs/image/upload/v1729075214/logo_mp3dgh.png'
  )

  const setLogoMode = () => {
    if (prefs.isDarkMode) {
      setLogo(
        'https://res.cloudinary.com/dnxi70mfs/image/upload/v1729070986/logoDarkMode_i25wgx.png'
      )
    } else {
      setLogo(
        'https://res.cloudinary.com/dnxi70mfs/image/upload/v1729075214/logo_mp3dgh.png'
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
      <img src={logo} alt='logo' width='100%' style={{ maxWidth: '100px' }} />
      <h2>{prefs.isEnglish ? 'Signup' : 'רישום'}</h2>{' '}
      <LoginSignupForm isSignup={true} isRemember={isRemember} />
    </div>
  )
}
