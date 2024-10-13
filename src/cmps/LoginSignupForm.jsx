import { useState, useEffect, useRef } from 'react'
import React from 'react'
import { useSelector } from 'react-redux'
import { Formik } from 'formik'
import { Button } from '@mui/material'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
// import { addComment } from '../store/actions/comment.actions'

export function LoginSignupForm({ isSignup }) {
  const user = useSelector((stateSelector) => stateSelector.userModule.user)
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)

  let initialValues
  let validate
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
        errors.username = pregs.isEnglish
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
    initialValues = { email: '', password: '', username: '' }
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
        errors.username = pregs.isEnglish
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

    const { email, username, fullname } = values
    const comment = {
      email,
      username,
      fullname,
      owner: { id: user._id, fullname: user.fullname, imgUrl: user.imgUrl },
    }
    // console.log(comment)
    try {
      //   await onAddComment(comment)
    } catch (err) {
      console.log(err)
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
              className={
                (errors.fullname &&
                  touched.fullname &&
                  'input-container error full-name') ||
                'input-container full-name'
              }
            >
              <input
                name='fullname'
                type='fullname'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.fullname}
                placeholder={prefs.isEnglish ? 'Full Name' : 'שם מלא'}
                id=''
              />

              <span>
                {errors.fullname && touched.fullname && errors.fullname}
              </span>
            </div>
          )}
          <div
            className={
              (errors.username &&
                touched.username &&
                'input-container error username') ||
              'input-container username'
            }
          >
            <input
              type='username'
              name='username'
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.username}
              placeholder={prefs.isEnglish ? 'Username' : 'שם משתמש'}
            />
            <span>
              {errors.username && touched.username && errors.username}
            </span>
          </div>
          <div
            className={
              (errors.password &&
                touched.password &&
                'input-container error password') ||
              'input-container password'
            }
          >
            <input
              type='password'
              name='password'
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
              placeholder={prefs.isEnglish ? 'Password' : 'סיסמא'}
            />
            {errors.password && touched.password && errors.password}
          </div>
          <div
            className={
              (errors.email &&
                touched.email &&
                'input-container error email') ||
              'input-container email'
            }
          >
            <input
              type='email'
              name='email'
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
              placeholder={prefs.isEnglish ? 'Email' : 'דואר אלקטרוני'}
            />
            <span>{errors.email && touched.email && errors.email}</span>
          </div>
          <Button variant='contained' type='submit' disabled={isSubmitting}>
            {(isSignup && (prefs.isEnglish ? 'Signup' : 'רישום')) ||
              (prefs.isEnglish ? 'Login' : 'חיבור')}
          </Button>
        </form>
      )}
    </Formik>
  )
}
