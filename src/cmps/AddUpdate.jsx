import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { saveUpdate } from '../store/actions/update.actions'

import { setIsLoading } from '../store/actions/system.actions'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'

import { Button } from '@mui/material'
import { LoadingButton } from '@mui/lab'

export function AddUpdate({ setUpdates }) {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)

  const isLoading = useSelector(
    (storeState) => storeState.systemModule.isLoading
  )

  const navigate = useNavigate()

  const [update, setUpdate] = useState({})
  const [editUpdate, setEditUpdate] = useState({
    title: '',
    content: '',
    createdAt: Date.now(),
  })

  async function onSaveUpdate() {
    // ev.preventDefault()
    const { title, content } = editUpdate

    setIsLoading(true)
    try {
      const savedUpdate = await saveUpdate(editUpdate)
      showSuccessMsg('Item edited successfully')
      await setUpdates()
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

    setEditUpdate({ ...editUpdate, [field]: value })
  }

  return (
    <div
      className={
        prefs.isDarkMode ? 'input-container dark-mode' : 'input-container'
      }
    >
      <input
        type='text'
        name='title'
        id=''
        placeholder={prefs.isEnglish ? 'Title' : 'כותרת'}
        value={editUpdate.title}
        onChange={handleChange}
      />

      <textarea
        name='content'
        id=''
        placeholder={prefs.isEnglish ? 'Content' : 'תוכן'}
        style={{ resize: 'none' }}
        value={editUpdate.content}
        onChange={handleChange}
      />
      <LoadingButton variant='contained' onClick={onSaveUpdate}>
        {prefs.isEnglish ? 'Send' : 'שליחה'}
      </LoadingButton>
    </div>
  )
}
