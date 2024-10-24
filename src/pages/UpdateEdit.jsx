import { useDispatch, useSelector } from 'react-redux'

import { Link, useParams, useNavigate } from 'react-router-dom'

import { useEffect, useState, useRef } from 'react'

import { updateService } from '../services/update/update.service'
import { setIsLoading } from '../store/actions/system.actions'
// import { loadUpdate } from '../store/actions/update.actions'
import { saveUpdate } from '../store/actions/update.actions'

import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'

import { Button } from '@mui/material'
import { LoadingButton } from '@mui/lab'

export function UpdateEdit() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  const isLoading = useSelector(
    (storeState) => storeState.systemModule.isLoading
  )

  const params = useParams()
  const navigate = useNavigate()

  const [update, setUpdate] = useState({})
  const [editUpdate, setEditUpdate] = useState({
    title: '',
    content: '',
    createdAt: Date.now(),
  })

  useEffect(() => {
    loadUpdate()
  }, [params.updateId])

  async function loadUpdate() {
    if (params.updateId === undefined) return
    try {
      setIsLoading(true)
      const update = await updateService.getById(params.updateId)

      setEditUpdate({ ...update })
      setUpdate({ ...update })
    } catch (err) {
      console.log(err)
      showErrorMsg('Cannot load update')
      navigate('/admin/update')
    } finally {
      setIsLoading(false)
    }
  }

  async function onSaveUpdate(ev) {
    ev.preventDefault()
    const { title, content } = editUpdate

    setIsLoading(true)
    try {
      const savedUpdate = await saveUpdate(editUpdate)
      showSuccessMsg('Item edited successfully')
    } catch (err) {
      console.log(err)
      showErrorMsg(`Item couldn't be edited`)
    } finally {
      setIsLoading(false)
    }
  }

  function handleChange({ target }) {
    const field = target.name
    let value = target.value

    console.log(field)
    console.log(value)

    setEditUpdate({ ...editUpdate, [field]: value })
  }

  return (
    <div className='update-edit-container'>
      <form action='' className='update-edit-form' onSubmit={onSaveUpdate}>
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
            value={editUpdate.title}
            style={{ width: 200 }}
          />
        </div>{' '}
        <div
          className={
            prefs.isDarkMode
              ? 'input-container content dark-mode'
              : 'input-container content'
          }
        >
          <textarea
            onChange={handleChange}
            name='content'
            type='text'
            value={editUpdate.content}
          />
        </div>
        <LoadingButton variant='contained' type='submit' loading={isLoading}>
          Submit
        </LoadingButton>
      </form>
    </div>
  )
}
