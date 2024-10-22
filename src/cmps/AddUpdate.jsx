import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { Button } from '@mui/material'
import { LoadingButton } from '@mui/lab'

export function AddUpdate() {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  return (
    <div
      className={
        prefs.isDarkMode ? 'input-container dark-mode' : 'input-container'
      }
    >
      <input
        type='text'
        name=''
        id=''
        placeholder={prefs.isEnglish ? 'Title' : 'כותרת'}
      />

      <textarea
        name=''
        id=''
        placeholder={prefs.isEnglish ? 'Content' : 'תוכן'}
        style={{ resize: 'none' }}
      />
      <LoadingButton variant='contained'>
        {prefs.isEnglish ? 'Send' : 'שליחה'}
      </LoadingButton>
    </div>
  )
}
