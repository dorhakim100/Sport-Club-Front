import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { CartItem } from './CartItem'

import Divider from '@mui/material/Divider'

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
