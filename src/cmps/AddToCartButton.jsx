import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'

import { userService } from '../services/user/user.service'
import { ItemPreview } from './ItemPreview'

import { updateCart } from '../store/actions/user.actions'

import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import { setIsLoading } from '../store/actions/system.actions'

export function AddToCartButton({ item, quantity }) {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  const user = useSelector((stateSelector) => stateSelector.userModule.user)
  const navigate = useNavigate()
  function shouldShowActionBtns(item) {
    const user = userService.getLoggedinUser()

    if (!user) return false
    if (user.isAdmin) return true
    // return item.owner?._id === user._id
  }

  async function onAddToCart(itemToAdd, quantity = 1) {
    if (!user) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      navigate('/user/login')
      return
    }

    const itemsIds = user.items.map((item) => {
      return item.id
    })

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
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    (shouldShowActionBtns(item) && (
      <ButtonGroup
        variant='contained'
        aria-label='Basic button group'
        style={{ direction: 'ltr' }}
      >
        <Button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' })
            navigate(`/item/edit/${item._id}`)
          }}
        >
          {prefs.isEnglish ? 'Edit' : 'עריכה'}
        </Button>
        <Button onClick={() => onRemoveItem(item._id)}>
          {prefs.isEnglish ? 'Remove' : 'הסרה'}
        </Button>
      </ButtonGroup>
    )) || (
      <Button variant='contained' onClick={() => onAddToCart(item, quantity)}>
        {prefs.isEnglish ? 'Add To Cart' : 'הוסף לעגלה'}
      </Button>
    )
  )
}
