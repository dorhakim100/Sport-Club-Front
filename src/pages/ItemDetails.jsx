import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { loadItem } from '../store/actions/item.actions'

import { AddToCartButton } from '../cmps/AddToCartButton'
import { Quantity } from '../cmps/Quantity.jsx'
import { ItemNavigation } from '../cmps/ItemNavigation'
import { MemberTypes } from '../cmps/MemberTypes'
import { ItemOptions } from '../cmps/ItemOptions.jsx'

import { ContactUs } from '../cmps/ContactUs'
import { setIsModal, setModalMessage } from '../store/actions/system.actions'

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { CustomCarousel } from '../cmps/CustomCarousel.jsx'
import { Divider } from '@mui/material'

export function ItemDetails() {
  const { itemId } = useParams()
  const item = useSelector((storeState) => storeState.itemModule.item)
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const [quantity, setQuantity] = useState(1)

  const [lastPage, setLastPage] = useState('')

  const [isOptionSelected, setIsOptionSelected] = useState(false)
  const [selectedOption, setSelectedOption] = useState()

  const itemFilter = useSelector(
    (stateSelector) => stateSelector.itemModule.filter
  )

  const [imgs, setImgs] = useState([{ link: '' }])
  const types = [
    {
      index: 0,
      title: { he: 'מנוי קיץ', eng: 'Summer' },
      preview: { he: 'מאי עד אוקטובר', eng: `May to October` },
      class: 'summer',
    },
    {
      index: 1,
      title: { he: 'מנוי שנתי', eng: 'All Year' },
      preview: { he: 'כל השנה, במחיר הכי משתלם', eng: `All year, best price` },
      class: 'year',
    },
    {
      index: 2,
      title: { he: 'מנוי חורף', eng: 'Winter' },
      preview: { he: 'אוקטובר עד אפריל', eng: `October to April` },
      class: 'winter',
    },
  ]

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

    setLastPage(str)
    return str
  }

  const setItem = async () => {
    getLatestPage()
    const i = await loadItem(itemId, itemFilter)

    setImgs([...i.imgs])
    if (!i.options) setIsOptionSelected(true)
    if (i.types.includes('card')) {
      const messageToSet = {
        he: `משתלם יותר להיות מנוי!`,
        eng: `Members pay less!`,
        link: '/member',
        extra: <MemberTypes />,
      }
      setModalMessage(messageToSet)
      setIsModal(true)
    }
  }

  useEffect(() => {
    setItem()
  }, [itemId])

  const setItemOption = (option) => {
    option ? setIsOptionSelected(true) : setIsOptionSelected(false)
    option ? setSelectedOption(option) : setSelectedOption(null)
  }

  const modifyCards = (itemPreview) => {
    if (!item.types.includes('card'))
      return <p>{prefs.isEnglish ? itemPreview.eng : itemPreview.he}</p>
    let itemPreviewStr = prefs.isEnglish ? itemPreview.eng : itemPreview.he
    const bullets = itemPreviewStr.split('.')

    return bullets.map((bullet, index) => {
      if (index !== bullets.length - 1)
        return (
          <div className='bullet-container' key={`${index}Bullet`}>
            <CheckCircleOutlineIcon />
            <span>{bullet}</span>
          </div>
        )
    })
  }

  return (
    <>
      {item.prevNext && (
        <ItemNavigation
          item={item}
          type={'item'}
          lastPage={lastPage}
          isEdit={true}
        />
      )}
      <section className='item-details-container'>
        <div className='title-container'>
          <b>{prefs.isEnglish ? item.title.eng : item.title.he}</b>
          <div className='price-container'>
            <b>₪{item.price}</b>
            <Quantity
              quantity={quantity}
              setQuantity={setQuantity}
              item={item}
            />
          </div>
          {item.options && item.options.length > 0 && (
            <div className='options-section-container'>
              <b>{prefs.isEnglish ? 'Item options' : 'סוג פריט'}</b>
              <ItemOptions
                options={item.options}
                setItemOption={setItemOption}
              />
            </div>
          )}
          <AddToCartButton
            item={{ ...item }}
            quantity={quantity}
            isOptionSelected={isOptionSelected}
            selectedOption={selectedOption}
          />
        </div>
        <div className='img-container'>
          {/* <img src={item.cover} alt='' /> */}
          <CustomCarousel imgs={imgs} />
        </div>
        <Divider
          orientation='horizontal'
          flexItem
          sx={{
            backgroundColor: prefs.isDarkMode ? '#fff' : '',
            gridColumn: '1 / -1',
            marginTop: '1em',
          }}
        />
        <div className='preview-container'>{modifyCards(item.preview)}</div>
      </section>
      <ContactUs />
    </>
  )
}
