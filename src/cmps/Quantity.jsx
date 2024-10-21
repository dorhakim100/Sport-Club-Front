import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { RemoveModal } from './RemoveModal.jsx'

import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'

export function Quantity({ quantity, setQuantity, isCart, item }) {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)

  const [isModal, setIsModal] = useState(false)

  const onSetQuantity = (diff) => {
    if (quantity === 1 && diff === -1 && !isCart) return
    if (quantity === 1 && diff === -1 && isCart) {
      setIsModal(true)
      return
    }
    setQuantity((prev) => prev + diff)
  }

  const handleChange = (ev) => {
    let value = ev.target.value
    value = +value
    if (value > 0) setQuantity(value)
  }

  return (
    <>
      <div className='quantity-container'>
        <span>{prefs.isEnglish ? 'Quantity' : 'כמות'}</span>
        <button>
          <AddIcon onClick={() => onSetQuantity(1)} />
        </button>
        <input
          type='number'
          name=''
          id=''
          value={quantity}
          onChange={handleChange}
        />
        <button>
          <RemoveIcon onClick={() => onSetQuantity(-1)} />
        </button>
      </div>

      {isModal && (
        <RemoveModal isModal={isModal} setIsModal={setIsModal} item={item} />
      )}
    </>
  )
}
