import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

import { setIsModal, setModalMessage } from '../store/actions/system.actions'

import { userService } from '../services/user/user.service'

import { updateCart } from '../store/actions/user.actions'
import { smoothScroll } from '../services/util.service'

import { MemberTypes } from './MemberTypes'

import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import { setIsLoading } from '../store/actions/system.actions'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'

export function AddToCartButton({ item, quantity, onRemoveItem }) {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  const user = useSelector((stateSelector) => stateSelector.userModule.user)
  const navigate = useNavigate()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const setActionButtons = async () => {
      try {
        const stateToSet = await shouldShowActionBtns()
        if (stateToSet) {
          setIsAdmin(true)
        }
      } catch (err) {
        showErrorMsg(
          prefs.isEnglish
            ? `Couldn't show action buttons`
            : 'לא היה ניתן להראות כפתורים'
        )
      }
    }
    setActionButtons()
  }, [user])

  async function shouldShowActionBtns(item) {
    try {
      const user = await userService.getLoggedinUser()

      if (!user) return false
      if (user.isAdmin) return true
      // return item.owner?._id === user._id
    } catch (err) {
      throw err
    }
  }

  async function onAddToCart(itemToAdd, quantity = 1) {
    if (!user) {
      // support for safari browsers
      event.preventDefault() // Stop the link from navigating immediately
      smoothScroll()

      setTimeout(() => {
        navigate('/user/login')
      }, 300) // Adjust time based on your smoothScroll timing
      return
    }

    const itemsIds = user.items.map((item) => {
      return item.id
    })

    if (itemToAdd.types.includes('card')) {
      const messageToSet = {
        he: `משתלם יותר להיות מנוי!`,
        eng: `Members pay less!`,
        link: '/member',
        extra: <MemberTypes />,
      }
      setModalMessage(messageToSet)
      setIsModal(true)
    }

    if (itemsIds.includes(itemToAdd._id)) {
      const idx = user.items.findIndex((item) => item.id === itemToAdd._id)
      let newQuantity
      if (quantity === 1) {
        newQuantity = user.items[idx].quantity + 1
      } else {
        newQuantity = user.items[idx].quantity + quantity
      }
      user.items.splice(idx, 1, {
        id: itemToAdd._id,
        quantity: newQuantity,
      })
    } else {
      user.items.push({
        id: itemToAdd._id,
        quantity: quantity || 1,
      })
    }

    try {
      setIsLoading(true)
      await updateCart(user)
      showSuccessMsg(prefs.isEnglish ? 'Item added to cart' : 'מוצר נוסף לעגלה')
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    (isAdmin && (
      <ButtonGroup
        variant='contained'
        aria-label='Basic button group'
        style={{ direction: 'ltr' }}
      >
        <Button
          className='edit-btn'
          onClick={() => {
            smoothScroll()
            navigate(`/item/edit/${item._id}`)
          }}
        >
          {prefs.isEnglish ? 'Edit' : 'עריכה'}
        </Button>
        <Button className='edit-btn' onClick={() => onRemoveItem(item._id)}>
          {prefs.isEnglish ? 'Remove' : 'הסרה'}
        </Button>
      </ButtonGroup>
    )) || (
      <Button
        className='add-to-cart-btn'
        variant='contained'
        onClick={() => onAddToCart(item, quantity)}
      >
        {prefs.isEnglish ? 'Add To Cart' : 'הוסף לעגלה'}
      </Button>
    )
  )
}
