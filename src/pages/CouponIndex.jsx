import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { HeadContainer } from '../cmps/HeadContainer'

import { showErrorMsg } from '../services/event-bus.service'
import { setIsLoading } from '../store/actions/system.actions'

import { Button } from '@mui/material'
import { LoadingButton } from '@mui/lab'

export function CouponIndex() {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)

  const head = {
    he: 'קופונים',
    eng: 'Coupons',
  }

  return (
    <div className='coupon-index-container'>
      <HeadContainer text={head} />
    </div>
  )
}
