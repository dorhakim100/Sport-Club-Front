import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { updateService } from '../services/update/update.service'
import { loadUpdates } from '../store/actions/update.actions'

import { HeadContainer } from '../cmps/HeadContainer'
import { AddUpdate } from '../cmps/AddUpdate.jsx'
import { UpdatesList } from '../cmps/UpdatesList.jsx'
import { UpdateControl } from '../cmps/UpdateControl.jsx'

import { Button } from '@mui/material'
import { LoadingButton } from '@mui/lab'

export function UpdateIndex() {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const updates = useSelector(
    (stateSelector) => stateSelector.updateModule.updates
  )

  const [isDragEdit, setDragEdit] = useState(false)

  useEffect(() => {
    setUpdates()
  }, [])

  const setUpdates = async () => {
    try {
      await loadUpdates({ isAll: true })
      console.log(updates)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className='update-index-container'>
      <HeadContainer
        text={{
          eng: 'Updates',
          he: 'עדכונים',
        }}
      />
      <div className='update-control-container'>
        <AddUpdate />
        <div>
          <UpdateControl setDragEdit={setDragEdit} isDragEdit={isDragEdit} />
          <UpdatesList updates={updates} isDragEdit={isDragEdit} />
        </div>
      </div>
    </div>
  )
}
