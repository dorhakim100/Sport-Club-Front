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

import Divider from '@mui/material/Divider'

export function OrderList({ user, orders }) {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const text = {
    he: 'הזמנות',
    eng: 'Orders',
  }

  useEffect(() => {}, [user])

  return (
    <div className='orders-list-container'>
      <HeadContainer text={text} />
      <b className='hello-text'>
        {prefs.isEnglish ? `Hello, ${user.fullname}` : `שלום, ${user.fullname}`}
      </b>
      <div className='list-container'>
        {user.ordersIds.length > 0 ? (
          orders.map((order, index) => {
            return (
              <>
                <OrderPreview order={order} key={`${order._id}${makeId()}`} />

                {/* {order.length > 1 && index !== orders.length - 1 && (
                <Divider
                  orientation='horizontal'
                  flexItem
                  key={`${order._id}Divider`}
                />
                  )} */}
              </>
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
