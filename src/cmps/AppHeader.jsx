import { Link, NavLink } from 'react-router-dom'

import { useSelector } from 'react-redux'
import { useState, useEffect, userRef } from 'react'

import { useNavigate, useParams } from 'react-router-dom'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { logout } from '../store/actions/user.actions'

import { DropDown } from '../cmps/DropDown.jsx'

export function AppHeader() {
  const user = useSelector((storeState) => storeState.userModule.user)
  const navigate = useNavigate()

  const [isDropdownVisible, setDropdownVisible] = useState(false)
  const [hoveredSection, setHoveredSection] = useState()

  const options = ['Option 1', 'Option 2', 'Option 3']

  async function onLogout() {
    try {
      await logout()
      navigate('/')
      showSuccessMsg(`Bye now`)
    } catch (err) {
      showErrorMsg('Cannot logout')
    }
  }

  function setNav(ev) {
    console.log(ev.target.id)
    setIsHover(true)
    setIsOpen(true)
    setPosition({ ...position, x: ev.pageX, y: ev.pageY })
  }

  const handleMouseEnter = (section) => {
    setHoveredSection(section)
    setDropdownVisible(true)
  }

  const handleMouseLeave = () => {
    setDropdownVisible(false)
  }

  return (
    <header className='app-header full'>
      <nav>
        <NavLink to='/' className='logo'>
          Home
        </NavLink>

        <NavLink to='class'>Class</NavLink>

        <NavLink to='activities'>
          <div
            className='menu'
            onMouseEnter={() => {
              handleMouseEnter('activities')
            }}
            onMouseLeave={handleMouseLeave}
          >
            <span>Activities</span>
            {isDropdownVisible && hoveredSection === 'activities' && (
              <DropDown />
            )}
          </div>
        </NavLink>
        <NavLink to='about'>
          <div
            className='menu'
            onMouseEnter={() => {
              handleMouseEnter('about')
            }}
            onMouseLeave={handleMouseLeave}
            // id={'about'}
          >
            <span>About</span>
            {isDropdownVisible && hoveredSection === 'about' && <DropDown />}
          </div>
        </NavLink>
        <NavLink to='car'>Cars</NavLink>
        {/* <NavLink to='chat'>Chat</NavLink>
        <NavLink to='review'>Review</NavLink> */}

        {user?.isAdmin && <NavLink to='/admin'>Admin</NavLink>}

        {!user && (
          <NavLink to='login' className='login-link'>
            Login
          </NavLink>
        )}
        {user && (
          <div className='user-info'>
            <Link to={`user/${user._id}`}>
              {/* {user.imgUrl && <img src={user.imgUrl} />} */}
              {user.fullname}
            </Link>
            {/* <span className="score">{user.score?.toLocaleString()}</span> */}
            <button onClick={onLogout}>logout</button>
          </div>
        )}
      </nav>
    </header>
  )
}
