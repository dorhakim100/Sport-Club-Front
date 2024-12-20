import { Nav } from '../cmps/Nav'

import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { updateService } from '../services/update/update.service'
import { loadUpdates } from '../store/actions/update.actions'

import { HeadContainer } from '../cmps/HeadContainer'

import { Button } from '@mui/material'
import { LoadingButton } from '@mui/lab'

export function OrderIndex() {
  const origin = {
    path: '/admin',
    he: 'מנהל',
    eng: 'Admin',
  }

  const links = [
    {
      path: 'update',
      he: 'עדכונים',
      eng: 'Updates',
    },
    {
      path: 'order',
      he: 'הזמנות',
      eng: 'Orders',
    },
  ]

  const text = {
    eng: 'Orders',
    he: 'הזמנות',
  }

  return (
    <div className='order-index-container'>
      <HeadContainer text={text} />
      {/* <Nav origin={origin} links={links} /> */}
    </div>
  )
}
