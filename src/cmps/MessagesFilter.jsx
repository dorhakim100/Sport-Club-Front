import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { updateService } from '../services/update/update.service'
import { loadUpdates } from '../store/actions/update.actions'

import { setIsLoading } from '../store/actions/system.actions'
import { onPageNavigation } from '../services/util.service'
import { debounce } from '../services/util.service'

import { SortSelect } from './SortSelect'

import { Button } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import ButtonGroup from '@mui/material/ButtonGroup'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import DeleteIcon from '@mui/icons-material/Delete'
import UndoIcon from '@mui/icons-material/Undo'
import {
  loadMessages,
  loadOpenMessages,
  removeMessages,
} from '../store/actions/message.actions'

export function MessagesFilter({
  filter,
  setFilter,
  maxPage,
  idsToRemove,
  setIdsToRemove,
}) {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const isLoading = useSelector(
    (stateSelector) => stateSelector.systemModule.isLoading
  )

  const updates = useSelector(
    (stateSelector) => stateSelector.updateModule.updates
  )

  const [editFilter, setEditFilter] = useState(filter)
  const debouncedSetFilter = useRef(debounce(setFilter, 500))

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
        let newOnlyDone = filter.onlyDone
        newOnlyDone = !newOnlyDone
        setFilter({ ...editFilter, onlyDone: newOnlyDone })

        break

      default:
        break
    }
  }

  async function onRemoveBulk(ids) {
    try {
      await removeMessages(ids)
      await loadMessages(filter)
      setIdsToRemove([])
      await loadOpenMessages()
      showSuccessMsg(prefs.isEnglish ? 'Messages deleted' : 'הודעות נמחקו')
    } catch (err) {
      showErrorMsg(
        prefs.isEnglish
          ? `Couldn't delete messages`
          : 'לא היה ניתן למחוק הודעות'
      )
    }
  }

  return (
    <div className='messages-filter-container'>
      <div className='remove-container'>
        <IconButton
          aria-label='delete'
          disabled={idsToRemove.length === 0}
          color='primary'
          onClick={() => {
            console.log('bla')
            if (idsToRemove.length === 0) return
            onRemoveBulk(idsToRemove)
          }}
        >
          <DeleteIcon
            style={{
              color: idsToRemove.length > 0 && '#E53935',
              opacity: idsToRemove.length > 0 && '0.8',
            }}
          />
        </IconButton>
        {idsToRemove.length > 0 && (
          <IconButton
            aria-label='delete'
            disabled={idsToRemove.length === 0}
            color='primary'
            onClick={() => setIdsToRemove([])}
          >
            <UndoIcon
              style={{
                color: prefs.isDarkMode ? '#6EC1E4' : '#4A90E2',
                opacity: '0.8',
              }}
            />
          </IconButton>
        )}
      </div>
      <ButtonGroup
        variant='contained'
        aria-label='Basic button group'
        dir='ltr'
        className='page-controller-container'
      >
        <Button
          onClick={() => {
            onPageNavigation(1, filter, setFilter, maxPage)
          }}
        >
          <ArrowBackIosNewIcon />
        </Button>
        {/* <Button disabled={true}>{filterBy.pageIdx + 1}</Button> */}
        <div className='page-idx-container'>
          <span className='page-idx'>{filter.pageIdx + 1}</span>
        </div>

        <Button
          disabled={filter.pageIdx === 0}
          onClick={() => onPageNavigation(-1, filter, setFilter, maxPage)}
          sx={{
            cursor: filter.pageIdx === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          <ArrowForwardIosIcon />
        </Button>
      </ButtonGroup>

      <div
        className={
          prefs.isDarkMode ? 'input-container dark-mode' : 'input-container'
        }
      >
        <input
          type='search'
          value={editFilter.txt}
          onChange={(event) => {
            handleChange(event)
          }}
          placeholder={
            prefs.isEnglish ? 'Name, Phone number' : 'שם, מספר טלפון'
          }
        />
      </div>

      <SortSelect
        prefs={prefs}
        filterToEdit={filter}
        setFilterToEdit={setFilter}
        isMessages={true}
      />

      <div
        className={
          prefs.isDarkMode
            ? 'checkbox-container dark-mode'
            : 'checkbox-container'
        }
      >
        <label htmlFor={`setOnlyDone`}>
          {prefs.isEnglish ? 'Not done' : 'לא בוצעו'}
        </label>
        <input
          type='checkbox'
          name='onlyDone'
          id={`setOnlyDone`}
          onChange={handleChange}
          checked={filter.onlyDone}
        />
      </div>
    </div>
  )
}
