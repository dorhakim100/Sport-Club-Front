import React, { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import PropTypes from 'prop-types'

export function AboutUs() {
  const [count, setCount] = useState(100)

  function onTellMeMore() {
    console.log('Telling you more')
  }
  return (
    <section>
      <h2>About Us</h2>
      <nav>
        <NavLink to='team'>Team</NavLink> |<NavLink to='vision'>Vision</NavLink>
      </nav>

      <section>
        <Outlet />
      </section>

      <FancyBox onClose={() => console.log('ok, closing')}>
        <h3>{count.toLocaleString()} Followers</h3>
        <button onClick={onTellMeMore}>Tell me More</button>
      </FancyBox>

      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni aperiam
        quo veniam velit dolor reprehenderit, laudantium consequatur neque
        numquam labore quae. Accusamus libero perferendis ducimus? Alias unde
        hic quisquam doloremque.
      </p>
    </section>
  )
}

export function AboutTeam() {
  return (
    <section>
      <h2>Best Team</h2>
      <ul>
        <li>Popo Decaprio </li>
        <li>Jini Baba</li>
      </ul>
    </section>
  )
}

export function AboutVision() {
  return (
    <section>
      <h2>Vision</h2>
      <ul>
        <li>Save the day</li>
        <li>Spread some love</li>
        <li>Take over the world</li>
      </ul>
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
