import React, { useState } from 'react'
import { NavLink, Link, Outlet } from 'react-router-dom'

export function Schedule() {
  return (
    <section className='schedule-container'>
      <span>schedule</span>
      <nav>
        <NavLink to='/class/schedule'>schedule</NavLink>
        <NavLink to='/class/trainer'>trainer</NavLink>
      </nav>
    </section>
  )
}
