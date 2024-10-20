import { useState, useRef, useEffect } from 'react'
import React from 'react'
import { Routes, Route } from 'react-router'

import { useSelector } from 'react-redux'

import { HomePage } from './pages/HomePage'
import { Facilities } from './pages/Facilities'
import {
  AboutUs,
  AboutTeam,
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
  SummerCamp,
  Restaurant,
} from './pages/Activities.jsx'
import { ItemIndex } from './pages/ItemIndex'
import { ItemDetails } from './pages/ItemDetails'
import { ItemEdit } from './pages/ItemEdit.jsx'
import { LoginSignup } from './pages/LoginSignup.jsx'
import { Login } from './pages/Login.jsx'
import { Signup } from './pages/Signup.jsx'
import { UserDetails } from './pages/UserDetails'
import { AdminIndex } from './pages/AdminIndex'
import { UpdateIndex } from './pages/UpdateIndex.jsx'
import { OrderIndex } from './pages/OrderIndex.jsx'
import { Cart } from './pages/Cart.jsx'

import { AppHeader } from './cmps/AppHeader'
import { Accessibility } from './cmps/Accessibility'
import { AccessibilityButton } from './cmps/AccessibilityButton'
import { AppFooter } from './cmps/AppFooter'
import { UserMsg } from './cmps/UserMsg.jsx'
import { Loader } from './cmps/Loader'
import { PrefsButton } from './cmps/PrefsButton.jsx'
import { Prefs } from './cmps/Prefs.jsx'

import { SwiperCarousel } from './cmps/SwiperCarousel'

import './App.css'

export function App() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  const bodyRef = useRef()

  return (
    <>
      <UserMsg />
      <AccessibilityButton />
      <Accessibility bodyRef={bodyRef} />
      <PrefsButton />
      <Prefs bodyRef={bodyRef} />
      <Loader />
      <main
        className='main-container'
        style={prefs.isEnglish ? { direction: 'ltr' } : { direction: 'rtl' }}
        ref={bodyRef}
      >
        <AppHeader bodyRef={bodyRef} />
        <section className='page-container'>
          {/* <SwiperCarousel /> */}
          <Routes>
            <Route path='' element={<HomePage />} />
            <Route path='facilities' element={<Facilities />} />
            <Route path='about' element={<AboutUs />}>
              <Route path='team' element={<AboutTeam />} />
              {/* <Route path='facilities' element={<Facilities />} /> */}
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
              <Route path='camp' element={<SummerCamp />} />
              <Route path='restaurant' element={<Restaurant />} />
            </Route>
            <Route path='item' element={<ItemIndex />} />
            <Route path='item/:itemId' element={<ItemDetails />} />
            <Route path='item/edit/:itemId' element={<ItemEdit />} />
            <Route path='user/:id' element={<UserDetails />} />
            <Route path='user/:id/cart' element={<Cart />} />

            <Route path='user' element={<LoginSignup />}>
              <Route path='login' element={<Login />} />
              <Route path='signup' element={<Signup />} />
            </Route>

            <Route path='admin' element={<AdminIndex />}>
              <Route path='update' element={<UpdateIndex />} />
              <Route path='order' element={<OrderIndex />} />
            </Route>
          </Routes>
        </section>
        <AppFooter />
      </main>
    </>
  )
}
