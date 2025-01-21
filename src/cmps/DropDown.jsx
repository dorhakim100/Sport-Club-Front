import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { makeId, smoothScroll } from '../services/util.service.js'

export function DropDown({ options, setDropdownVisible }) {
  const [selectedOption, setSelectedOption] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const dropdownRef = useRef()

  useEffect(() => {
    setDropdownDarkMode()
  }, [prefs.isDarkMode])

  const handleMouseLeave = () => {
    // setSelectedOption(option)
    setDropdownVisible(false)
  }
  const handleOptionClick = () => {
    setDropdownVisible(false)
  }

  const setDropdownDarkMode = () => {
    if (prefs.isDarkMode) {
      dropdownRef.current.style.backgroundColor = '#425c77'
      dropdownRef.current.style.color = 'white'
      dropdownRef.current.style.transition =
        'background-color 0.3s ease, color 0.3s ease'
    }
  }

  return (
    <div
      className={prefs.isEnglish ? 'dropdown-menu ltr' : 'dropdown-menu'}
      onMouseLeave={handleMouseLeave}
      ref={dropdownRef}
    >
      <ul className={`options-container ${prefs.isDarkMode && 'dark-mode'}`}>
        {options.map((option) => {
          return (
            <li
              className={
                location.pathname === `/${option.path}` ? 'active' : ''
              }
              key={makeId()}
              onClick={(ev) => {
                ev.preventDefault() // Stop the link from navigating immediately
                handleOptionClick()
                // support for safari browsers

                smoothScroll()

                setTimeout(() => {
                  navigate(`/${option.path}`)
                }, 300) // Adjust time based on your smoothScroll timing
              }}
            >
              {option.text}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
