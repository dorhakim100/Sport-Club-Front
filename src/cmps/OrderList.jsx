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

export function OrderList({ user }) {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const text = {
    he: 'הזמנות',
    eng: 'Orders',
  }

  useEffect(() => {
    const loadOrders = async () => {
      const filter = { ...filterBy, ordersIds: user.ordersIds }
      setFilterBy(filter)
      try {
        setIsLoading(true)
        const o = await loadPayments(filter)
      } catch (err) {
        showErrorMsg(
          prefs.isEnglish ? `Couldn't show orders` : `תקלה בהצגת הזמנות`
        )
      } finally {
        setIsLoading(false)
      }
    }
  }, [user])

  return (
    <div className='orders-list-container'>
      <HeadContainer text={text} />
      <div className='list-container'>
        <b>
          {prefs.isEnglish
            ? `Hello, ${user.fullname}`
            : `שלום, ${user.fullname}`}
        </b>
        {user.ordersIds.length > 0 ? (
          user.ordersIds.map((orderId) => {
            return (
              <OrderPreview orderId={orderId} key={`${orderId}${makeId()}`} />
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
