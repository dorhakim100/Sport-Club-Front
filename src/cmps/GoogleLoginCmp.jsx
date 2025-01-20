import { useSelector } from 'react-redux'
import { useState } from 'react'
import { parseJwt } from '../services/util.service'
import { showErrorMsg } from '../services/event-bus.service'

import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'

export function GoogleLoginCmp({ handleGoogleLogin }) {
  const clientID = import.meta.env.VITE_GOOGLE_ID

  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const [isRemember, setIsRemember] = useState(false)
  const handleLoginSuccess = async (response) => {
    const { email, name: fullname } = parseJwt(response.credential)

    const cred = {
      username: email,
      fullname: fullname,
      isGoogle: true,
    }
    try {
      await handleGoogleLogin(cred)
    } catch (err) {
      // // console.log(err)
      showErrorMsg(prefs.isEnglish ? `Couldn't login` : 'חיבור נכשל')
    }
  }

  const handleLoginError = (error) => {
    console.error('Login Failed:', error)
    showErrorMsg(prefs.isEnglish ? `Couldn't login` : 'חיבור נכשל')
  }
  return (
    <div className='google-login-container'>
      <b>{prefs.isEnglish ? `Login with Google` : 'חיבור עם גוגל'}</b>
      <GoogleOAuthProvider clientId={clientID}>
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={handleLoginError}
        />
      </GoogleOAuthProvider>
    </div>
  )
}
