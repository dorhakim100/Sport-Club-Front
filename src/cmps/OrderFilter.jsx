import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

import { SortSelect } from './SortSelect'
import { Controller } from './Controller'

import { debounce } from '../services/util.service'

import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'

export function OrderFilter({ filter, setFilter, maxPage }) {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)

  const user = useSelector((stateSelector) => stateSelector.userModule.user)
  const [editFilter, setEditFilter] = useState(filter)
  const debouncedSetFilter = useRef(debounce(setFilter, 500))

  const searchPlaceholder = {
    he: {
      admin: 'שם, מספר טלפון, מס׳ הזמנה',
      noAdmin: 'מס׳ הזמנה',
    },
    eng: {
      admin: 'Name, Phone number, Order num',
      noAdmin: 'Order num',
    },
  }
  useEffect(() => {
    // setFilter({ ...editFilter })
  }, [editFilter])

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
    <div
      className={`order-filter-container ${
        user && user.isAdmin ? 'admin' : ''
      }`}
    >
      <div className='controller-container'>
        <Controller filter={filter} maxPage={maxPage} setFilter={setFilter} />
      </div>
      <div
        className={`input-container ${prefs.isDarkMode ? 'dark-mode' : ''} ${
          prefs.isEnglish ? 'ltr' : 'rtl'
        }`}
      >
        <input
          type='search'
          value={editFilter.txt}
          onChange={(event) => {
            handleChange(event)
          }}
          placeholder={
            prefs.isEnglish
              ? user && user.isAdmin
                ? searchPlaceholder.eng.admin
                : searchPlaceholder.eng.noAdmin
              : user && user.isAdmin
              ? searchPlaceholder.he.admin
              : searchPlaceholder.he.noAdmin
          }
        />
      </div>
      <div className={`sort-container ${prefs.isEnglish ? 'ltr' : 'rtl'}`}>
        <SortSelect
          prefs={prefs}
          filterToEdit={filter}
          setFilterToEdit={setFilter}
          isMessages={true}
        />
      </div>
      {user && user.isAdmin && (
        <div
          className={
            prefs.isDarkMode
              ? 'mui-checkbox-container dark-mode'
              : 'mui-checkbox-container'
          }
        >
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
            label={prefs.isEnglish ? 'Only pending' : 'לא בוצעו בלבד'}
            onChange={handleChange}
          />
          {/* <label htmlFor={`setOnlyDone`}>
          {prefs.isEnglish ? 'Not done' : 'לא בוצעו'}
        </label>
        <input
          type='checkbox'
          name='onlyDone'
          id={`setOnlyDone`}
          onChange={handleChange}
          checked={filter.onlyDone}
        /> */}

          {/* <label htmlFor={`setOnlyPending`}>
            {prefs.isEnglish ? 'Only Pending' : 'לא בוצעו'}
          </label>
          <input
            type='checkbox'
            name='onlyPending'
            id={`setOnlyPending`}
            onChange={handleChange}
            checked={filter.onlyPending}
          /> */}
        </div>
      )}
    </div>
  )
}
