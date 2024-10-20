import { useEffect } from 'react'
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
          <span>{item.price}</span>
          <div className='quantity-container'>
            <button>
              <AddIcon />
            </button>
            <input type='number' name='' id='' />
            <button>
              <RemoveIcon />
            </button>
          </div>
        </div>
        <AddToCartButton item={item} />
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
