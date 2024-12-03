import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
  useNavigate,
  useSearchParams,
  useParams,
  useLocation,
} from 'react-router-dom'

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
import { ContactUs } from '../cmps/ContactUs'
import { Nav } from '../cmps/Nav'

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
  const location = useLocation()
  const [maxPage, setMaxPage] = useState()
  const [isGrid, setIsGrid] = useState(true)

  const [headText, setHeadText] = useState({ he: 'מוצרים', eng: 'Items' })
  const [cover, setCover] = useState(
    'https://res.cloudinary.com/dnxi70mfs/image/upload/v1732275016/DSC06192_1_ciikqh.jpg'
  )

  const origin = {
    path: '/item',
    he: 'מוצרים',
    eng: 'Items',
  }

  const links = [
    {
      path: 'card',
      he: 'כרטיסיות',
      eng: 'Cards',
    },
    {
      path: 'accessories',
      he: 'אביזרים',
      eng: 'Accessories',
    },
  ]

  useEffect(() => {
    // Fetch filter settings from searchParams
    const sortDir = +searchParams.get('sortDir') || ''
    const pageIdx = +searchParams.get('pageIdx') || 0
    const typesParam = searchParams.get('types')

    const types = typesParam ? typesParam.split(',') : []
    let filterToSet = {}
    switch (location.pathname) {
      case '/item/card':
        filterToSet = { ...filterBy, sortDir, types: ['card'], pageIdx }
        setHeadText({ he: 'כרטיסיות', eng: 'Cards' })
        setCover(
          'https://res.cloudinary.com/dnxi70mfs/image/upload/v1733237221/DSC06141_wifl4r.jpg'
        )
        break

      case '/item/accessories':
        filterToSet = { ...filterBy, sortDir, types: ['accessories'], pageIdx }
        setHeadText({ he: 'אביזרים', eng: 'Accessories' })
        setCover(
          'https://res.cloudinary.com/dnxi70mfs/image/upload/v1733237228/DSC06193_ifenm8.jpg'
        )
        break

      case '/item':
        setHeadText({ he: 'כל המוצרים', eng: 'All Items' })
        setCover(
          'https://res.cloudinary.com/dnxi70mfs/image/upload/v1732275016/DSC06192_1_ciikqh.jpg'
        )
        break

      default:
        break
    }

    // Only update filterBy if it's different
    if (JSON.stringify(filterBy) !== JSON.stringify(filterToSet)) {
      setFilterBy(filterToSet)
    }
  }, [searchParams, location.pathname]) // Runs when searchParams change

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
  }, [filterBy, location.pathname]) // Run when filterBy changes

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
        <Nav origin={origin} links={links} />
        <div className='cover-container'>
          <DynamicCover coverSrc={cover} prefs={prefs} />
        </div>
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

      <ContactUs />
    </main>
  )
}

export function CardIndex() {
  return <div className='card-index'></div>
}
export function AccessoriesIndex() {
  return <div className='accessories-index'></div>
}
