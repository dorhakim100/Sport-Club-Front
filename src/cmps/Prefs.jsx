import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { setIsAccessibility, setPrefs } from '../store/actions/system.actions'
import { setIsPrefs } from '../store/actions/system.actions'

import { DarkModeSwitch } from './DarkModeSwitch'

import CloseIcon from '@mui/icons-material/Close'
import LanguageIcon from '@mui/icons-material/Language'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import { LanguageSwitch } from './LanguageSwitch'

export function Prefs({ bodyRef }) {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  const isVisible = useSelector((storeState) => storeState.systemModule.isPrefs)

  const [darkMode, setDarkMode] = useState(prefs.isDarkMode)

  useEffect(() => {
    if (darkMode) {
      bodyRef.current.style.backgroundColor = `#2C3E50`
      bodyRef.current.style.color = `#F5F5F5`
      bodyRef.current.style.transition = `background-color 0.3s ease, color 0.3s ease`
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
        closePrefsModal()
        return

      case 'darkMode':
        const newMode = !prefs.isDarkMode
        newPrefs = { ...prefs, isDarkMode: newMode }
        setDarkMode(newMode)
        setPrefs(newPrefs)
        closePrefsModal()
        return

      default:
        break
    }
  }

  const closePrefsModal = () => setIsPrefs(false)

  const closeModals = () => {
    setIsPrefs(false)
    setIsAccessibility(false)
  }

  return (
    <>
      {isVisible && <div className='overlay' onClick={closeModals}></div>}
      <div
        className={`prefs-panel ${isVisible ? 'visible' : ''}`}
        // onMouseLeave={closePrefsModal}
      >
        <div className='close-container' onClick={closePrefsModal}>
          <CloseIcon />
        </div>
        <div className='prefs-control'>
          {/* <LanguageSwitch
          onClick={() => onSetPrefs('lang')}
          checked={!prefs.isEnglish}
          />
          <DarkModeSwitch
          onClick={() => onSetPrefs('darkMode')}
          checked={prefs.isDarkMode}
        /> */}
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
    </>
  )
}
