import React, { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useNavigate, useParams, useLocation } from 'react-router-dom'

export function Class() {
  const location = useLocation()

  return (
    <section className='class-page-container'>
      <span>class</span>
      <nav>
        <NavLink to='/class/schedule'>schedule</NavLink>
        <NavLink to='/class/trainer'>trainer</NavLink>
      </nav>
    </section>
  )
}
