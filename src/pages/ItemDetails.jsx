import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { loadItem, addItemMsg } from '../store/actions/item.actions'

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
      <Link to='/item'>{prefs.isEnglish ? 'Back to list' : 'חזרה לתפריט'}</Link>
      <h1>{prefs.isEnglish ? item.title.eng : item.title.he}</h1>
    </section>
  )
}
