import { useState, useEffect, userRef } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { makeId } from '../services/util.service.js'

export function DropDown({ options, isDropdownVisible, setDropdownVisible }) {
  const [selectedOption, setSelectedOption] = useState(null)
  const navigate = useNavigate()

  const handleOptionClick = () => {
    // setSelectedOption(option)
    setDropdownVisible(false)
  }
  return (
    <div className='dropdown-menu'>
      <ul>
        {options.map((option) => {
          return (
            <li
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
