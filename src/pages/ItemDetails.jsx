import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { loadItem, addItemMsg } from '../store/actions/item.actions'

import { AddToCartButton } from '../cmps/AddToCartButton'

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'

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

  const onSetQuantity = (diff) => {
    if (quantity === 1 && diff === -1) return
    console.log(diff)
    setQuantity((prev) => prev + diff)
  }

  const handleChange = (ev) => {
    let value = ev.target.value
    value = +value
    if (value > 0) setQuantity(value)
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
          <span>{item.price}</span>
          <div className='quantity-container'>
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
