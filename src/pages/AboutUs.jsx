import React, { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import PropTypes from 'prop-types'

export function AboutUs() {
  const [count, setCount] = useState(100)

  function onTellMeMore() {
    console.log('Telling you more')
  }
  return (
    <section className='about-container'>
      <h2>About Us</h2>
      <nav>
        <NavLink to='facilities'>Facilities</NavLink>
        <NavLink to='team'>Team</NavLink>
        <NavLink to='organization'>Organization</NavLink>
        <NavLink to='accessibility'>Accessibility</NavLink>
      </nav>

      <section>
        <Outlet />
      </section>
    </section>
  )
}

export function AboutTeam() {
  return (
    <section>
      <span>team</span>{' '}
      <ul>
        <li>Popo Decaprio </li>
        <li>Jini Baba</li>
      </ul>
    </section>
  )
}

export function Facilities() {
  return (
    <section className='facilities-container'>
      <span>facilities</span>
    </section>
  )
}

export function Organization() {
  return (
    <section>
      <span>organization</span>
      <ul>
        <li>Save the day</li>
        <li>Spread some love</li>
        <li>Take over the world</li>
      </ul>
    </section>
  )
}

export function Accessibility() {
  return (
    <section className='accessibility-container'>
      <span>accessibility</span>
    </section>
  )
}

function FancyBox(props) {
  return (
    <div className='fancy-box'>
      <button style={{ float: 'right' }} onClick={props.onClose}>
        x
      </button>
      {props.children}
    </div>
  )
}

FancyBox.propTypes = {
  onClose: PropTypes.func.isRequired,
}
