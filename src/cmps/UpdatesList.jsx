import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { updateService } from '../services/update/update.service'
import { userService } from '../services/user/user.service'
import { ItemPreview } from './ItemPreview'
import { useSelector } from 'react-redux'

import { setUpdateOrder } from '../store/actions/update.actions'

import { AddToCartButton } from './AddToCartButton'

import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import Divider from '@mui/material/Divider'

import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { loadUpdates } from '../store/actions/update.actions'

export function UpdatesList({ updates, isDragEdit }) {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const user = useSelector((stateSelector) => stateSelector.userModule.user)

  const [orderedUpdates, setOrderedUpdates] = useState(updates)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setOrderedUpdates(updates)
  }, [updates])

  useEffect(() => {
    console.log(position)
  }, [position])

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

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='updatesList' direction='vertical'>
        {(provided) => (
          <div
            className='updates-container'
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {orderedUpdates.map((update, index) =>
              isDragEdit ? (
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
                              ? new Date(update.createdAt).toLocaleString('eng')
                              : new Date(update.createdAt).toLocaleString('he')}
                          </span>
                        </div>
                        <p>{update.content}</p>
                        <AddToCartButton />
                      </div>
                    )
                  }}
                </Draggable>
              ) : (
                <div className='update-container' key={update._id}>
                  <div className='title-container'>
                    <b>{update.title}</b>
                    <span>
                      {prefs.isEnglish
                        ? new Date(update.createdAt).toLocaleString('eng')
                        : new Date(update.createdAt).toLocaleString('he')}
                    </span>
                  </div>
                  <p>{update.content}</p>
                  {user.isAdmin && (
                    <ButtonGroup
                      variant='contained'
                      aria-label='Basic button group'
                      style={{ direction: 'ltr' }}
                    >
                      <Button
                        onClick={() => {
                          window.scrollTo({ top: 0, behavior: 'smooth' })
                          navigate(`/update/edit/${update._id}`)
                        }}
                      >
                        {prefs.isEnglish ? 'Edit' : 'עריכה'}
                      </Button>
                      <Button onClick={() => onRemoveItem(update._id)}>
                        {prefs.isEnglish ? 'Remove' : 'הסרה'}
                      </Button>
                    </ButtonGroup>
                  )}
                </div>
              )
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
