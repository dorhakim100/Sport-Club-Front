import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  loadItems,
  addItem,
  updateItem,
  removeItem,
  addItemMsg,
} from '../store/actions/item.actions'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { itemService } from '../services/item/item.service'
import { userService } from '../services/user/user.service'

import { ItemList } from '../cmps/ItemList'
import { ItemFilter } from '../cmps/ItemFilter'
import { setIsLoading } from '../store/actions/system.actions'

import cover from '../../public/imgs/picture.jpg'
import { DynamicCover } from '../cmps/DynamicCover'

import { Button } from '@mui/material'

export function ItemIndex() {
  const navigate = useNavigate()
  const [filterBy, setFilterBy] = useState(itemService.getDefaultFilter())
  const items = useSelector((storeState) => storeState.itemModule.items)
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  const [maxPage, setMaxPage] = useState()

  const [isGrid, setIsGrid] = useState(true)

  useEffect(() => {
    const setItems = async () => {
      try {
        setIsLoading(true)
        loadItems(filterBy)
        const max = await itemService.getMaxPage(filterBy)
        setMaxPage(max)
      } catch (err) {
        console.log(err)
      } finally {
        setIsLoading(false)
      }
    }
    setItems()
  }, [filterBy])

  async function onRemoveItem(itemId) {
    try {
      await removeItem(itemId)
      showSuccessMsg('Item removed')
    } catch (err) {
      showErrorMsg('Cannot remove item')
    }
  }

  async function onAddItem() {
    const item = itemService.getEmptyItem()

    delete item._id
    try {
      const savedItem = await addItem(item)
      showSuccessMsg(`Item added`)
      navigate(`/item/edit/${savedItem._id}`)
    } catch (err) {
      showErrorMsg('Cannot add item')
    }
  }

  async function onUpdateItem(item) {
    // const speed = +prompt('New speed?', item.speed)
    // if (speed === 0 || speed === item.speed) return

    // const itemToSave = { ...item, speed }

    try {
      // const savedItem = await updateItem(itemToSave)
      showSuccessMsg(`Item updated, new speed: ${savedItem.speed}`)
    } catch (err) {
      showErrorMsg('Cannot update item')
    }
  }

  return (
    <main className='item-index'>
      <DynamicCover coverSrc={cover} />
      <header className='item-index-header'>
        <h2>{prefs.isEnglish ? 'Store' : 'חנות'}</h2>
        {userService.getLoggedinUser() && (
          <Button variant='contained' onClick={onAddItem}>
            Add Item
          </Button>
        )}
      </header>
      <ItemFilter
        filterBy={filterBy}
        setFilterBy={setFilterBy}
        isGrid={isGrid}
        setIsGrid={setIsGrid}
        maxPage={maxPage}
      />
      <ItemList
        items={items}
        onRemoveItem={onRemoveItem}
        onUpdateItem={onUpdateItem}
        isGrid={isGrid}
      />
    </main>
  )
}
