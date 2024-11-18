import { useState, useEffect, useRef } from 'react'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Formik } from 'formik'
import { Button } from '@mui/material'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { login, signup } from '../store/actions/user.actions'
import { setIsLoading, setPrefs } from '../store/actions/system.actions'
// import { addComment } from '../store/actions/comment.actions'

import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'

export function LoginSignupForm({ isSignup }) {
  const user = useSelector((stateSelector) => stateSelector.userModule.user)
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const navigate = useNavigate()
  let initialValues
  let validate

  const [isShown, setIsShown] = useState(false)

  const [isRemember, setIsRemember] = useState(false)

  if (isSignup) {
    initialValues = { email: '', password: '', username: '', fullname: '' }
    validate = (values) => {
      const errors = {}
      if (!values.email) {
        errors.email = prefs.isEnglish ? 'Required' : 'הכרחי'
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
      ) {
        errors.email = prefs.isEnglish
          ? 'Invalid email'
          : 'דואר אלקטרוני לא תקין'
      }
      if (!values.username) {
        errors.username = prefs.isEnglish ? 'Required' : 'הכרחי'
      } else if (values.username.length < 2) {
        errors.username = prefs.isEnglish
          ? 'Invalid username'
          : 'שם משתמש לא תקין'
      }
      if (!values.fullname) {
        errors.fullname = prefs.isEnglish ? 'Required' : 'הכרחי'
      }
      if (!values.password) {
        errors.password = prefs.isEnglish ? 'Required' : 'הכרחי'
      }
      if (values.password.length < 6) {
        errors.password = prefs.isEnglish
          ? 'Password must be at least 6 characters'
          : 'סיסמא צריכה להיות לפחות 6 תווים'
      } else if (!/[0-9]/.test(values.password)) {
        errors.password = prefs.isEnglish
          ? 'Password must contain at least 1 number'
          : 'סיסמא צריכה להכיל לפחות ספרה אחת'
      }
      return errors
    }
  } else {
    // initialValues = { email: '', password: '', username: '' }
    initialValues = { password: '', username: '' }
    validate = (values) => {
      const errors = {}
      // if (!values.email) {
      //   errors.email = prefs.isEnglish ? 'Required' : 'הכרחי'
      // } else if (
      //   !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
      // ) {
      //   errors.email = prefs.isEnglish
      //     ? 'Invalid email'
      //     : 'דואר אלקטרוני לא תקין'
      // }
      if (!values.username) {
        errors.username = prefs.isEnglish ? 'Required' : 'הכרחי'
      } else if (values.username.length < 2) {
        errors.username = prefs.isEnglish
          ? 'Invalid username'
          : 'שם משתמש לא תקין'
      }
      if (!values.password) {
        errors.fullname = prefs.isEnglish ? 'Required' : 'הכרחי'
      }
      if (values.password.length < 6) {
        errors.password = prefs.isEnglish
          ? 'Password must be at least 6 characters'
          : 'סיסמא צריכה להיות לפחות 6 תווים'
      } else if (!/[0-9]/.test(values.password)) {
        errors.password = prefs.isEnglish
          ? 'Password must contain at least 1 number'
          : 'סיסמא צריכה להכיל לפחות ספרה אחת'
      }
      return errors
    }
  }

  async function onSubmit(values) {
    // if (!user) {
    //   showErrorMsg('Login first')
    //   return
    // }
    const { email, username, password, fullname } = values
    let cred
    if (isSignup) {
      cred = {
        email,
        username,
        password,
        fullname,
      }
    } else {
      cred = {
        username,
        password,
      }
    }
    try {
      setIsLoading(true)
      if (isSignup) {
        const signed = await signup(cred)
        showSuccessMsg(
          prefs.isEnglish ? 'Signed in successfully' : 'רישום בוצע בהצלחה'
        )
        if (isRemember) {
          setPrefs({ ...prefs, user: { _id: signed._id } })
        }
        navigate('/')
      } else {
        const logged = await login(cred)
        if (isRemember) {
          setPrefs({ ...prefs, user: { _id: logged._id } })
        }
        showSuccessMsg(
          prefs.isEnglish ? 'Loged in successfully' : 'חיבור בוצע בהצלחה'
        )
        navigate('/')
      }
    } catch (err) {
      console.log(err)
      showErrorMsg(prefs.isEnglish ? `Couldn't login` : 'לא היה ניתן להתחבר')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          //   alert(JSON.stringify(values, null, 2))
          setSubmitting(false)
        }, 400)
        onSubmit(values)
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        /* and other goodies */
      }) => (
        <form onSubmit={handleSubmit}>
          {isSignup && (
            <div
              // className={
              //   prefs.isDarkMode ? 'input-container dark-mode' : 'input-container'
              // }
              className={`input-container full-name ${
                prefs.isDarkMode ? 'dark-mode' : ''
              } ${errors.fullname && touched.fullname ? 'error' : ''}`}
            >
              <div className='fullname-container'>
                <input
                  name='fullname'
                  type='fullname'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.fullname}
                  placeholder={prefs.isEnglish ? 'Full Name' : 'שם מלא'}
                  id=''
                />
              </div>

              <span>
                {errors.fullname && touched.fullname && errors.fullname}
              </span>
            </div>
          )}
          <div
            className={`input-container username ${
              prefs.isDarkMode ? 'dark-mode' : ''
            } ${errors.username && touched.username ? 'error' : ''}`}
          >
            <div className='username-container'>
              <input
                type='username'
                name='username'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.username}
                placeholder={prefs.isEnglish ? 'Username' : 'שם משתמש'}
              />
            </div>
            <span>
              {errors.username && touched.username && errors.username}
            </span>
          </div>
          <div
            className={`input-container password ${
              prefs.isDarkMode ? 'dark-mode' : ''
            } ${errors.password && touched.password ? 'error' : ''}`}
          >
            <div className='password-container'>
              <input
                type={isShown ? 'text' : 'password'}
                name='password'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                placeholder={prefs.isEnglish ? 'Password' : 'סיסמא'}
              />
              <Button
                variant='contained'
                onMouseDown={() => {
                  setIsShown(true)
                }}
                onMouseUp={() => {
                  setIsShown(false)
                }}
              >
                <RemoveRedEyeIcon />
              </Button>
            </div>
            <span>
              {errors.password && touched.password && errors.password}
            </span>
          </div>
          {isSignup && (
            <div
              className={`input-container email ${
                prefs.isDarkMode ? 'dark-mode' : ''
              } ${errors.email && touched.email ? 'error' : ''}`}
            >
              <div className='email-container'>
                <input
                  type='email'
                  name='email'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  placeholder={prefs.isEnglish ? 'Email' : 'דואר אלקטרוני'}
                />
              </div>
              <span>{errors.email && touched.email && errors.email}</span>
            </div>
          )}
          <div
            className={`input-container ${prefs.isDarkMode && 'dark-mode'}`}
            style={{}}
          >
            <div className='checkbox-container'>
              <input
                type='checkbox'
                name=''
                id='isRemember'
                checked={isRemember}
                onChange={() => {
                  console.log(isRemember)
                  setIsRemember((prev) => (prev = !prev))
                }}
              />
              <label htmlFor='isRemember'>
                {prefs.isEnglish ? 'Remember me' : 'זכור משתמש'}
              </label>
            </div>
            <Button variant='contained' type='submit' disabled={isSubmitting}>
              {(isSignup && (prefs.isEnglish ? 'Signup' : 'רישום')) ||
                (prefs.isEnglish ? 'Login' : 'חיבור')}
            </Button>
          </div>
        </form>
      )}
    </Formik>
  )
}
