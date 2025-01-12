import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
  useNavigate,
  useSearchParams,
  useParams,
  useLocation,
} from 'react-router-dom'

import { onPageNavigation } from '../services/util.service'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'

import { ButtonGroup } from '@mui/material'
import { Button } from '@mui/material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

export function Controller({ filter, setFilter, maxPage, onAdd }) {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const navigate = useNavigate()
  const user = useSelector((stateSelector) => stateSelector.userModule.user)
  const location = useLocation()

  return (
    <div className='class-navigation-container'>
      <ButtonGroup
        variant='contained'
        aria-label='Basic button group'
        dir='ltr'
        className='page-controller-container'
      >
        <Button
          disabled={filter.pageIdx + 1 === maxPage}
          onClick={() => {
            onPageNavigation(1, filter, setFilter, maxPage)
          }}
        >
          <ArrowBackIosNewIcon />
        </Button>
        {/* <Button disabled={true}>{filter.pageIdx + 1}</Button> */}
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
      {user && user.isAdmin && location.pathname !== '/admin/order' && (
        <Button variant='contained' onClick={onAdd}>
          {prefs.isEnglish ? 'Add' : 'הוסף'}
        </Button>
      )}
    </div>
  )
}
