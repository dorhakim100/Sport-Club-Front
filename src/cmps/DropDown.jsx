import { useState, useEffect, userRef } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { makeId } from '../services/util.service.js'

export function DropDown({ options, isDropdownVisible, setDropdownVisible }) {
  const [selectedOption, setSelectedOption] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  const handleMouseLeave = () => {
    // setSelectedOption(option)
    setDropdownVisible(false)
  }
  const handleOptionClick = () => {
    setDropdownVisible(false)
  }

  return (
    <div className='dropdown-menu' onMouseLeave={handleMouseLeave}>
      <ul className='options-container'>
        {options.map((option) => {
          return (
            <li
              className={
                location.pathname === `/${option.path}` ? 'active' : ''
              }
              key={makeId()}
              onClick={(ev) => {
                ev.preventDefault()
                handleOptionClick()
                navigate(option.path)
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
