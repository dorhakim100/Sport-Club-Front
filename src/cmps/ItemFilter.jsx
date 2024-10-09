import { useState, useEffect } from 'react'

import { useSelector } from 'react-redux'

export function ItemFilter({ filterBy, setFilterBy }) {
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
      <input
        type='text'
        name='txt'
        value={filterToEdit.txt}
        placeholder={prefs.isEnglish ? 'Im lookin for...' : 'חיפוש'}
        onChange={handleChange}
        required
      />
      <input
        type='number'
        min='20'
        name='minPrice'
        value={filterToEdit.minPrice}
        placeholder={prefs.isEnglish ? 'Max. price' : 'מחיר מקסימלי'}
        onChange={handleChange}
        required
      />
      <button className='btn-clear' onClick={clearFilter}>
        {prefs.isEnglish ? 'Clear' : 'איפוס'}
      </button>
      <h3> {prefs.isEnglish ? 'Sort' : 'מיין לפי'}:</h3>
      <div className='sort-field'>
        <label>
          <span>Speed</span>
          <input
            type='radio'
            name='sortField'
            value='speed'
            checked={filterToEdit.sortField === 'speed'}
            onChange={handleChange}
          />
        </label>
        <label>
          <span>Vendor</span>
          <input
            type='radio'
            name='sortField'
            value='vendor'
            checked={filterToEdit.sortField === 'vendor'}
            onChange={handleChange}
          />
        </label>
        <label>
          <span>Owner</span>
          <input
            type='radio'
            name='sortField'
            value='owner'
            checked={filterToEdit.sortField === 'owner'}
            onChange={handleChange}
          />
        </label>
      </div>
      <div className='sort-dir'>
        <label>
          <span>Asce</span>
          <input
            type='radio'
            name='sortDir'
            value='1'
            checked={filterToEdit.sortDir === 1}
            onChange={handleChange}
          />
        </label>
        <label>
          <span>Desc</span>
          <input
            type='radio'
            name='sortDir'
            value='-1'
            onChange={handleChange}
            checked={filterToEdit.sortDir === -1}
          />
        </label>
      </div>
      <button className='btn-clear' onClick={clearSort}>
        {prefs.isEnglish ? 'Clear' : 'איפוס'}
      </button>
    </section>
  )
}
