import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { loadItem, addItemMsg } from '../store/actions/item.actions'

import { AddToCartButton } from '../cmps/AddToCartButton'
import { Quantity } from '../cmps/Quantity.jsx'

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'

export function ItemDetails() {
  const { itemId } = useParams()
  const item = useSelector((storeState) => storeState.itemModule.item)
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    loadItem(itemId)
  }, [itemId])

  async function onAddItemMsg(itemId) {
    try {
      await addItemMsg(itemId, 'bla bla ' + parseInt(Math.random() * 10))
      showSuccessMsg(`Item msg added`)
    } catch (err) {
      showErrorMsg('Cannot add item msg')
    }
  }

  return (
    <section className='item-details-container'>
      <Link to='/item'>
        {prefs.isEnglish ? `Back to list` : 'חזרה לתפריט'}
        <ArrowBackIosNewIcon />
      </Link>

      <div className='title-container'>
        <b>{prefs.isEnglish ? item.title.eng : item.title.he}</b>
        <div className='price-container'>
          <Quantity quantity={quantity} setQuantity={setQuantity} />
          {/* <div className='quantity-container'>
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
          </div> */}
          <b>₪{item.price}</b>
        </div>
        <AddToCartButton item={{ ...item, quantity }} />
      </div>
      <div className='img-container'>
        <img src={item.cover} alt='' />
      </div>
      <div className='preview-container'>
        <p>{prefs.isEnglish ? item.preview.eng : item.preview.he}</p>
      </div>
    </section>
  )
}
