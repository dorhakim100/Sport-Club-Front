import { useState } from 'react'
import React from 'react'
import { Routes, Route } from 'react-router'

import { HomePage } from './pages/HomePage'
import { AboutUs, AboutTeam, AboutVision } from './pages/AboutUs'
import { Class } from './pages/Class.jsx'
import { Schedule } from './pages/Schedule.jsx'
import { TrainerIndex } from './pages/TrainerIndex.jsx'
import { Activities } from './pages/Activities.jsx'
import { CarIndex } from './pages/CarIndex'
import { CarDetails } from './pages/CarDetails'
import { LoginSignup } from './pages/LoginSignup.jsx'
import { Login } from './pages/Login.jsx'
import { Signup } from './pages/Signup.jsx'
import { UserDetails } from './pages/UserDetails'
import { AdminIndex } from './pages/AdminIndex'

import { AppHeader } from './cmps/AppHeader'
import { AppFooter } from './cmps/AppFooter'
import { UserMsg } from './cmps/UserMsg.jsx'

import './App.css'

export function App() {
  const [count, setCount] = useState(0)

  return (
    <main className='main-container'>
      <AppHeader />
      <section className='page-container'>
        <Routes>
          <Route path='' element={<HomePage />} />
          <Route path='about' element={<AboutUs />}>
            <Route path='team' element={<AboutTeam />} />
            <Route path='vision' element={<AboutVision />} />
          </Route>
          <Route path='class' element={<Class />} />
          <Route path='class/schedule' element={<Schedule />} />
          <Route path='class/trainer' element={<TrainerIndex />} />

          <Route path='activities' element={<Activities />} />
          <Route path='car' element={<CarIndex />} />
          <Route path='car/:carId' element={<CarDetails />} />
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
  )
}
