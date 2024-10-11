import React, { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'

export function AboutUs() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)

  function onTellMeMore() {
    console.log('Telling you more')
  }
  return (
    <section className='about-container'>
      <h2>About Us</h2>
      <nav>
        <NavLink to='facilities'>
          {prefs.isEnglish ? 'Facilities' : 'מתקני המועדון'}
        </NavLink>
        <NavLink to='team'>{prefs.isEnglish ? 'Team' : 'צוות המועדון'}</NavLink>
        <NavLink to='organization'>
          {prefs.isEnglish ? 'Organization' : 'עמותה'}
        </NavLink>
        <NavLink to='accessibility'>
          {prefs.isEnglish ? 'Accessibility' : 'נגישות'}
        </NavLink>
      </nav>

      <section>
        <Outlet />
      </section>
    </section>
  )
}
export function Facilities() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)

  return (
    <section className='facilities-container'>
      <span> {prefs.isEnglish ? 'Facilities' : 'מתקני המועדון'}</span>
    </section>
  )
}

export function AboutTeam() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)

  return (
    <section>
      <span>{prefs.isEnglish ? 'Team' : 'צוות המועדון'}</span>{' '}
      <ul>
        <li>Popo Decaprio </li>
        <li>Jini Baba</li>
      </ul>
    </section>
  )
}

export function Organization() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  return (
    <section>
      <span> {prefs.isEnglish ? 'Organization' : 'עמותה'}</span>
      <ul>
        <li>Save the day</li>
        <li>Spread some love</li>
        <li>Take over the world</li>
      </ul>
    </section>
  )
}

export function AccessibilityPage() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  return (
    <section className='accessibility-container'>
      <span> {prefs.isEnglish ? 'Accessibility' : 'נגישות'}</span>
    </section>
  )
}
