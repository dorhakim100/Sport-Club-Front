import { useDispatch, useSelector } from 'react-redux'

import { Link, useParams, useNavigate } from 'react-router-dom'

import { useEffect, useState, useRef } from 'react'
import { Button, containerClasses } from '@mui/material'
import { IconButton } from '@mui/material'
import TextField from '@mui/material/TextField'
import { Checkbox, Input } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { styled } from '@mui/material/styles'
import LoadingButton from '@mui/lab/LoadingButton'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

import { itemService } from '../services/item/item.service.js'
import { updateItem } from '../store/actions/item.actions.js'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { uploadService } from '../services/upload.service.js'
import { makeId, getWindowDimensions } from '../services/util.service.js'
import {
  setIsLoading,
  setIsModal,
  setModalMessage,
} from '../store/actions/system.actions.js'

import { HeadContainer } from '../cmps/HeadContainer.jsx'

import InputAdornment from '@mui/material/InputAdornment'
import AccountCircle from '@mui/icons-material/AccountCircle'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

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
  const [imgs, setImgs] = useState([])

  const [isOptions, setIsOptions] = useState(false)
  const [options, setOptions] = useState([])
  const [dragging, setDragging] = useState(false)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  )
  const text = {
    he: 'עריכת מוצר',
    eng: 'Item Edit',
  }

  useEffect(() => {
    loadItem()
  }, [params.itemId])

  async function loadItem() {
    if (params.itemId === undefined) return
    try {
      setIsLoading(true)
      const item = await itemService.getById(params.itemId)

      setEditItem({ ...item })
      setItem({ ...item })
      if (item.options) {
        setIsOptions(true)
        setOptions(item.options)
      }
      // setCover(item.imgs[0])
      setImgs(item.imgs)
    } catch (err) {
      // // console.log(err)
      showErrorMsg('Cannot load item')
      navigate('/item')
    } finally {
      setIsLoading(false)
    }
  }

  function handleChange({ target }) {
    const field = target.name
    let value = target.value
    let checkedButton = target.id

    const types = editItem.types
    let newTypes = []

    const key = prefs.isEnglish ? 'eng' : 'he'

    switch (target.type) {
      case 'number':
      case 'range':
        value = +value || ''
        break

      case 'checkbox':
        if (field === 'types') {
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
        setEditItem({
          ...editItem,
          [field]: {
            ...editItem[field],
            [key]: value,
          },
        })

        return
      case 'textarea':
        setEditItem({
          ...editItem,
          [field]: {
            ...editItem[field],
            [key]: value,
          },
        })

        return
      default:
        break
    }

    setEditItem({ ...editItem, [field]: value })
  }

  async function onSaveItem(ev) {
    ev.preventDefault()
    if (
      isOptions &&
      options.find((option) => !option.title.he || !option.title.eng)
    ) {
      const messageToSet = {
        he: 'יש להוסיף סוג פריט גם בעברית וגם באנגלית',
        eng: `Item option must be added in both Hebrew and English`,
      }
      setModalMessage(messageToSet)
      setIsModal(true)
      return
    }
    const { name, price, types } = editItem

    setIsLoading(true)
    try {
      let savedItem

      if (isOptions) {
        savedItem = await updateItem({ ...editItem, options })
      } else {
        savedItem = await updateItem({ ...editItem, options: [] })
      }

      showSuccessMsg(
        prefs.isEnglish ? 'Item edited successfully' : 'מוצר נערך בהצלחה'
      )
    } catch (err) {
      // // console.log(err)
      showErrorMsg(prefs.isEnglish ? `Item couldn't be edited` : 'מוצר לא נערך')
    } finally {
      setIsLoading(false)
    }
  }

  async function uploadFile(ev) {
    setIsLoading(true)
    try {
      const res = await uploadService.uploadImg(ev)

      const coverSrc = res.url
      // setCover(coverSrc)
      setImgs([...imgs, coverSrc])
      setEditItem({ ...editItem, imgs: [...imgs, coverSrc] })
      showSuccessMsg(
        prefs.isEnglish ? 'Img added successfully' : 'תמונה נוספה בהצלחה'
      )
    } catch (err) {
      // // console.log(err)
      showErrorMsg(`Couldn't upload image`)
    } finally {
      setIsLoading(false)
    }
  }

  const setOptionValue = (optionId, value) => {
    const idxToSet = options.findIndex((option) => option.id === optionId)
    let optionToSet
    let key
    prefs.isEnglish ? (key = 'eng') : (key = 'he')

    optionToSet = {
      ...options[idxToSet],
      title: { ...options[idxToSet].title, [key]: value },
    }

    options.splice(idxToSet, 1, optionToSet)
    setOptions([...options])
  }

  const _getEmptyOption = () => {
    return { title: { he: '', eng: '' }, id: makeId() }
  }

  const onAddOption = () => {
    setOptions((prev) => [...prev, _getEmptyOption()])
  }

  const onRemoveOption = (optionId) => {
    const newOptions = options.filter((option) => option.id !== optionId)

    setOptions(newOptions)
    if (!newOptions.length) setIsOptions(false)
  }

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions())
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [windowDimensions])

  const onDragEnd = async (result) => {
    const { source, destination } = result

    if (!destination) return // If dropped outside the list, ignore

    if (source.index !== destination.index) {
      const reorderedImgs = Array.from(imgs)
      const [removed] = reorderedImgs.splice(source.index, 1)

      reorderedImgs.splice(destination.index, 0, removed)
      setImgs([...reorderedImgs])
      setEditItem({ ...item, imgs: [...reorderedImgs] })
    }
  }

  const handleDragStart = (e) => {
    const rect = e.target.getBoundingClientRect()
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
    setDragging(true)
  }

  const handleDrag = (e) => {
    if (!isDragEdit) return

    if (dragging) {
      setPosition({
        x: e.clientX - offset.x + window.scrollX, // Adjust for horizontal scroll
        y: e.clientY - offset.y + window.scrollY, // Adjust for vertical scroll
      })
    }
  }

  return (
    <>
      <HeadContainer text={text} />
      <section className='item-edit-container'>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable
            droppableId={`${item._id}-imgs`}
            direction={
              windowDimensions.width <= 1000 ? 'vertical' : 'horizontal'
            }
          >
            {(provided) => {
              return (
                <div
                  className={'upload-img-container'}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{
                    // display: 'flex',
                    direction: 'ltr',
                    // flexDirection: 'row-reverse',
                    // overflowX: 'auto',
                  }}
                >
                  {imgs.map((img, index) => {
                    return (
                      <Draggable
                        key={`${item.title.eng}-img-${index}`}
                        draggableId={`${item._id}-imgs-${index}`}
                        index={index}
                      >
                        {(provided, snapshot) => {
                          if (snapshot.isDragging) {
                            const offset = { x: 0, y: window.scrollY } // your fixed container left/top position
                            const x =
                              provided.draggableProps.style.left - offset.x
                            const y =
                              provided.draggableProps.style.top + offset.y
                            provided.draggableProps.style.left = x
                            provided.draggableProps.style.top = y
                          }
                          return (
                            <div
                              className={`item-img-container ${
                                snapshot.isDragging ? 'dragged' : ''
                              }`}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onDragStart={() => handleDragStart()}
                              onDrag={handleDrag}
                            >
                              {/* <div className='img-overlay'></div> */}
                              <IconButton
                                className='delete-icon'
                                onClick={() => {
                                  imgs.splice(index, 1)
                                  const newImges = [...imgs]
                                  setImgs(newImges)
                                  setEditItem({ ...editItem, imgs: newImges })
                                  showSuccessMsg(
                                    prefs.isEnglish
                                      ? 'Img removed successfully'
                                      : 'תמונה הוסרה בהצלחה'
                                  )
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                              <img
                                src={img}
                                alt=''
                                className='item-cover-edit'
                              />
                            </div>
                          )
                        }}
                      </Draggable>
                    )
                  })}

                  {/* <div className='item-img-container'>
            {cover && <img src={cover} alt='' className='item-cover-edit' />}
          </div> */}
                </div>
              )
            }}
          </Droppable>
        </DragDropContext>
        <LoadingButton
          component='label'
          role={undefined}
          variant='contained'
          tabIndex={-1}
          startIcon={
            <CloudUploadIcon sx={prefs.isEnglish ? { ml: 1 } : { ml: 2 }} />
          }
          loading={isLoading}
          sx={prefs.isEnglish ? { direction: 'ltr' } : { direction: 'rtl' }}
        >
          {prefs.isEnglish ? 'Upload file' : 'בחירת קובץ'}

          <VisuallyHiddenInput type='file' onChange={uploadFile} />
        </LoadingButton>
        <form action='' className='item-edit-form' onSubmit={onSaveItem}>
          <div
            className={
              prefs.isDarkMode
                ? 'input-container title dark-mode'
                : 'input-container title'
            }
          >
            <label htmlFor='' style={{ backgroundColor: 'transparent' }}>
              {prefs.isEnglish ? 'Title:' : 'כותרת:'}
            </label>
            <input
              onChange={handleChange}
              name='title'
              type='text'
              value={prefs.isEnglish ? editItem.title.eng : editItem.title.he}
              // style={{ width: 200 }}
            />
          </div>{' '}
          <div
            className={
              prefs.isDarkMode
                ? 'input-container price dark-mode'
                : 'input-container price'
            }
          >
            <label htmlFor='' style={{ backgroundColor: 'transparent' }}>
              {prefs.isEnglish ? 'Item Price:' : 'מחיר:'}
            </label>
            <input
              className='price'
              name='price'
              onChange={handleChange}
              type='number'
              value={editItem.price}
            />
            {/* <span>₪</span> */}
          </div>
          <div
            className={
              prefs.isDarkMode
                ? 'input-container preview dark-mode'
                : 'input-container preview'
            }
          >
            <textarea
              onChange={handleChange}
              name='preview'
              type='text'
              value={
                prefs.isEnglish ? editItem.preview.eng : editItem.preview.he
              }
            />
          </div>
          <div className='is-options-container'>
            <Checkbox
              id='options'
              checked={isOptions}
              onChange={({ target }) => {
                setOptions([_getEmptyOption()])
                setIsOptions(target.checked)
              }}
              sx={
                prefs.isDarkMode
                  ? {
                      color: 'lightblue', // base color for dark mode
                      '&.Mui-checked': {
                        color: 'lightblue', // color when checked
                      },
                      '&:hover': {
                        backgroundColor: 'rgba(173, 216, 230, 0.1)', // subtle light blue hover effect
                      },
                    }
                  : {}
              }
            />
            <label htmlFor='options'>
              {prefs.isEnglish ? 'Item type' : 'סוג פריט'}
            </label>
          </div>
          {isOptions && (
            <div className='add-option-container'>
              {options.map((option) => {
                return (
                  <div className='option-container' key={option.id}>
                    <TextField
                      onChange={({ target }) =>
                        setOptionValue(option.id, target.value)
                      }
                      label={prefs.isEnglish ? 'Option' : 'סוג'}
                      variant='outlined'
                      InputLabelProps={{
                        sx: prefs.isEnglish
                          ? {}
                          : {
                              right: 25, // Position the label at the right edge
                              left: 'auto', // Disable left positioning
                              '&.MuiInputLabel-shrink': {
                                transformOrigin: 'top right',
                                right: 30, // Position the label at the right edge
                                left: 'auto', // Disable left positioning
                              },
                            },
                      }}
                      InputProps={{
                        inputProps: {
                          dir: prefs.isEnglish ? 'ltr' : 'rtl', // Keep the input text direction RTL
                        },
                      }}
                      sx={
                        prefs.isDarkMode
                          ? {
                              '& .MuiOutlinedInput-root': {
                                color: 'white',
                                '& fieldset': {
                                  borderColor: 'lightblue',
                                },
                                '&:hover fieldset': {
                                  borderColor: 'lightblue',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: 'lightblue',
                                },
                                // Adjust the legend (notched outline) for RTL
                                '& legend': !prefs.isEnglish
                                  ? {
                                      textAlign: 'right',
                                      direction: 'rtl',
                                      transformOrigin: 'top right',
                                    }
                                  : {},
                              },
                              '& .MuiInputLabel-root': {
                                color: 'lightblue',
                                '&.Mui-focused': {
                                  color: 'lightblue',
                                },
                              },
                            }
                          : {
                              '& legend': !prefs.isEnglish
                                ? {
                                    textAlign: 'right',
                                    direction: 'rtl',
                                    transformOrigin: 'top right',
                                  }
                                : {},
                            }
                      }
                      value={
                        prefs.isEnglish
                          ? options.find(
                              (optionToFind) => optionToFind.id === option.id
                            ).title.eng
                          : options.find(
                              (optionToFind) => optionToFind.id === option.id
                            ).title.he
                      }
                    />
                    <IconButton
                      aria-label='delete'
                      onClick={() => onRemoveOption(option.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                )
              })}

              <Button variant='contained' onClick={onAddOption}>
                {prefs.isEnglish ? 'Add' : 'הוסף'}
              </Button>
            </div>
          )}
          {(typeof editItem.stockQuantity === 'number' && (
            <div className='input-container quantity'>
              <label htmlFor=''>
                {prefs.isEnglish ? 'Quantity:' : 'כמות:'}
              </label>
              <div className='quantity-container'>
                <input
                  value={editItem.stockQuantity}
                  onChange={handleChange}
                  type='number'
                  name={'stockQuantity'}
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
          <div className='input-container types'>
            <label htmlFor=''>{prefs.isEnglish ? 'Types:' : 'סוג:'}</label>
            <div className='types-container'>
              {types.map((type) => {
                return (
                  <div
                    className={
                      prefs.isDarkMode
                        ? 'checkbox-container dark-mode'
                        : 'checkbox-container'
                    }
                    key={makeId()}
                  >
                    <label htmlFor={type}>
                      {prefs.isEnglish
                        ? type === 'card'
                          ? 'Card'
                          : 'Accessories'
                        : type === 'card'
                        ? 'כרטיסיה'
                        : 'ציוד נלווה'}
                    </label>

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
      </section>{' '}
    </>
  )
}
