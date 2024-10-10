import { useState, useEffect } from 'react'

import { useSelector } from 'react-redux'

import { Button } from '@mui/material'

import { SortSelect } from './SortSelect'

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

    console.log(type)
    console.log(field)

    switch (type) {
      case 'text':
      case 'radio':
        value = field === 'sortDir' ? +ev.target.value : ev.target.value
        if (!filterToEdit.sortDir) filterToEdit.sortDir = 1
        break
      case 'number':
        value = +ev.target.value || ''
        break
      case 'range':
        value = +ev.target.value || ''
        break
      case 'checkbox':
        const checkedButton = ev.target.id
        console.log(checkedButton)
        if (field === 'type') {
          if (filterToEdit.types.includes(checkedButton)) {
            const idx = filterToEdit.types.findIndex(
              (type) => type === checkedButton
            )
            filterToEdit.types.splice(idx, 1)
          } else {
            filterToEdit.types.push(checkedButton)
          }
          setFilterToEdit({ ...filterToEdit, pageIdx: 0 })
        }
        break
    }
    setFilterToEdit({ ...filterToEdit, [field]: value })
  }

  function clearFilter() {
    setFilterToEdit({
      ...filterToEdit,
      txt: '',
      maxPrice: '',
      types: [],
      sortDir: '',
    })
  }

  function clearSort() {
    setFilterToEdit({ ...filterToEdit, sortField: '', sortDir: '' })
  }

  return (
    <section className='item-filter'>
      <h3> {prefs.isEnglish ? 'Filter' : 'סינון'}:</h3>
      <div className='type-container'>
        <div className='checkbox-container'>
          <input
            type='checkbox'
            name='type'
            id='card'
            onChange={handleChange}
            checked={filterToEdit.types.includes('card')}
          />
          <label htmlFor='card'>
            {prefs.isEnglish ? '12 Passes' : 'כרטיסיות'}
          </label>
        </div>
        <div className='checkbox-container'>
          <input
            type='checkbox'
            name='type'
            id='accessories'
            onChange={handleChange}
            checked={filterToEdit.types.includes('accessories')}
          />
          <label htmlFor='accessories'>
            {prefs.isEnglish ? 'Accessories' : 'ציוד נלווה'}
          </label>
        </div>
      </div>
      {/* <div className='input-container'>
        <input
          type='text'
          name='txt'
          value={filterToEdit.txt}
          placeholder={prefs.isEnglish ? 'Im lookin for...' : 'חיפוש'}
          onChange={handleChange}
          required
        />
      </div> */}
      <div className='price-range-container'>
        <div className='prices-container'>
          <span>{prefs.isEnglish ? 'Max Price' : 'מחיר מקסימלי'}</span>
          <span>-</span>
          <input
            type='number'
            value={filterToEdit.maxPrice}
            min='20'
            max='800'
          />
        </div>
        <input
          type='range'
          min='20'
          max='800'
          name='maxPrice'
          value={filterToEdit.maxPrice}
          placeholder={prefs.isEnglish ? 'Max. price' : 'מחיר מקסימלי'}
          onChange={handleChange}
          required
        />
      </div>
      <Button className='btn-clear' variant='contained' onClick={clearFilter}>
        {prefs.isEnglish ? 'Clear' : 'איפוס'}
      </Button>

      <SortSelect
        filterToEdit={filterToEdit}
        setFilterToEdit={setFilterToEdit}
        prefs={prefs}
      />
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
