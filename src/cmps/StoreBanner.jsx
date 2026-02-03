import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import Button from '@mui/material/Button'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

import storeCover from '../../public/imgs/items-cards.webp'
import emptyCart from '/imgs/empty-cart.svg'

export function StoreBanner() {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)

  const navigate = useNavigate()

  const handleNavigate = () => {
    navigate('/item')
  }

  return (
    <div
      className={`store-banner ${prefs.isDarkMode ? 'dark-mode' : ''}`}
      onClick={handleNavigate}
    >
      <div
        className={`cover-container ${prefs.isEnglish ? 'en' : 'he'} ${
          prefs.isDarkMode ? 'dark-mode' : ''
        }`}
      >
        <img
          src={storeCover}
          alt='store cover'
        />
      </div>
      <img
        src={emptyCart}
        alt='empty cart'
        className={`empty-cart ${prefs.isEnglish ? 'en' : 'he'}`}
      />
      <div className='text-container'>
        <h4>
          {' '}
          {prefs.isEnglish
            ? 'All our products in one place'
            : 'כל הציוד במקום אחד'}
        </h4>
        <span>
          {prefs.isEnglish
            ? 'Entrances and swimming accessories'
            : 'כרטיסיות ואביזרי שחייה'}
        </span>
      </div>
      <Button>
        {prefs.isEnglish ? 'View Store' : 'מעבר לחנות'}
        {prefs.isEnglish ? <ArrowForwardIcon /> : <ArrowBackIcon />}
      </Button>
    </div>
  )
}
