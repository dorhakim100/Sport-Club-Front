import React, { useRef } from 'react'
import { useSelector } from 'react-redux'

import { setIsPrefs } from '../store/actions/system.actions'

import SettingsIcon from '@mui/icons-material/Settings'
import TranslateIcon from '@mui/icons-material/Translate'

export function PrefsButton() {
  const isVisible = useSelector((storeState) => storeState.systemModule.isPrefs)
  const buttonRef = useRef()

  function spinButton() {
    buttonRef.current.style.transition = '0.2s'
  }
  return (
    <button
      className='prefs-button'
      ref={buttonRef}
      onClick={() => {
        // spinButton()
        setIsPrefs(!isVisible)
      }}
    >
      <TranslateIcon />
      <SettingsIcon className='settings-btn' />
    </button>
  )
}
