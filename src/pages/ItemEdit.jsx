import { useDispatch, useSelector } from 'react-redux'

import { Link, useParams, useNavigate } from 'react-router-dom'

import { useEffect, useState, useRef } from 'react'
import { Button } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { styled } from '@mui/material/styles'
import LoadingButton from '@mui/lab/LoadingButton'

import { itemService } from '../services/item/item.service.js'
import { updateItem } from '../store/actions/item.actions.js'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { uploadService } from '../services/upload.service.js'
import { makeId } from '../services/util.service.js'
import { setIsLoading } from '../store/actions/system.actions.js'

// import '../css/ItemEdit.css'
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
})

export function ItemEdit() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  const isLoading = useSelector(
    (storeState) => storeState.systemModule.isLoading
  )

  const types = ['card', 'accessories']

  const params = useParams()
  const navigate = useNavigate()

  const [item, setItem] = useState({ types: [] })
  const [editItem, setEditItem] = useState(itemService.getEmptyItem())
  const [cover, setCover] = useState(null)
  // const coverRef = useRef(cover)

  useEffect(() => {
    loadItem()
  }, [params.itemId])

  async function loadItem() {
    if (params.itemId === undefined) return
    try {
      const item = await itemService.getById(params.itemId)

      setEditItem({ ...item })
      setItem({ ...item })
      setCover(item.cover)
      console.log(item)
    } catch (err) {
      console.log(err)
      showErrorMsg('Cannot load item')
      navigate('/item')
    }
  }

  function handleChange({ target }) {
    const field = target.name
    let value = target.value
    let checkedButton = target.id

    const types = editItem.types
    let newTypes = []

    switch (target.type) {
      case 'number':
      case 'range':
        value = +value || ''
        break

      case 'checkbox':
        if (field === 'types') {
          console.log(editItem.types)
          if (types.includes(checkedButton)) {
            const idx = editItem.types.findIndex(
              (company) => company === checkedButton
            )
            editItem.types.splice(idx, 1)
            newTypes = [...editItem.types]
          } else {
            newTypes = editItem.types.push(checkedButton)
          }
          setEditItem({ ...editItem })
        }

        return
        break
      case 'text':
        if (prefs.isEnglish) {
          if (field === 'title') {
            const title = { ...editItem.title, eng: value }
            setEditItem({ ...editItem, title })
          } else if (field === 'preview') {
            const preview = { ...editItem.title, eng: value }
            setEditItem({ ...editItem, preview })
          }
        } else {
          if (field === 'title') {
            const title = { ...editItem.title, he: value }
            setEditItem({ ...editItem, title })
          } else if (field === 'preview') {
            const preview = { ...editItem.title, he: value }
            setEditItem({ ...editItem, preview })
          }
        }
        return
      default:
        break
    }

    setEditItem({ ...editItem, [field]: value })
  }

  async function onSaveItem(ev) {
    ev.preventDefault()
    const { name, price, types } = editItem

    // if (!cover) {
    //   editItem.cover =
    //     'https://vglist.co/packs/media/images/no-cover-369ad8f0ea82dde5923c942ba1a26482.png'
    // } else {
    //   editItem.cover = cover
    // }
    // todoService.save(todoToEdit)
    setIsLoading(true)
    try {
      const savedItem = await updateItem(editItem)
      showSuccessMsg('Item edited successfully')
    } catch (err) {
      console.log(err)
      showErrorMsg(`Item couldn't be edited`)
    } finally {
      setIsLoading(false)
    }
  }

  function renderCover({ target }) {
    const coverSrc = target.value
    setCover(coverSrc)
  }

  async function uploadFile(ev) {
    setIsLoading(true)
    try {
      const res = await uploadService.uploadImg(ev)
      console.log(res)
      console.log(res.url)
      const coverSrc = res.url
      setCover(coverSrc)
      setEditItem({ ...editItem, cover: coverSrc })
    } catch (err) {
      console.log(err)
      showErrorMsg(`Couldn't upload image`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className='item-edit-container'>
      <div className='cover-container'>
        {cover && <img src={cover} alt='' className='item-cover-edit' />}
      </div>
      <LoadingButton
        component='label'
        role={undefined}
        variant='contained'
        tabIndex={-1}
        startIcon={<CloudUploadIcon sx={{ ml: 1 }} />}
        loading={isLoading}
      >
        Upload file
        <VisuallyHiddenInput type='file' onChange={uploadFile} />
      </LoadingButton>
      <form action='' className='item-edit-form' onSubmit={onSaveItem}>
        <div className='input-container'>
          <label htmlFor=''>{prefs.isEnglish ? 'Title:' : 'כותרת:'}</label>
          <input
            onChange={handleChange}
            name='title'
            type='text'
            value={prefs.isEnglish ? editItem.title.eng : editItem.title.he}
            style={{ width: 200 }}
          />
        </div>{' '}
        <div className='input-container price'>
          <label htmlFor=''>{prefs.isEnglish ? 'Item Price:' : 'מחיר:'}</label>
          <input
            className='price'
            name='price'
            onChange={handleChange}
            type='number'
            value={editItem.price}
          />
          {/* <span>₪</span> */}
        </div>
        <div className='input-container preview'>
          <label htmlFor=''>{prefs.isEnglish ? 'Preview:' : 'תיאור:'}</label>
          <textarea
            onChange={handleChange}
            name='preview'
            type='text'
            value={prefs.isEnglish ? editItem.preview.eng : editItem.preview.he}
            style={{ width: 350, height: 200 }}
          />
        </div>
        {(typeof editItem.stockQuantity === 'number' && (
          <div className='input-container quantity'>
            <label htmlFor=''>{prefs.isEnglish ? 'Quantity:' : 'כמות:'}</label>
            <div className='quantity-container'>
              <input
                value={editItem.stockQuantity}
                onChange={handleChange}
                type='number'
                name={'quantity'}
              />
              <Button
                variant='contained'
                onClick={() => {
                  setEditItem({ ...editItem, stockQuantity: true })
                }}
              >
                {prefs.isEnglish ? 'Remove quantity' : 'הסר כמות'}
              </Button>
            </div>
          </div>
        )) || (
          <Button
            variant='contained'
            onClick={() => {
              setEditItem({ ...editItem, stockQuantity: 0 })
            }}
          >
            {prefs.isEnglish ? 'Add quantity' : 'הוסף כמות'}
          </Button>
        )}
        <div className='input-container'>
          <label htmlFor=''>{prefs.isEnglish ? 'Types:' : 'סוג:'}</label>
          <div className='types-container'>
            {types.map((type) => {
              return (
                <div className='checkbox-container' key={makeId()}>
                  <label htmlFor={type}>{type}</label>
                  <input
                    onChange={handleChange}
                    type='checkbox'
                    checked={editItem.types.includes(type)}
                    name='types'
                    id={type}
                  />
                </div>
              )
            })}
          </div>
        </div>
        <LoadingButton variant='contained' type='submit' loading={isLoading}>
          Submit
        </LoadingButton>
      </form>
    </section>
  )
}
