import React, { useEffect, useRef, useState } from 'react'
import { debounce } from '../services/util.service'
import { userService } from '../services/user/user.service'
import { useSelector } from 'react-redux'

export function UserFilter({ setFilter }) {
  const [editFilter, setEditFilter] = useState(userService.getDefaultFilter())

  const debouncedSetFilter = useRef(debounce(setFilter, 500))

  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)

  function handleChange({ target }) {
    const field = target.name
    const value = target.value
    const type = target.type

    switch (type) {
      case 'search':
        setEditFilter({ ...editFilter, txt: value })
        debouncedSetFilter.current((prevFilter) => ({
          ...prevFilter,
          txt: value,
          pageIdx: 0,
        }))
        break
      case 'checkbox':
        let newOnlyPending = filter.onlyPending
        newOnlyPending = !newOnlyPending
        setFilter({ ...editFilter, onlyPending: newOnlyPending })

        break

      default:
        break
    }
  }

  return (
    <div>
      <div className={`input-container ${prefs.isDarkMode ? 'dark-mode' : ''}`}>
        <input
          type='search'
          onChange={handleChange}
          placeholder={
            prefs.isEnglish ? 'Name, number, email' : 'שם, מספר, מייל'
          }
        />
      </div>
    </div>
  )
}
