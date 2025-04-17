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

export function Quantity({ quantity, setQuantity, isCart, item }) {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const user = useSelector((stateSelector) => stateSelector.userModule.user)
  const originalItem = useSelector(
    (stateSelector) => stateSelector.userModule.originalItem
  )
  const originalPrice = useSelector(
    (stateSelector) => stateSelector.userModule.originalPrice
  )

  // const [isModal, setIsModal] = useState(false)

  const onSetQuantity = (diff) => {
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

    let priceToSet
    if (originalItem.id && originalItem.id === item.id) {
      priceToSet = originalPrice + originalItem.price * diff

      setOriginalPrice(priceToSet)
    } else {
      priceToSet = originalPrice + item.price * diff
      setOriginalPrice(priceToSet)
    }
    setQuantity((prev) => prev + diff)
  }

  const handleChange = (ev) => {
    let value = ev.target.value
    value = +value
    if (value > 0) setQuantity(value)
  }

  async function onRemoveFromCart() {
    const idx = user.items.findIndex(
      (itemToRemove) => itemToRemove.id === item.id
    )
    user.items.splice(idx, 1)
    if (originalItem.id && originalItem.id === item.id) {
      setOriginalPrice(null)
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
        <button onClick={() => onSetQuantity(1)}>
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
        <button onClick={() => onSetQuantity(-1)}>
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
