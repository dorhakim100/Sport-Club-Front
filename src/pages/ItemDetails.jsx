import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { loadItem, addItemMsg } from '../store/actions/item.actions'

import { AddToCartButton } from '../cmps/AddToCartButton'
import { Quantity } from '../cmps/Quantity.jsx'
import { ItemNavigation } from '../cmps/ItemNavigation'

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { ContactUs } from '../cmps/ContactUs'

export function ItemDetails() {
  const { itemId } = useParams()
  const item = useSelector((storeState) => storeState.itemModule.item)
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const [quantity, setQuantity] = useState(1)

  const [lastPage, setLastPage] = useState('')

  const itemFilter = useSelector(
    (stateSelector) => stateSelector.itemModule.filter
  )

  const getLatestPage = () => {
    let types = ''
    let typesStr = ''

    if (itemFilter.types.length > 0) {
      typesStr = itemFilter.types.map((type, index) => {
        const toReturn =
          index === 0 ? (types = type) : (types = types + `%2C${type}`)
        // setLastPage(toReturn)
        return toReturn
      })
    }
    const str = `/item${
      itemFilter.types.length === 1 ? `/${itemFilter.types[0]}` : ''
    }?pageIdx=${itemFilter.pageIdx}&types=${typesStr}`
    console.log(str)
    setLastPage(str)
    return str
  }

  useEffect(() => {
    getLatestPage()
    loadItem(itemId, itemFilter)
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
    <>
      {item.prevNext && (
        <ItemNavigation item={item} type={'item'} lastPage={lastPage} />
      )}
      <section className='item-details-container'>
        {/* <Link to='/item' className={prefs.isDarkMode && 'dark-mode'}>
          {prefs.isEnglish ? `Back to list` : 'חזרה לתפריט'}
          <ArrowBackIosNewIcon />
        </Link> */}
        <div className='title-container'>
          <b>{prefs.isEnglish ? item.title.eng : item.title.he}</b>
          <div className='price-container'>
            <b>₪{item.price}</b>
            <Quantity quantity={quantity} setQuantity={setQuantity} />
          </div>
          <AddToCartButton item={{ ...item }} quantity={quantity} />
        </div>
        <div className='img-container'>
          <img src={item.cover} alt='' />
        </div>
        <div className='preview-container'>
          <p>{prefs.isEnglish ? item.preview.eng : item.preview.he}</p>
        </div>
      </section>
      <ContactUs />
    </>
  )
}
