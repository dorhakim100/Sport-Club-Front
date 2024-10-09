import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { loadItem, addItemMsg } from '../store/actions/item.actions'

export function ItemDetails() {
  const { itemId } = useParams()
  const item = useSelector((storeState) => storeState.itemModule.item)

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
    <section className='item-details'>
      <Link to='/item'>Back to list</Link>
      <h1>Item Details</h1>
      {item && (
        <div>
          <h3>{item.vendor}</h3>
          <h4>${item.price}</h4>
          <pre> {JSON.stringify(item, null, 2)} </pre>
        </div>
      )}
      <button
        onClick={() => {
          onAddItemMsg(item._id)
        }}
      >
        Add item msg
      </button>
    </section>
  )
}
