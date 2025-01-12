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

export function OrderList({
  user,
  orders,
  maxPage,
  filter,
  setFilterBy,
  updateOrder,
}) {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const text = {
    he: 'הזמנות',
    eng: 'Orders',
  }

  const setSort = () => {
    setFilterBy({ ...filter, sortDir: filter.sortDir * -1, pageIdx: 0 })
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
      {location.pathname !== '/admin/order' && (
        <>
          <HeadContainer text={text} />
          {user && (
            <b className='hello-text'>
              {prefs.isEnglish
                ? `Hello, ${user.fullname}`
                : `שלום, ${user.fullname}`}
            </b>
          )}
        </>
      )}
      <div className='list-container'>
        {orders.length > 0 ? (
          orders.map((order, index) => {
            return (
              <OrderPreview
                order={order}
                key={`${order._id}${makeId()}`}
                updateOrder={updateOrder}
              />
            )
          })
        ) : user && !user.isAdmin ? (
          <NoOrders />
        ) : (
          <AdminNoOrders />
        )}
      </div>
    </div>
  )
}

function NoOrders() {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  return (
    <div className='no-orders-container'>
      <Link to={'/item'} className={prefs.isDarkMode ? 'dark-mode' : ''}>
        {prefs.isEnglish ? 'Create an order first' : 'יש לבצע הזמנה'}
      </Link>
      <img src={prefs.isDarkMode ? emptyCartDarkMode : emptyCart} alt='' />
    </div>
  )
}

function AdminNoOrders() {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  return (
    <div className='no-orders-container'>
      <b>{prefs.isEnglish ? 'No available orders yet...' : 'אין הזמנות...'}</b>
    </div>
  )
}
