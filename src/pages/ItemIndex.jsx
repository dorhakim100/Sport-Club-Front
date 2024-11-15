import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useSearchParams, useParams } from 'react-router-dom'

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

import { useEffectUpdate } from '../customHooks/useEffectUpdate'

import { ItemList } from '../cmps/ItemList'
import { ItemFilter } from '../cmps/ItemFilter'
import { setIsLoading } from '../store/actions/system.actions'

import { HeadContainer } from '../cmps/HeadContainer'
import { DynamicCover } from '../cmps/DynamicCover'

import cover from '../../public/imgs/picture.jpg'

import { Button } from '@mui/material'

export function ItemIndex() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  // Update filterBy based on the URL (searchParams or default filter)
  const [filterBy, setFilterBy] = useState({
    types: searchParams.get('types')
      ? searchParams.get('types').split(',')
      : [],
    pageIdx: +searchParams.get('pageIdx'),
    sortDir: +searchParams.get('sortDir') || '',
  })

  const items = useSelector((storeState) => storeState.itemModule.items)
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  const [maxPage, setMaxPage] = useState()
  const [isGrid, setIsGrid] = useState(true)

  const headText = { he: 'מוצרים', eng: 'Items' }

  useEffect(() => {
    // Fetch filter settings from searchParams
    const sortDir = +searchParams.get('sortDir') || ''
    const pageIdx = +searchParams.get('pageIdx') || 0
    const typesParam = searchParams.get('types')

    const types = typesParam ? typesParam.split(',') : []

    const filterToSet = { ...filterBy, sortDir, types, pageIdx }

    // Only update filterBy if it's different
    if (JSON.stringify(filterBy) !== JSON.stringify(filterToSet)) {
      setFilterBy(filterToSet)
    }
  }, [searchParams]) // Runs when searchParams change

  useEffect(() => {
    const setItems = async () => {
      try {
        setIsLoading(true)

        const res = await loadItems(filterBy)

        const max = await itemService.getMaxPage(filterBy)

        setMaxPage(max)

        // Only update searchParams if needed
        if (
          searchParams.get('sortDir') !== filterBy.sortDir.toString() ||
          searchParams.get('pageIdx') !== filterBy.pageIdx.toString() ||
          searchParams.get('types') !== filterBy.types.toString()
        ) {
          setSearchParams({
            sortDir: filterBy.sortDir.toString(),
            pageIdx: filterBy.pageIdx.toString(),
            types: filterBy.types.toString(),
          })
        }
      } catch (err) {
        console.log(err)
      } finally {
        setIsLoading(false)
      }
    }

    setItems()
  }, [filterBy]) // Run when filterBy changes

  async function onRemoveItem(itemId) {
    try {
      await removeItem(itemId)
      showSuccessMsg('Item removed')
    } catch (err) {
      showErrorMsg('Cannot remove item')
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
      <header className='item-index-header'>
        <h2>{prefs.isEnglish ? 'Store' : 'חנות'}</h2>
        <DynamicCover coverSrc={cover} prefs={prefs} />
        <HeadContainer text={headText} />
      </header>
      <div className='control-container'>
        <ItemFilter
          filterBy={filterBy}
          setFilterBy={setFilterBy}
          isGrid={isGrid}
          setIsGrid={setIsGrid}
          maxPage={maxPage}
        />
        {/* {userService.getLoggedinUser() && (
          <Button variant='contained' onClick={onAddItem}>
            Add Item
          </Button>
        )} */}
      </div>
      <ItemList
        items={items}
        onRemoveItem={onRemoveItem}
        onUpdateItem={onUpdateItem}
        isGrid={isGrid}
      />
    </main>
  )
}
