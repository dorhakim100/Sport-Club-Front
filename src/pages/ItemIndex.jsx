import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom'

import { loadItems, removeItem } from '../store/actions/item.actions'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { itemService } from '../services/item/item.service'

import { ItemList } from '../cmps/ItemList'
import { ItemFilter } from '../cmps/ItemFilter'
import { setIsLoading } from '../store/actions/system.actions'

import { HeadContainer } from '../cmps/HeadContainer'
import { DynamicCover } from '../cmps/DynamicCover'
import { ContactUs } from '../cmps/ContactUs'
import { Nav } from '../cmps/Nav'

import mainCover from '../../public/imgs/items-main.webp'
import cardsCover from '../../public/imgs/items-cards.webp'
import accessoriesCover from '../../public/imgs/items-accessories.webp'

import { setModalMessage, setIsModal } from '../store/actions/system.actions'

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
  const [cover, setCover] = useState(mainCover)

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
        setCover(cardsCover)
        setFilterBy(filterToSet)
        return
        break

      case '/item/accessories':
        filterToSet = { ...filterBy, sortDir, types: ['accessories'], pageIdx }
        setHeadText({ he: 'אביזרים', eng: 'Accessories' })
        setCover(accessoriesCover)
        setFilterBy(filterToSet)
        return
        break

      case '/item':
        filterToSet = { ...filterBy, sortDir, types: [], pageIdx }
        setHeadText({ he: 'כל המוצרים', eng: 'All Items' })
        setCover(mainCover)
        setFilterBy(filterToSet)
        return
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
        showErrorMsg(
          prefs.isEnglish ? `Error loading items` : 'טעינת מוצרים נכשלה'
        )
        // // console.log(err)
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

  useEffect(() => {
    const messageToSet = {
      he: `בימים הקרובים הזמנות דרך האתר יהיו פעילות`,
      eng: `In the following days orders from our site will be available`,
    }
    setModalMessage(messageToSet)
    setIsModal(true)
  }, []) // to remove once it's available

  return (
    <main className='item-index'>
      <header className='item-index-header'>
        <h2>{prefs.isEnglish ? 'Store' : 'חנות'}</h2>
        <div className='cover-container'>
          <DynamicCover coverSrc={cover} prefs={prefs} />
        </div>
        <Nav origin={origin} links={links} />
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
      </div>

      <ItemList items={items} onRemoveItem={onRemoveItem} isGrid={isGrid} />

      <ContactUs />
    </main>
  )
}
