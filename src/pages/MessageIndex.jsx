import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { updateService } from '../services/update/update.service'
import { loadUpdates } from '../store/actions/update.actions'

import { HeadContainer } from '../cmps/HeadContainer'

import { Button } from '@mui/material'
import { LoadingButton } from '@mui/lab'

export function MessageIndex() {
  const text = {
    eng: 'Messages',
    he: 'הודעות',
  }

  return (
    <div className='page-container message-index'>
      <HeadContainer text={text} />
    </div>
  )
}
