import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { Button } from '@mui/material'
import { LoadingButton } from '@mui/lab'

export function UpdateControl({ setDragEdit, isDragEdit }) {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)

  return (
    <div className='update-control-container'>
      {isDragEdit ? (
        <Button
          variant='contained'
          onClick={() => {
            setDragEdit(false)
          }}
        >
          {prefs.isEnglish ? 'Save' : 'שמירה'}
        </Button>
      ) : (
        <Button
          variant='contained'
          onClick={() => {
            setDragEdit(true)
          }}
        >
          {prefs.isEnglish ? 'Reorder' : 'שינוי סדר'}
        </Button>
      )}
    </div>
  )
}
