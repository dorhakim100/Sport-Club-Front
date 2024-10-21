import { useNavigate, useParams } from 'react-router-dom'
import { userService } from '../services/user/user.service'
import { ItemPreview } from './ItemPreview'
import { useSelector } from 'react-redux'

import { updateCart } from '../store/actions/user.actions'

import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import { setIsLoading } from '../store/actions/system.actions'

export function AddToCartButton({ item }) {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  const user = useSelector((stateSelector) => stateSelector.userModule.user)
  function shouldShowActionBtns(item) {
    const user = userService.getLoggedinUser()

    if (!user) return false
    if (user.isAdmin) return true
    // return item.owner?._id === user._id
  }

  async function onAddToCart(itemToAdd) {
    console.log(itemToAdd)
    const itemsIds = user.items.map((item) => {
      return item.id
    })

    if (itemsIds.includes(itemToAdd._id)) {
      const idx = user.items.findIndex((item) => item.id === itemToAdd._id)
      let newQuantity
      if (itemToAdd.quantity === 1) {
        newQuantity = user.items[idx].quantity + 1
      } else {
        newQuantity = user.items[idx].quantity + itemToAdd.quantity
      }
      user.items.splice(idx, 1, {
        id: itemToAdd._id,
        quantity: newQuantity,
        title: itemToAdd.title,
        cover: itemToAdd.cover,
      })
    } else {
      user.items.push({
        id: itemToAdd._id,
        quantity: itemToAdd.quantity || 1,
        title: itemToAdd.title,
        cover: itemToAdd.cover,
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
          Edit
        </Button>
        <Button onClick={() => onRemoveItem(item._id)}>Remove</Button>
      </ButtonGroup>
    )) || (
      <Button variant='contained' onClick={() => onAddToCart(item)}>
        {prefs.isEnglish ? 'Add To Cart' : 'הוסף לעגלה'}
      </Button>
    )
  )
}
