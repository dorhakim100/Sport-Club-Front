import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { makeId } from '../services/util.service.js'
import { OrderPreview } from '../cmps/OrderPreview.jsx'
import { HeadContainer } from './HeadContainer.jsx'

import emptyCart from '/imgs/empty-cart.svg'
import emptyCartDarkMode from '/imgs/empty-cart-dark-mode.svg'
import { useEffect, useState } from 'react'
import { showErrorMsg } from '../services/event-bus.service.js'
import { setIsLoading } from '../store/actions/system.actions.js'
import { paymentService } from '../services/payment/payment.service.js'
import { loadPayments } from '../store/actions/payment.actions.js'
import { Controller } from './Controller.jsx'

import Divider from '@mui/material/Divider'
import { Button } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

export function OrderList({ user, orders, maxPage, filter, setFilterBy }) {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const text = {
    he: 'הזמנות',
    eng: 'Orders',
  }

  const setSort = () => {
    setFilterBy({ ...filter, sortDir: filter.sortDir * -1 })
  }

  const sortText = () => {
    const text = {}
    if (filter.sortDir === 1) {
      text.he = `סדר יורד`
      text.eng = `Descending Order`
    } else {
      text.he = `סדר עולה`
      text.eng = 'Ascending Order'
    }
    return text
  }

  return (
    <div className='orders-list-container'>
      <HeadContainer text={text} />
      <b className='hello-text'>
        {prefs.isEnglish ? `Hello, ${user.fullname}` : `שלום, ${user.fullname}`}
      </b>
      <div className='controller-container'>
        <Controller filter={filter} maxPage={maxPage} setFilter={setFilterBy} />
        <Button variant='contained' onClick={setSort}>
          {prefs.isEnglish ? sortText().eng : sortText().he}
          {filter.sortDir === 1 ? (
            <KeyboardArrowDownIcon />
          ) : (
            <KeyboardArrowUpIcon />
          )}
        </Button>
      </div>
      <div className='list-container'>
        {user.ordersIds.length > 0 ? (
          orders.map((order, index) => {
            return (
              <OrderPreview order={order} key={`${order._id}${makeId()}`} />
            )
          })
        ) : (
          <div className='no-orders-container'>
            <Link to={'/item'} className={prefs.isDarkMode ? 'dark-mode' : ''}>
              {prefs.isEnglish ? 'Create an order first' : 'יש לבצע הזמנה'}
            </Link>
            <img
              src={prefs.isDarkMode ? emptyCartDarkMode : emptyCart}
              alt=''
            />
          </div>
        )}
      </div>
    </div>
  )
}
