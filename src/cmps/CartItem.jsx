import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { itemService } from '../services/item/item.service'
import { userService } from '../services/user/user.service'

import { updateCart } from '../store/actions/user.actions'

import { Quantity } from './Quantity'

import Divider from '@mui/material/Divider'
import { setIsLoading } from '../store/actions/system.actions'

export function CartItem({ item }) {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const user = useSelector((stateSelector) => stateSelector.userModule.user)
  const [quantity, setQuantity] = useState(item.quantity)

  const navigate = useNavigate()

  useEffect(() => {
    const updateItemQuantity = async () => {
      const idx = user.items.findIndex(
        (itemToUpdate) => itemToUpdate.id === item.id
      )
      user.items.splice(idx, 1, { ...item, quantity: quantity })
      console.log(user)
      const userToUpdate = { ...user }
      console.log(userToUpdate)

      try {
        setIsLoading(true)
        const saved = await updateCart(userToUpdate)
      } catch (err) {
        console.log(err)
      } finally {
        setIsLoading(false)
      }
    }

    updateItemQuantity()
    // console.log(item)
  }, [quantity])

  return (
    <>
      <div
        className={`item-container ${item.isDiscount && 'discount'}`}
        key={`${item.id}Cart`}
      >
        <img
          src={item.cover}
          alt=''
          onClick={() => navigate(`/item/${item.id}`)}
        />
        <div className='title-container'>
          <Link
            to={`/item/${item.id}`}
            className={prefs.isDarkMode ? 'dark-mode' : ''}
          >
            {prefs.isEnglish ? item.title.eng : item.title.he}
          </Link>
          <span>₪{item.price}</span>
        </div>
        <Quantity
          quantity={quantity}
          setQuantity={setQuantity}
          isCart={true}
          item={item}
        />
        {item.isDiscount && (
          <span className={`discount-tag ${!prefs.isEnglish && 'rtl'}`}>
            {prefs.isEnglish ? 'Discount' : 'הנחה'}
          </span>
        )}
      </div>
      {/* <Divider orientation='horizontal' flexItem /> */}
    </>
  )
}
