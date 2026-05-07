import { useState } from 'react'
import { useSelector } from 'react-redux'
import {
  setIsLoading,
  setIsModal,
  setModalMessage,
} from '../store/actions/system.actions.js'
import { setOriginalPrice, updateCart } from '../store/actions/user.actions.js'

import { ConfirmModal } from './ConfirmModal.jsx'

import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { showErrorMsg } from '../services/event-bus.service.js'

export function Quantity({ quantity, setQuantity, isCart, item }) {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const user = useSelector((stateSelector) => stateSelector.userModule.user)
  const originalItems = useSelector(
    (stateSelector) => stateSelector.userModule.originalItems
  )
  const originalPrice = useSelector(
    (stateSelector) => stateSelector.userModule.originalPrice
  )

  const isLoading = useSelector((stateSelector) => stateSelector.systemModule.isLoading)


  const onSetQuantity = (diff) => {
    if (isLoading) return
    if (quantity === 1 && diff === -1 && !isCart) return
    if (quantity === 1 && diff === -1 && isCart) {
      setIsModal(true)
      const messageToSet = {
        he: 'להסיר מוצר?',
        eng: `Remove item?`,

        buttons: [
          {
            title: { he: 'ביטול', eng: 'Cancel' },
            func: () => setIsModal(false),
          },
          {
            title: { he: 'אישור', eng: 'Confirm' },
            func: onRemoveFromCart,
          },
        ],
      }
      setModalMessage(messageToSet)
      return
    }

    const originalItem = originalItems.find(
      (originalItem) => originalItem.id === item.id
    )
    

    let priceToSet
    if (originalItem && originalItem.id === item.id) {
      priceToSet = originalPrice + originalItem.price * diff

    } else {
      priceToSet = originalPrice + item.price * diff
    }
    
    setOriginalPrice(priceToSet)
    setQuantity((prev) => prev + diff)
  }

  const handleChange = (ev) => {
    if (isLoading) return
    let value = ev.target.value
    value = +value
    if (value > 0) setQuantity(value)
  }

  async function onRemoveFromCart() {
    if (isLoading) return
    const idx = user.items.findIndex(
      (itemToRemove) => itemToRemove.id === item.id
    )
    user.items.splice(idx, 1)
    const originalItem = originalItems.find(
      (originalItem) => originalItem.id === item.id
    )
    if (originalItem && originalItem.id === item.id) {
      setOriginalPrice(originalPrice - originalItem.price)
    }

    try {
      setIsLoading(true)
      const saved = await updateCart({ ...user })
    } catch (err) {
      // // console.log(err)
      showErrorMsg(
        prefs.isEnglish ? `Couldn't remove from cart` : 'לא היה ניתן להסיר מוצר'
      )
    } finally {
      setIsLoading(false)
      setIsModal(false)
    }
  }

  return (
    <>
      <div className='quantity-container'>
        <span>{prefs.isEnglish ? 'Quantity' : 'כמות'}</span>
        <button onClick={() => onSetQuantity(1)} disabled={isLoading}>
          <AddIcon />
        </button>
        <input
          type='number'
          name=''
          id=''
          value={quantity}
          onChange={handleChange}
          disabled
        />
        <button onClick={() => onSetQuantity(-1)} disabled={isLoading}>
          <RemoveIcon />
        </button>
      </div>

      {/* {isModal && (
        <ConfirmModal
          isModal={isModal}
          setIsModal={setIsModal}
          item={item}
          onRemove={onRemoveFromCart}
        />
      )} */}
    </>
  )
}
