import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'

import { LoginSignupForm } from '../cmps/LoginSignupForm'
import { userService } from '../services/user/user.service'

export function Signup() {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const [credentials, setCredentials] = useState(userService.getEmptyUser())
  const navigate = useNavigate()

  const isRemember = useSelector(
    (stateSelector) => stateSelector.userModule.isRemember
  )
  return (
    <div className='signup-form'>
      <h2>{prefs.isEnglish ? 'Signup' : 'רישום'}</h2>
      <LoginSignupForm isSignup={true} isRemember={isRemember} />
    </div>
  )
}
