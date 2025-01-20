import React from 'react'
import { useSelector } from 'react-redux'

export function TrainerFilter({ filter, setFilter }) {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)

  const checkboxs = [
    {
      label: { he: 'חדר כושר', eng: 'Gym' },
      id: 'gym',
    },
    {
      label: { he: 'סטודיו', eng: 'Studio' },
      id: 'studio',
    },
    {
      label: { he: 'שחייה', eng: 'Swimming' },
      id: 'swimming',
    },
    {
      label: { he: 'טניס', eng: 'Tennis' },
      id: 'tennis',
    },
  ]

  const handleChange = async (ev) => {
    const type = ev.target.type
    let field = ev.target.name
    let value

    const checkedButton = ev.target.id

    if (filter.types.includes(checkedButton)) {
      const idx = filter.types.findIndex((type) => type === checkedButton)
      filter.types.splice(idx, 1)
    } else {
      filter.types.push(checkedButton)
    }

    setFilter({ ...filter, pageIdx: 0 })
  }

  return (
    <div
      className={
        prefs.isDarkMode
          ? 'trainer-filter-container dark-mode'
          : 'trainer-filter-container'
      }
    >
      {checkboxs.map((checkbox) => {
        return (
          <div className='checkbox-container' key={checkbox.id + 'Checkbox'}>
            <label htmlFor={checkbox.id}>
              {prefs.isEnglish ? checkbox.label.eng : checkbox.label.he}
            </label>
            <input
              type='checkbox'
              name=''
              id={checkbox.id}
              onChange={handleChange}
              checked={filter.types.includes(checkbox.id)}
            />
          </div>
        )
      })}
    </div>
  )
}
