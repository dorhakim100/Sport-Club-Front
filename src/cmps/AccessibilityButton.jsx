import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { setIsAccessibility } from '../store/actions/system.actions'

import AccessibleIcon from '@mui/icons-material/Accessible'

export function AccessibilityButton() {
  const isVisible = useSelector(
    (storeState) => storeState.systemModule.isAccessibility
  )
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)

  return (
    <button
      className='accessibility-btn'
      onClick={() => setIsAccessibility(!isVisible)}
    >
      {/* {prefs.isEnglish ? 'Accessibility' : 'נגישות'} */}
      <AccessibleIcon />
    </button>
  )
}
