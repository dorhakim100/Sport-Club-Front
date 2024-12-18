import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { itemService } from '../services/item/item.service'
import { userService } from '../services/user/user.service'

import { updateCart } from '../store/actions/user.actions'

import { Quantity } from './Quantity'

import Divider from '@mui/material/Divider'
import { setIsLoading } from '../store/actions/system.actions'
import { smoothScroll } from '../services/util.service'

export function CartItem({ item }) {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const user = useSelector((stateSelector) => stateSelector.userModule.user)
  const [quantity, setQuantity] = useState(item.quantity)

  const [isHover, setIsHover] = useState(false)

  const isFirstRender = useRef(true)

  const navigate = useNavigate()

  const navigateToItem = (event) => {
    if (isHover) return

    if (event.target.closest('.quantity-container')) {
      event.stopPropagation()
      return
    }
    smoothScroll()
    navigate(`/item/${item.id}`)
  }

  useEffect(() => {
    const updateItemQuantity = async () => {
      const idx = user.items.findIndex(
        (itemToUpdate) => itemToUpdate.id === item.id
      )
      user.items.splice(idx, 1, { ...item, quantity: quantity })

      const userToUpdate = { ...user }

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
  }, [quantity])

  return (
    <>
      <div
        className={`item-container ${item.isDiscount && 'discount'}`}
        key={`${item.id}Cart`}
        onClick={navigateToItem}
      >
        <img
          src={item.cover}
          alt=''
          // onClick={() => navigate(`/item/${item.id}`)}
        />
        <div className='title-container'>
          {/* <Link
            to={`/item/${item.id}`}
            className={prefs.isDarkMode ? 'dark-mode' : ''}
          > */}
          <b onClick={navigateToItem}>
            {prefs.isEnglish ? item.title.eng : item.title.he}
          </b>
          {/* </Link> */}
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
