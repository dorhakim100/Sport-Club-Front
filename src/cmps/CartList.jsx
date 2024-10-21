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

export function CartList({ cart, setCart }) {
  console.log(cart)
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const user = useSelector((stateSelector) => stateSelector.userModule.user)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    console.log(user)
    // updateCart({...user})
  }, [quantity])

  return (
    <div className='cart-container'>
      <div className='items-container'>
        {cart.map((item, index) => {
          return (
            <>
              {/* {index !== 0 && <Divider orientation='horizontal' flexItem />} */}
              <CartItem item={item} />
              <Divider orientation='horizontal' flexItem />
              {/* {cart.length === 1 && (
                <Divider orientation='horizontal' flexItem />
              )} */}
            </>
          )
        })}
      </div>
    </div>
  )
}
