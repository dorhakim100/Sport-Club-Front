import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { updateService } from '../services/update/update.service'
import { loadUpdates } from '../store/actions/update.actions'

import { setIsLoading } from '../store/actions/system.actions'
import { onPageNavigation } from '../services/util.service'

import { Button } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import ButtonGroup from '@mui/material/ButtonGroup'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'

export function UpdateControl({
  setDragEdit,
  isDragEdit,
  filter,
  setFilter,
  maxPage,
}) {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const isLoading = useSelector(
    (stateSelector) => stateSelector.systemModule.isLoading
  )

  const updates = useSelector(
    (stateSelector) => stateSelector.updateModule.updates
  )

  const user = useSelector((stateSelector) => stateSelector.userModule.user)

  useEffect(() => {
    // console.log(updates)
  }, [updates])

  async function onCancelEdit() {
    try {
      setIsLoading(true)
      await loadUpdates(updateService.getDefaultFilter())
      setDragEdit(false)
      const defaultFilter = updateService.getDefaultFilter()
      setFilter({ ...defaultFilter })
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  // async function onSaveOrder() {
  //   try {
  //     setIsLoading(true)
  //     setDragEdit(false)
  //     await updateService.saveUpdatesOrder([...updates].reverse())
  //     const defaultFilter = updateService.getDefaultFilter()
  //     setFilter({ ...defaultFilter })
  //     showSuccessMsg(prefs.isEnglish ? 'Order saved' : 'סדר נשמר')
  //   } catch (err) {
  //     console.log(err)
  //     showErrorMsg(prefs.isEnglish ? `Couldn't save order` : 'סדר לא נשמר')
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  async function onSaveOrder() {
    try {
      setIsLoading(true)
      setDragEdit(false)

      // Add position property to each update
      const orderedUpdates = updates.map((update, index) => ({
        ...update,
        position: index + 1, // New position based on the current order
      }))

      await updateService.saveUpdatesOrder(orderedUpdates)
      const defaultFilter = updateService.getDefaultFilter()
      setFilter({ ...defaultFilter })
      showSuccessMsg(prefs.isEnglish ? 'Order saved' : 'סדר נשמר')
    } catch (err) {
      console.log(err)
      showErrorMsg(prefs.isEnglish ? `Couldn't save order` : 'סדר לא נשמר')
    } finally {
      setIsLoading(false)
    }
  }

  function onStartDragEdit() {
    setDragEdit(true)
    const defaultFilter = updateService.getDefaultFilter()
    setFilter({ ...defaultFilter, isAll: true })
  }

  return (
    <div className='control-container'>
      {user && user.isAdmin && isDragEdit ? (
        <ButtonGroup
          variant='contained'
          aria-label='Basic button group'
          style={{ direction: 'ltr' }}
        >
          <LoadingButton
            onClick={() => {
              onCancelEdit()
            }}
          >
            {prefs.isEnglish ? 'Cancel' : 'ביטול'}
          </LoadingButton>
          <LoadingButton
            variant='contained'
            onClick={() => {
              onSaveOrder()
            }}
          >
            {prefs.isEnglish ? 'Save' : 'שמירה'}
          </LoadingButton>
        </ButtonGroup>
      ) : (
        user &&
        user.isAdmin && (
          <Button
            variant='contained'
            onClick={() => {
              onStartDragEdit()
            }}
          >
            {prefs.isEnglish ? 'Reorder' : 'שינוי סדר'}
          </Button>
        )
      )}
      {!isDragEdit && (
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
      )}
    </div>
  )
}
