import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { smoothScroll } from '../services/util.service'

import pending from '/public/imgs/pending.svg'
import pendingDarkMode from '/public/imgs/pending-dark-mode.svg'
import ready from '/public/imgs/ready.svg'
import readyDarkMode from '/public/imgs/ready-dark-mode.svg'

export function OrderPreview({ order }) {
  console.log(order)
  const navigate = useNavigate()
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const user = useSelector((stateSelector) => stateSelector.userModule.user)

  return (
    <div className={`order-container ${prefs.isDarkMode && 'dark-mode'}`}>
      <div className='date-is-ready-container'>
        <div
          className={`is-ready-container ${
            user && user.isAdmin ? 'admin' : ''
          }`}
        >
          <IsPendingSvg order={order} />
          <span>
            {order.isReady
              ? prefs.isEnglish
                ? `Ready`
                : 'מוכן לאיסוף'
              : prefs.isEnglish
              ? `Pending`
              : `בטיפול`}
          </span>
        </div>
        <span>{new Date(order.createdAt).toLocaleDateString('he')}</span>
      </div>

      <div className='order-num-container'>
        <span>{prefs.isEnglish ? `Order num` : `הזמנה מס׳`}</span>
        <span>{order.orderNum}</span>
      </div>
      <div className='items-container'>
        {order.items.map((item, index) => {
          return (
            <div
              className={`item-container ${prefs.isDarkMode && 'dark-mode'}`}
              key={`order${item.id}`}
            >
              <b
                onClick={() => {
                  navigate(`/item/${item.id}`)
                  smoothScroll()
                }}
              >
                {prefs.isEnglish ? item.title.eng : item.title.he}
              </b>
              <div className='quantity-container'>
                {prefs.isEnglish && <span>x</span>}
                <span>{item.quantity}</span>
                {!prefs.isEnglish && <span>x</span>}
              </div>
            </div>
          )
        })}
      </div>
      <div className='order-total-container'>
        <span>{prefs.isEnglish ? `Total` : `סה״כ`}</span>
        <span>{`${!prefs.isEnglish ? '₪' : ''}${order.amount}${
          prefs.isEnglish ? '₪' : ''
        }`}</span>
      </div>
    </div>
  )
}

function IsPendingSvg({ order }) {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)

  return (
    <img
      src={
        order.isReady
          ? prefs.isDarkMode
            ? readyDarkMode
            : ready
          : prefs.isDarkMode
          ? pendingDarkMode
          : pending
      }
      alt=''
    />
  )
}
