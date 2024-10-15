import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { setIsAccessibility } from '../store/actions/system.actions'

import TextIncreaseIcon from '@mui/icons-material/TextIncrease'
import TextDecreaseIcon from '@mui/icons-material/TextDecrease'
import FilterBAndWIcon from '@mui/icons-material/FilterBAndW'
import ContrastIcon from '@mui/icons-material/Contrast'
import VisibilityIcon from '@mui/icons-material/Visibility'
import LightModeIcon from '@mui/icons-material/LightMode'
import LinkIcon from '@mui/icons-material/Link'
import SpellcheckIcon from '@mui/icons-material/Spellcheck'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import CloseIcon from '@mui/icons-material/Close'

export function Accessibility({ bodyRef }) {
  const isVisible = useSelector(
    (storeState) => storeState.systemModule.isAccessibility
  )
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  console.log(isVisible)
  const [textSize, setTextSize] = useState(16)
  const [grayScale, setGrayScale] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [reverseContrast, setReverseContrast] = useState(false)
  const [whiteBackground, setWhiteBackground] = useState(false)
  const [underlineLinks, setUnderlineLinks] = useState(false)
  const [readableFont, setReadableFont] = useState(false)

  const increaseTextSize = () => {
    setTextSize((prev) => Math.min(prev + 2, 24)) // Max size limit
  }

  const decreaseTextSize = () => {
    setTextSize((prev) => Math.max(prev - 2, 12)) // Min size limit
  }

  const resetStyles = () => {
    setTextSize(16)
    setGrayScale(false)
    setHighContrast(false)
    setReverseContrast(false)
    setWhiteBackground(false)
    setUnderlineLinks(false)
    setReadableFont(false)
  }

  useEffect(() => {
    bodyRef.current.style.fontSize = `${textSize}px`
    bodyRef.current.style.filter = `
    ${grayScale ? 'grayscale(100%)' : 'grayscale(0%)'}
    ${highContrast ? 'contrast(200%)' : 'contrast(100%)'}
    ${reverseContrast ? 'invert(100%)' : ''}
  `
    bodyRef.current.style.backgroundColor = whiteBackground ? 'white' : ''
    bodyRef.current.style.fontFamily = readableFont ? "'Arial', sans-serif" : ''
  }, [
    textSize,
    grayScale,
    highContrast,
    reverseContrast,
    whiteBackground,
    underlineLinks,
    readableFont,
  ])

  return (
    <div className={`accessibility-panel ${isVisible ? 'visible' : ''}`}>
      <div
        className='close-container'
        onClick={() => setIsAccessibility(false)}
      >
        <CloseIcon />
      </div>
      <div className='accessibility-controls'>
        <button onClick={increaseTextSize}>
          {prefs.isEnglish ? 'Increase Text Size' : 'הגדל טקסט'}
          <TextIncreaseIcon />
        </button>
        <button onClick={decreaseTextSize}>
          {prefs.isEnglish ? 'Decrease Text Size' : 'הקטן טקסט'}
          <TextDecreaseIcon />
        </button>
        <button onClick={() => setGrayScale((prev) => !prev)}>
          {prefs.isEnglish ? 'Gray Scale' : 'גווני אפור'}
          <FilterBAndWIcon />
        </button>
        <button onClick={() => setHighContrast((prev) => !prev)}>
          {prefs.isEnglish ? 'High Contrast' : 'ניגודיות גבוהה'}
          <ContrastIcon />
        </button>
        <button onClick={() => setReverseContrast((prev) => !prev)}>
          {prefs.isEnglish ? 'Reverse Contrast' : 'ניגודיות הפוכה'}
          <VisibilityIcon />
        </button>
        <button onClick={() => setWhiteBackground((prev) => !prev)}>
          {prefs.isEnglish ? 'White Background' : 'רקע בהיר'}
          <LightModeIcon />
        </button>
        <button onClick={() => setUnderlineLinks((prev) => !prev)}>
          {prefs.isEnglish ? 'Underline Links' : 'הדגשת קישורים'}
          <LinkIcon />
        </button>
        <button onClick={() => setReadableFont((prev) => !prev)}>
          {prefs.isEnglish ? 'Readable Font' : 'פונט קריא'}
          <SpellcheckIcon />
        </button>
        <button onClick={resetStyles}>
          {prefs.isEnglish ? 'Reset' : 'איפוס'} <RestartAltIcon />
        </button>
      </div>
      {underlineLinks && (
        <style>{`a { text-decoration: underline !important; }`}</style>
      )}
    </div>
  )
}