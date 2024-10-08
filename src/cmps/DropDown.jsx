import { useState, useEffect, userRef } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

export function DropDown({ options, position, label, isOpen, setIsOpen }) {
  const [selectedOption, setSelectedOption] = useState(null)

  useEffect(() => {
    console.log(position)
  }, [position])

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleOptionClick = (option) => {
    setSelectedOption(option)
    setIsOpen(false)
  }
  return (
    <div className='dropdown-menu'>
      <ul>
        <li>Menu 1</li>
        <li>Menu 2</li>
        <li>Menu 3</li>
      </ul>
    </div>
  )
}
