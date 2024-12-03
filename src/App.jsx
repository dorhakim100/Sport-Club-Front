import { useState, useRef, useEffect } from 'react'
import React from 'react'
import { Routes, Route, useLocation } from 'react-router'

import { useSelector } from 'react-redux'

import { HomePage } from './pages/HomePage'
import { Facilities } from './pages/Facilities'
import {
  AboutUs,
  Cancel,
  Organization,
  AccessibilityPage,
} from './pages/AboutUs'
import { ClassIndex } from './pages/ClassIndex.jsx'
import { ClassEdit } from './pages/ClassEdit.jsx'
import { ClassDetails } from './pages/ClassDetails.jsx'
import { Schedule } from './pages/Schedule.jsx'
import { TrainerIndex } from './pages/TrainerIndex.jsx'
import {
  Activities,
  Swimming,
  Tennis,
  Care,
  SummerCamp,
  Restaurant,
  Pilates,
} from './pages/Activities.jsx'
import { ItemIndex, CardIndex, AccessoriesIndex } from './pages/ItemIndex'
import { ItemDetails } from './pages/ItemDetails'
import { ItemEdit } from './pages/ItemEdit.jsx'

import { LoginSignup } from './pages/LoginSignup.jsx'
import { Login } from './pages/Login.jsx'
import { Signup } from './pages/Signup.jsx'
import { UserDetails } from './pages/UserDetails'
import { AdminIndex } from './pages/AdminIndex'

import { UpdateIndex } from './pages/UpdateIndex.jsx'
import { UpdateEdit } from './pages/UpdateEdit.jsx'

import { OrderIndex } from './pages/OrderIndex.jsx'
import { Cart } from './pages/Cart.jsx'
import { Paying } from './pages/Paying.jsx'

import { TrainerDetails } from './pages/TrainerDetails.jsx'
import { TrainerEdit } from './pages/TrainerEdit.jsx'

import { MessageIndex } from './pages/MessageIndex.jsx'
import { MessageDetails } from './pages/MessageDetails.jsx'

import { MemberIndex } from './pages/MemberIndex.jsx'

import { CouponIndex } from './pages/CouponIndex.jsx'
import { CouponEdit } from './pages/CouponEdit.jsx'

import { AppHeader } from './cmps/AppHeader'
import { Accessibility } from './cmps/Accessibility'
import { AccessibilityButton } from './cmps/AccessibilityButton'
import { AppFooter } from './cmps/AppFooter'
import { UserMsg } from './cmps/UserMsg.jsx'
import { Loader } from './cmps/Loader'
import { PrefsButton } from './cmps/PrefsButton.jsx'
import { Prefs } from './cmps/Prefs.jsx'

import './App.css'

export function App() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  const bodyRef = useRef()

  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <>
      <UserMsg />
      <AccessibilityButton />
      <Accessibility bodyRef={bodyRef} />
      <PrefsButton />
      <Prefs bodyRef={bodyRef} />
      <Loader />
      <AppHeader bodyRef={bodyRef} />
      <main
        className='main-container'
        style={prefs.isEnglish ? { direction: 'ltr' } : { direction: 'rtl' }}
        ref={bodyRef}
      >
        <section className={isHome ? '' : 'page-container'}>
          <Routes>
            <Route path='' element={<HomePage />} />
            <Route path='facilities' element={<Facilities />} />
            <Route path='about' element={<AboutUs />}>
              <Route path='cancel' element={<Cancel />} />
              {/* <Route path='facilities' element={<Facilities />} /> */}
              <Route path='organization' element={<Organization />} />
              <Route path='accessibility' element={<AccessibilityPage />} />
            </Route>
            <Route path='class' element={<ClassIndex />} />
            <Route path='class/edit/:classId' element={<ClassEdit />} />
            <Route path='class/:classId' element={<ClassDetails />} />

            <Route path='class/schedule' element={<Schedule />} />
            <Route path='class/trainer' element={<TrainerIndex />} />
            <Route
              path='class/trainer/edit/:trainerId'
              element={<TrainerEdit />}
            />
            <Route
              path='class/trainer/:trainerId'
              element={<TrainerDetails />}
            />

            <Route path='activities' element={<Activities />}>
              <Route path='swimming' element={<Swimming />} />
              <Route path='tennis' element={<Tennis />} />
              <Route path='pilates' element={<Pilates />} />
              <Route path='care' element={<Care />} />
              <Route path='camp' element={<SummerCamp />} />
              <Route path='restaurant' element={<Restaurant />} />
            </Route>
            <Route path='item' element={<ItemIndex />}>
              <Route path='card' element={<CardIndex />} />
              <Route path='accessories' element={<AccessoriesIndex />} />
            </Route>

            <Route path='item/:itemId' element={<ItemDetails />} />
            <Route path='item/edit/:itemId' element={<ItemEdit />} />
            <Route path='user/:userId' element={<UserDetails />} />
            <Route path='user/:userId/cart' element={<Cart />} />
            <Route path='user/:userId/cart/paying' element={<Paying />} />

            <Route path='user' element={<LoginSignup />}>
              <Route path='login' element={<Login />} />
              <Route path='signup' element={<Signup />} />
            </Route>

            <Route path='update' element={<UpdateIndex />} />
            <Route path='update/edit/:updateId' element={<UpdateEdit />} />

            <Route path='admin' element={<AdminIndex />}>
              {/* <Route path='update' element={<UpdateIndex />} /> */}
              {/* <Route path='update/edit/:updateId' element={<UpdateEdit />} /> */}
              <Route path='message' element={<MessageIndex />} />
              <Route path='message/:messageId' element={<MessageDetails />} />
              <Route path='order' element={<OrderIndex />} />
              <Route path='member' element={<MemberIndex />} />
              <Route path='coupon' element={<CouponIndex />} />
              <Route path='coupon/edit/:couponId' element={<CouponEdit />} />
            </Route>
          </Routes>
        </section>
        <AppFooter />
      </main>
    </>
  )
}
