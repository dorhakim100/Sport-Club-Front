import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { updateService } from '../services/update/update.service'
import { userService } from '../services/user/user.service'
import { ItemPreview } from './ItemPreview'
import { useSelector } from 'react-redux'

import { smoothScroll } from '../services/util.service'

import { saveUpdate, setUpdateOrder } from '../store/actions/update.actions'
import { loadUpdates, removeUpdate } from '../store/actions/update.actions'

import { AddToCartButton } from './AddToCartButton'

import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import Divider from '@mui/material/Divider'
import Switch from '@mui/material/Switch'

import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { setIsLoading } from '../store/actions/system.actions'

export function UpdatesList({ updates, isDragEdit, loadUpdates }) {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const user = useSelector((stateSelector) => stateSelector.userModule.user)
  const navigate = useNavigate()

  const [orderedUpdates, setOrderedUpdates] = useState(updates)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  const [selectedId, setSelectedId] = useState(null)

  useEffect(() => {
    setOrderedUpdates(updates)
    const checkedUpdate = updates.find((updateToFind) => updateToFind.isMessage)
    if (checkedUpdate) setSelectedId(checkedUpdate._id)
  }, [updates])

  const onDragEnd = async (result) => {
    if (!isDragEdit) return
    const { source, destination } = result

    if (!destination) return // If dropped outside the list, ignore

    if (source.index !== destination.index) {
      const reorderedUpdates = Array.from(orderedUpdates)
      const [removed] = reorderedUpdates.splice(source.index, 1)
      const time = Date.now()
      const updated = { ...removed, createdAt: time }

      reorderedUpdates.splice(destination.index, 0, updated)
      // Update your state here to reflect the new order
      // updateService.saveUpdatesOrder(reorderedUpdates)
      const reorderedIds = reorderedUpdates.map((update) => update._id)
      setOrderedUpdates(reorderedUpdates)
      setUpdateOrder(reorderedUpdates)
      // loadUpdates()
    }
  }

  const handleDragStart = (e) => {
    if (!isDragEdit) return

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

  const onSetUpdateMessage = async (updateId) => {
    const originalUpdate = updates.find((update) => update._id === updateId)
    try {
      setIsLoading(true)
      if (selectedId !== updateId) {
        setSelectedId(updateId)

        await saveUpdate({
          ...originalUpdate,
          isMessage: true,
          isOnlyMessage: true,
        })
      } else {
        setSelectedId(null)
        await saveUpdate({
          ...originalUpdate,
          isMessage: false,
          isOnlyMessage: true,
        })
      }
    } catch (err) {
      showErrorMsg(
        prefs.isEnglish ? `Couldn't set message` : 'לא היה ניתן להגדיר הודעה'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='updatesList' direction='vertical'>
        {(provided) => {
          return (
            <div
              className='updates-container'
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {orderedUpdates.map((update, index) => {
                const label = {
                  inputProps: { 'aria-label': update._id, id: update._id },
                }

                return isDragEdit ? (
                  <Draggable
                    key={update._id}
                    draggableId={update._id}
                    index={index}
                  >
                    {(provided, snapshot) => {
                      if (snapshot.isDragging) {
                        const offset = { x: 0, y: window.scrollY } // your fixed container left/top position
                        const x = provided.draggableProps.style.left - offset.x
                        const y = provided.draggableProps.style.top + offset.y
                        provided.draggableProps.style.left = x
                        provided.draggableProps.style.top = y
                      }

                      return (
                        <div
                          className={
                            snapshot.isDragging
                              ? 'update-container draggable dragging'
                              : 'update-container draggable'
                          }
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onDragStart={() => handleDragStart()}
                          onDrag={handleDrag}
                        >
                          <div className='title-container'>
                            <b>{update.title}</b>
                            <span>
                              {prefs.isEnglish
                                ? new Date(update.createdAt).toLocaleDateString(
                                    'eng'
                                  )
                                : new Date(update.createdAt).toLocaleDateString(
                                    'he'
                                  )}
                            </span>
                          </div>
                          <p>{update.content}</p>
                          {/* {user && user.isAdmin && (
                            <EditRemoveBtns update={update} />
                          )} */}
                        </div>
                      )
                    }}
                  </Draggable>
                ) : (
                  <div
                    className={`update-container ${
                      selectedId === update._id
                        ? `message-update ${
                            prefs.isDarkMode ? 'dark-mode' : ''
                          }`
                        : ''
                    }`}
                    key={update._id}
                  >
                    {' '}
                    <div className='title-container'>
                      <b>{update.title}</b>
                      <span>
                        {prefs.isEnglish
                          ? new Date(update.createdAt).toLocaleDateString('eng')
                          : new Date(update.createdAt).toLocaleDateString('he')}
                      </span>
                    </div>
                    <p>{update.content}</p>
                    {user && user.isAdmin && (
                      <div className='admin-control-container'>
                        <Switch
                          {...label}
                          checked={selectedId === update._id}
                          // onChange={() => onSetUpdateMessage(update._id)}
                          onClick={() => onSetUpdateMessage(update._id)}
                          color={prefs.isDarkMode ? 'secondary' : 'primary'}
                        />
                        <EditRemoveBtns update={update} />
                      </div>
                    )}
                  </div>
                )
              })}
              {provided.placeholder}
            </div>
          )
        }}
      </Droppable>
    </DragDropContext>
  )
}

function EditRemoveBtns({ update }) {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const navigate = useNavigate()

  async function onRemoveUpdate(updateId) {
    try {
      await removeUpdate(updateId)
      showSuccessMsg(prefs.isEnglish ? 'Update removed' : 'עדכון הוסר')
      await loadUpdates()
    } catch (err) {
      // // console.log(err)
      showErrorMsg(prefs.isEnglish ? `Couldn't remove` : 'עדכון לא הוסר')
    }
  }

  return (
    <ButtonGroup
      variant='contained'
      aria-label='Basic button group'
      style={{ direction: 'ltr' }}
    >
      <Button
        onClick={() => {
          smoothScroll()
          navigate(`/update/edit/${update._id}`)
        }}
      >
        {prefs.isEnglish ? 'Edit' : 'עריכה'}
      </Button>
      <Button onClick={() => onRemoveUpdate(update._id)}>
        {prefs.isEnglish ? 'Remove' : 'הסרה'}
      </Button>
    </ButtonGroup>
  )
}
