import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { itemService } from '../services/item/item.service'
import { userService } from '../services/user/user.service'
import { updateCart } from '../store/actions/user.actions'

import { Quantity } from './Quantity'
import { CartItem } from './CartItem'

import Divider from '@mui/material/Divider'
import { makeId, smoothScroll } from '../services/util.service'

export function CartList({ cart, setCart }) {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const user = useSelector((stateSelector) => stateSelector.userModule.user)
  const [quantity, setQuantity] = useState(1)

  const navigate = useNavigate()

  return (
    <>
      <div className='items-container'>
        {cart.map((item, index) => {
          return (
            <div className='cart-item' key={`${item.id}Cart`}>
              {/* {index !== 0 && <Divider orientation='horizontal' flexItem />} */}
              <CartItem item={item} />
              {index !== cart.length - 1 && (
                <Divider orientation='horizontal' flexItem />
              )}
              {/* {cart.length === 1 && (
                <Divider orientation='horizontal' flexItem />
              )} */}
            </div>
          )
        })}
      </div>
    </>
  )
}
