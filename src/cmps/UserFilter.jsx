import React, { useEffect, useRef, useState } from 'react'
import { debounce } from '../services/util.service'
import { userService } from '../services/user/user.service'
import { useSelector } from 'react-redux'
import FormGroup from '@mui/material/FormGroup'

import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { Controller } from './Controller'

export function UserFilter({ setFilter, maxPage }) {
  const [editFilter, setEditFilter] = useState(userService.getDefaultFilter())

  const filter = useSelector((stateSelector) => stateSelector.userModule.filter)

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
        let newOnlyMembers = filter.onlyMembers
        newOnlyMembers = !newOnlyMembers
        setEditFilter({ ...editFilter, onlyMembers: newOnlyMembers })
        setFilter({ ...editFilter, onlyMembers: newOnlyMembers })

        break

      default:
        break
    }
  }

  return (
    <div className='filter-container'>
      <Controller filter={filter} setFilter={setFilter} maxPage={maxPage} />
      <div className={`input-container ${prefs.isDarkMode ? 'dark-mode' : ''}`}>
        <input
          type='search'
          onChange={handleChange}
          placeholder={
            prefs.isEnglish ? 'Name, number, email' : 'שם, מספר, מייל'
          }
        />
      </div>
      <FormControlLabel
        control={
          <Checkbox
            checked={editFilter.onlyMembers}
            sx={{
              color: prefs.isDarkMode ? '#fff' : '',
              '&.Mui-checked': {
                color: prefs.isDarkMode
                  ? 'rgb(130.7142857143, 219.2857142857, 120.7142857143)'
                  : '#4caf50',
              },
              '&:hover': {
                backgroundColor: 'rgba(76, 175, 80, 0.08)', // subtle hover ripple
              },
            }}
          />
        }
        label={prefs.isEnglish ? 'Only members' : 'מנויים בלבד'}
        onChange={handleChange}
      />
    </div>
  )
}
