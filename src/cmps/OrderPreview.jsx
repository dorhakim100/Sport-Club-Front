import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { smoothScroll } from '../services/util.service'

export function OrderPreview({ order }) {
  console.log(order)
  const navigate = useNavigate()
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)

  return (
    <div className='order-container'>
      <div className='is-ready-container'>
        <span>{order.isReady ? 'ready' : 'not ready'}</span>
        <span>{new Date(order.createdAt).toLocaleDateString('he')}</span>
      </div>

      <div className='order-num-container'>
        <span>{prefs.isEnglish ? `Order num` : `הזמנה מס׳`}</span>
        <span>{order.orderNum}</span>
      </div>
      <div className='items-container'>
        {order.items.map((item, index) => {
          return (
            <div className='item-container' key={`order${item.id}`}>
              <b
                onClick={() => {
                  navigate(`/item/${item.id}`)
                  smoothScroll()
                }}
              >
                {prefs.isEnglish ? item.title.eng : item.title.he}
              </b>

              <span>{item.quantity}</span>
            </div>
          )
        })}
      </div>
      <div className='order-total-container'>
        <span>{prefs.isEnglish ? `Total` : `סה״כ`}</span>
        <span>{order.amount}</span>
      </div>
    </div>
  )
}
