import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { smoothScroll } from '../services/util.service'
import { updatePayment } from '../store/actions/payment.actions'

import pending from '/public/imgs/pending.svg'
import pendingDarkMode from '/public/imgs/pending-dark-mode.svg'
import ready from '/public/imgs/ready.svg'
import readyDarkMode from '/public/imgs/ready-dark-mode.svg'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { setIsLoading } from '../store/actions/system.actions'
import Divider from '@mui/material/Divider'

export function OrderPreview({ order, updateOrder }) {
  const navigate = useNavigate()
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const user = useSelector((stateSelector) => stateSelector.userModule.user)

  const onUpdateOrder = async () => {
    if (!user.isAdmin) return
    try {
      setIsLoading(true)
      updateOrder({ ...order, isReady: !order.isReady })

      showSuccessMsg(
        prefs.isEnglish ? `Order updated successfully` : 'הזמנה עודכנה בהצלחה'
      )
    } catch (err) {
      console.log(err)
      showErrorMsg(
        prefs.isEnglish ? `Couldn't update order` : 'לא היה ניתן לעדכן הזמנה'
      )
    } finally {
      setIsLoading(false)
    }
  }
  console.log(order)

  return (
    <div
      className={`order-container ${prefs.isDarkMode && 'dark-mode'} ${
        order.isReady ? 'ready' : ''
      }`}
    >
      <div className={`date-is-ready-container`}>
        <div
          className={`is-ready-container ${
            user && user.isAdmin ? 'admin' : ''
          }`}
          onClick={onUpdateOrder}
        >
          {order.isReady ? <ReadySvg /> : <PendingSvg />}

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
        {user && user.isAdmin && (
          <div className='details-container'>
            <b>{order.user.fullname}</b>
            <span>-</span>
            <b>{order.user.phone}</b>
          </div>
        )}
        <span>{new Date(order.createdAt).toLocaleDateString('he')}</span>
      </div>

      <div className='order-num-container'>
        <span>{prefs.isEnglish ? `Order num` : `הזמנה מס׳`}</span>
        <span>{order.orderNum}</span>
      </div>
      <div className='items-container'>
        {order.items.map((item, index, items) => {
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
              {index + 1 < items.length && (
                <Divider
                  style={prefs.isDarkMode ? { backgroundColor: 'white' } : {}}
                  orientation='vertical'
                  flexItem
                />
              )}
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

function PendingSvg() {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)

  return <img src={prefs.isDarkMode ? pendingDarkMode : pending} alt='' />
}

function ReadySvg() {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  return <img src={prefs.isDarkMode ? readyDarkMode : ready} alt='' />
}
