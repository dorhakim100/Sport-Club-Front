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

  const prefs = useSelector((storeState) => storeState.userModule.prefs)
  console.log(prefs)

  const [isDropdownVisible, setDropdownVisible] = useState(false)
  const [hoveredSection, setHoveredSection] = useState()
  const [options, setOptions] = useState([])

  async function onLogout() {
    try {
      await logout()
      navigate('/')
      showSuccessMsg(`Bye now`)
    } catch (err) {
      showErrorMsg('Cannot logout')
    }
  }

  const handleMouseEnter = (section) => {
    setHoveredSection(section)
    setDropdownVisible(true)
  }

  const handleMouseLeave = () => {
    setDropdownVisible(false)
  }

  const setDropdownOptions = (section) => {
    let optionsToSet
    switch (section) {
      case 'class':
        optionsToSet = [
          {
            text: prefs.isEnglish ? 'Schedule' : 'מערכת החוגים',
            path: `${section}/schedule`,
          },
          {
            text: prefs.isEnglish ? 'Our Trainers' : 'צוות המדריכים שלנו',
            path: `${section}/trainer`,
          },
        ]
        break
      case 'activities':
        optionsToSet = [
          {
            text: prefs.isEnglish ? 'Swimming School' : 'בית הספר לשחייה',
            path: `${section}/swimming`,
          },
          {
            text: prefs.isEnglish ? 'Tennis School' : 'בית הספר לטניס',
            path: `${section}/tennis`,
          },
          {
            text: prefs.isEnglish ? 'Care Center' : 'מרכז הטיפולים',
            path: `${section}/care`,
          },
          {
            text: prefs.isEnglish ? 'Restaurant' : 'שף הכפר',
            path: `${section}/restaurant`,
          },
        ]
        break
      case 'about':
        optionsToSet = [
          {
            text: prefs.isEnglish ? 'Facilities' : 'מתקני המועדון',
            path: `${section}/facilities`,
          },
          {
            text: prefs.isEnglish ? 'Our Team' : 'צוות המועדון',
            path: `${section}/team`,
          },
          {
            text: prefs.isEnglish ? 'Organization' : 'העמותה',
            path: `${section}/organization`,
          },
          {
            text: prefs.isEnglish ? 'Accessibility' : 'נגישות',
            path: `${section}/accessibility`,
          },
        ]
        break

      default:
        break
    }

    setOptions(optionsToSet)
  }

  return (
    <header className='app-header full'>
      <nav>
        <NavLink to='/' className='logo'>
          {prefs.isEnglish ? 'Home' : 'בית'}
        </NavLink>

        <NavLink to='class'>
          <div
            className='menu'
            onMouseEnter={() => {
              setDropdownOptions('class')
              handleMouseEnter('class')
            }}
          >
            <span>{prefs.isEnglish ? 'Class' : 'חוגים'}</span>
            {isDropdownVisible && hoveredSection === 'class' && (
              <DropDown
                options={options}
                setDropdownVisible={setDropdownVisible}
              />
            )}
          </div>
        </NavLink>

        <NavLink to='activities'>
          <div
            className='menu'
            onMouseEnter={() => {
              setDropdownOptions('activities')
              handleMouseEnter('activities')
            }}
            onMouseLeave={handleMouseLeave}
          >
            <span>{prefs.isEnglish ? 'Activities' : 'פעילויות'}</span>
            {isDropdownVisible && hoveredSection === 'activities' && (
              <DropDown
                options={options}
                setDropdownVisible={setDropdownVisible}
              />
            )}
          </div>
        </NavLink>
        <NavLink to='about'>
          <div
            className='menu'
            onMouseEnter={() => {
              setDropdownOptions('about')
              handleMouseEnter('about')
            }}
            onMouseLeave={handleMouseLeave}
            // id={'about'}
          >
            <span>{prefs.isEnglish ? 'About' : 'אודות'}</span>
            {isDropdownVisible && hoveredSection === 'about' && (
              <DropDown
                options={options}
                setDropdownVisible={setDropdownVisible}
              />
            )}
          </div>
        </NavLink>
        <NavLink to='car'>Cars</NavLink>
        {/* <NavLink to='chat'>Chat</NavLink>
        <NavLink to='review'>Review</NavLink> */}

        {user?.isAdmin && (
          <NavLink to='/admin'> {prefs.isEnglish ? 'Admin' : 'מנהל'}</NavLink>
        )}

        {!user && (
          <NavLink to='login' className='login-link'>
            {prefs.isEnglish ? 'Login' : 'כניסה'}
          </NavLink>
        )}
        {user && (
          <div className='user-info'>
            <Link to={`user/${user._id}`}>
              {/* {user.imgUrl && <img src={user.imgUrl} />} */}
              {user.fullname}
            </Link>
            {/* <span className="score">{user.score?.toLocaleString()}</span> */}
            <button onClick={onLogout}>
              {' '}
              {prefs.isEnglish ? 'Logout' : 'יציאה'}
            </button>
          </div>
        )}
      </nav>
    </header>
  )
}
