import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useSelector } from 'react-redux'
import { userService } from '../services/user/user.service'

import { onPageNavigation } from '../services/util.service'

import { Button } from '@mui/material'

import ButtonGroup from '@mui/material/ButtonGroup'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { addItem } from '../store/actions/item.actions'

import { SortSelect } from './SortSelect'
import { Loader } from './Loader'

import PropTypes from 'prop-types'
import Slider, { SliderThumb } from '@mui/material/Slider'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import Box from '@mui/material/Box'
import { itemService } from '../services/item/item.service'

export function ItemFilter({
  filterBy,
  setFilterBy,
  isGrid,
  setIsGrid,
  maxPage,
}) {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  const [filterToEdit, setFilterToEdit] = useState(structuredClone(filterBy))
  const [price, setPrice] = useState(filterToEdit.maxPrice || '')
  const user = useSelector((stateSelector) => stateSelector.userModule.user)
  const navigate = useNavigate()

  useEffect(() => {
    setFilterBy({ ...filterToEdit })
  }, [filterToEdit])

  function handleChange(ev) {
    const type = ev.target.type
    let field = ev.target.name
    let value
    // console.log(ev.target)

    // console.log(type)
    // console.log(field)

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

    setFilterToEdit({ ...filterToEdit, [field]: value, pageIdx: 0 })
  }

  const handleChangeCommitted = (ev, newValue) => {
    setFilterToEdit({ ...filterToEdit, maxPrice: price, pageIdx: 0 })
  }

  const onRangeChange = (ev) => {
    const priceToSet = ev.target.value
    setPrice(priceToSet)
  }

  function clearFilter() {
    setFilterToEdit({
      ...filterToEdit,
      txt: '',
      maxPrice: '',
      types: [],
      sortDir: '',
      pageIdx: 0,
    })
  }

  async function onAddItem() {
    const item = itemService.getEmptyItem()

    delete item._id
    try {
      const savedItem = await addItem(item)
      showSuccessMsg(`Item added`)
      navigate(`/item/edit/${savedItem._id}`)
    } catch (err) {
      console.log(err)
      showErrorMsg('Cannot add item')
    }
  }

  return (
    <section className='item-filter'>
      {/* <h3> {prefs.isEnglish ? 'Filter' : 'סינון'}:</h3> */}
      {user && user.isAdmin && (
        <Button
          variant='contained'
          onClick={onAddItem}
          style={{ justifySelf: 'start' }}
        >
          {prefs.isEnglish ? 'Add Item' : 'הוסף מוצר'}
        </Button>
      )}
      <div
        className={
          prefs.isDarkMode ? 'type-container dark-mode' : 'type-container'
        }
      >
        {' '}
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
      {/* <div className='price-range-container'>
        <div className='prices-container'>
          <span>{prefs.isEnglish ? 'Max Price' : 'מחיר מקסימלי'}</span>

          <input
            type='number'
            value={price}
            min='20'
            max='800'
            name='maxPrice'
            onChange={(event) => {
              handleChange(event)
              setPrice(event.target.value)
            }}
          />
        </div>

        <PrettoSlider
          valueLabelDisplay='auto'
          aria-label='pretto slider'
          // defaultValue={20}
          min={20}
          max={800}
          value={price || ''}
          onChange={onRangeChange}
          onChangeCommitted={handleChangeCommitted}
          name='maxPrice'
        />
      </div> */}
      <Button className='btn-clear' variant='contained' onClick={clearFilter}>
        {prefs.isEnglish ? 'Clear' : 'איפוס'}
      </Button>

      <SortSelect
        filterToEdit={filterToEdit}
        setFilterToEdit={setFilterToEdit}
        prefs={prefs}
      />
      <div className='controller-container'>
        <ButtonGroup
          variant='contained'
          aria-label='Basic button group'
          dir='ltr'
          className='page-controller-container'
        >
          <Button
            onClick={() =>
              onPageNavigation(1, filterToEdit, setFilterToEdit, maxPage)
            }
            disabled={filterToEdit.pageIdx + 1 === maxPage}
          >
            <ArrowBackIosNewIcon />
          </Button>
          {/* <Button disabled={true}>{filterBy.pageIdx + 1}</Button> */}
          <div className='page-idx-container'>
            <span className='page-idx'>{filterToEdit.pageIdx + 1}</span>
          </div>

          <Button
            disabled={filterToEdit.pageIdx === 0}
            onClick={() =>
              onPageNavigation(-1, filterToEdit, setFilterToEdit, maxPage)
            }
            sx={{
              cursor: filterToEdit.pageIdx === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            <ArrowForwardIosIcon />
          </Button>
        </ButtonGroup>
        <Button
          variant='contained'
          onClick={() => setIsGrid((prev) => (prev = !prev))}
        >
          {(prefs.isEnglish && (isGrid ? 'List' : 'Grid')) ||
            (isGrid ? 'רשימה' : 'טבלה')}
        </Button>
      </div>
    </section>
  )
}

const PrettoSlider = styled(Slider)({
  color: '#52af77',
  height: 8,
  '& .MuiSlider-track': {
    border: 'none',
  },
  '& .MuiSlider-thumb': {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit',
    },
    '&::before': {
      display: 'none',
    },
  },
  '& .MuiSlider-valueLabel': {
    lineHeight: 1.2,
    fontSize: 12,
    background: 'unset',
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: '50% 50% 50% 0',
    backgroundColor: '#52af77',
    transformOrigin: 'bottom left',
    transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
    '&::before': { display: 'none' },
    '&.MuiSlider-valueLabelOpen': {
      transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
    },
    '& > *': {
      transform: 'rotate(45deg)',
    },
  },
})
