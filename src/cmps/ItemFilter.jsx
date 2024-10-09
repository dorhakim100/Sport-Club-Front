import { useState, useEffect } from 'react'

import { useSelector } from 'react-redux'
import { Button } from '@mui/material'

export function ItemFilter({ filterBy, setFilterBy, isGrid, setIsGrid }) {
  const prefs = useSelector((storeState) => storeState.userModule.prefs)
  const [filterToEdit, setFilterToEdit] = useState(structuredClone(filterBy))

  useEffect(() => {
    setFilterBy(filterToEdit)
  }, [filterToEdit])

  function handleChange(ev) {
    const type = ev.target.type
    const field = ev.target.name
    let value

    switch (type) {
      case 'text':
      case 'radio':
        value = field === 'sortDir' ? +ev.target.value : ev.target.value
        if (!filterToEdit.sortDir) filterToEdit.sortDir = 1
        break
      case 'number':
        value = +ev.target.value || ''
        break
    }
    setFilterToEdit({ ...filterToEdit, [field]: value })
  }

  function clearFilter() {
    setFilterToEdit({ ...filterToEdit, txt: '', minSpeed: '', maxPrice: '' })
  }

  function clearSort() {
    setFilterToEdit({ ...filterToEdit, sortField: '', sortDir: '' })
  }

  return (
    <section className='item-filter'>
      <h3> {prefs.isEnglish ? 'Filter' : 'סינון'}:</h3>
      <div className='input-container'>
        <input
          type='text'
          name='txt'
          value={filterToEdit.txt}
          placeholder={prefs.isEnglish ? 'Im lookin for...' : 'חיפוש'}
          onChange={handleChange}
          required
        />
      </div>
      <input
        type='number'
        min='20'
        max='4500'
        name='minPrice'
        value={filterToEdit.minPrice}
        placeholder={prefs.isEnglish ? 'Max. price' : 'מחיר מקסימלי'}
        onChange={handleChange}
        required
      />
      <Button className='btn-clear' variant='contained' onClick={clearFilter}>
        {prefs.isEnglish ? 'Clear' : 'איפוס'}
      </Button>
      <h3> {prefs.isEnglish ? 'Sort' : 'מיין לפי'}:</h3>

      <Button className='btn-clear' variant='contained' onClick={clearSort}>
        {prefs.isEnglish ? 'Clear' : 'איפוס'}
      </Button>
      <Button
        variant='contained'
        onClick={() => setIsGrid((prev) => (prev = !prev))}
      >
        {(prefs.isEnglish && (isGrid ? 'List' : 'Grid')) ||
          (isGrid ? 'רשימה' : 'טבלה')}
      </Button>
    </section>
  )
}
