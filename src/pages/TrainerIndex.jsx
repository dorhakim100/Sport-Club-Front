import React, { useState } from 'react'
import { NavLink, Link, Outlet } from 'react-router-dom'
import { useNavigate, useParams, useLocation } from 'react-router-dom'

export function TrainerIndex() {
  const location = useLocation()

  return (
    <section className='trainer-index-container'>
      <span>trainer index</span>
      <nav>
        <NavLink to='/class/schedule'>schedule</NavLink>
        <NavLink to='/class/trainer'>trainer</NavLink>
      </nav>
    </section>
  )
}
