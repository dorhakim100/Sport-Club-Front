import { useState, useRef, useEffect } from 'react'
import React from 'react'
import { Routes, Route } from 'react-router'

import { useSelector } from 'react-redux'

import { HomePage } from './pages/HomePage'
import {
  AboutUs,
  AboutTeam,
  Facilities,
  Organization,
  AccessibilityPage,
} from './pages/AboutUs'
import { Class } from './pages/Class.jsx'
import { Schedule } from './pages/Schedule.jsx'
import { TrainerIndex } from './pages/TrainerIndex.jsx'
import {
  Activities,
  Swimming,
  Tennis,
  Care,
  Restaurant,
} from './pages/Activities.jsx'
import { ItemIndex } from './pages/ItemIndex'
import { ItemDetails } from './pages/ItemDetails'
import { LoginSignup } from './pages/LoginSignup.jsx'
import { Login } from './pages/Login.jsx'
import { Signup } from './pages/Signup.jsx'
import { UserDetails } from './pages/UserDetails'
import { AdminIndex } from './pages/AdminIndex'

import { AppHeader } from './cmps/AppHeader'
import { Accessibility } from './cmps/Accessibility'
import { AccessibilityButton } from './cmps/AccessibilityButton'
import { AppFooter } from './cmps/AppFooter'
import { UserMsg } from './cmps/UserMsg.jsx'
import { Loader } from './cmps/Loader'

import './App.css'

export function App() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  const bodyRef = useRef()

  return (
    <>
      <AccessibilityButton />
      <Accessibility bodyRef={bodyRef} />
      <Loader />
      <main
        className='main-container'
        style={prefs.isEnglish ? { direction: 'ltr' } : { direction: 'rtl' }}
        ref={bodyRef}
      >
        <AppHeader />

        <section className='page-container'>
          <Routes>
            <Route path='' element={<HomePage />} />
            <Route path='about' element={<AboutUs />}>
              <Route path='team' element={<AboutTeam />} />
              <Route path='facilities' element={<Facilities />} />
              <Route path='organization' element={<Organization />} />
              <Route path='accessibility' element={<AccessibilityPage />} />
            </Route>
            <Route path='class' element={<Class />} />
            <Route path='class/schedule' element={<Schedule />} />
            <Route path='class/trainer' element={<TrainerIndex />} />

            <Route path='activities' element={<Activities />}>
              <Route path='swimming' element={<Swimming />} />
              <Route path='tennis' element={<Tennis />} />
              <Route path='care' element={<Care />} />
              <Route path='restaurant' element={<Restaurant />} />
            </Route>
            <Route path='item' element={<ItemIndex />} />
            <Route path='item/:itemId' element={<ItemDetails />} />
            <Route path='user/:id' element={<UserDetails />} />
            <Route path='login' element={<LoginSignup />}>
              <Route index element={<Login />} />
              <Route path='signup' element={<Signup />} />
            </Route>
            <Route path='admin' element={<AdminIndex />} />
          </Routes>
        </section>
        <AppFooter />
      </main>
    </>
  )
}
