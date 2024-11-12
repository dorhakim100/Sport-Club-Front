import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { setPrefs } from '../store/actions/system.actions'
import { setIsPrefs } from '../store/actions/system.actions'

import CloseIcon from '@mui/icons-material/Close'
import LanguageIcon from '@mui/icons-material/Language'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'

export function Prefs({ bodyRef }) {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  const isVisible = useSelector((storeState) => storeState.systemModule.isPrefs)

  const [darkMode, setDarkMode] = useState(prefs.isDarkMode)

  useEffect(() => {
    if (darkMode) {
      bodyRef.current.style.backgroundColor = `#2C3E50`
      bodyRef.current.style.color = `#F5F5F5`
      bodyRef.current.style.transition = `background-color 0.3s ease, color 0.3s ease`
      console.log(bodyRef)
    } else {
      bodyRef.current.style.backgroundColor = `#F5F5F5`
      bodyRef.current.style.color = `#2C3E50`
      bodyRef.current.style.transition = `background-color 0.3s ease, color 0.3s ease`
    }
  }, [darkMode])

  function onSetPrefs(type) {
    let newPrefs
    switch (type) {
      case 'lang':
        const newLang = !prefs.isEnglish
        newPrefs = { ...prefs, isEnglish: newLang }
        setPrefs(newPrefs)
        setIsPrefs(false)
        return

      case 'darkMode':
        const newMode = !prefs.isDarkMode
        newPrefs = { ...prefs, isDarkMode: newMode }
        setDarkMode(newMode)
        setPrefs(newPrefs)
        setIsPrefs(false)
        return

      default:
        break
    }
  }

  return (
    <div className={`prefs-panel ${isVisible ? 'visible' : ''}`}>
      <div className='close-container' onClick={() => setIsPrefs(false)}>
        <CloseIcon />
      </div>
      <div className='prefs-control'>
        <button onClick={() => onSetPrefs('lang')}>
          {prefs.isEnglish ? 'Hebrew' : 'אנגלית'}
          <LanguageIcon />
        </button>
        <button onClick={() => onSetPrefs('darkMode')}>
          {prefs.isDarkMode
            ? prefs.isEnglish
              ? 'Light mode'
              : 'מסך בהיר'
            : prefs.isEnglish
            ? 'Dark mode'
            : 'מסך כהה'}
          {prefs.isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}{' '}
        </button>
      </div>
    </div>
  )
}
