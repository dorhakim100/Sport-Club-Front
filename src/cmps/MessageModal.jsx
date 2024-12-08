import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

import { useLocation, useNavigate } from 'react-router-dom'
import { setIsModal } from '../store/actions/system.actions'
import { smoothScroll } from '../services/util.service'

import { Button } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

export function MessageModal() {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const isModal = useSelector(
    (stateSelector) => stateSelector.systemModule.isModal
  )
  const modalMessage = useSelector(
    (stateSelector) => stateSelector.systemModule.modalMessage
  )

  const location = useLocation()
  const navigate = useNavigate()

  const modalRef = useRef()

  useEffect(() => {
    // setModalFalse()
  }, [location.pathname])

  useEffect(() => {
    if (isModal) {
      modalRef.current.style.zIndex = '1'
    }
  }, [isModal])

  const setModalFalse = () => {
    setIsModal(false)
    modalRef.current.style.zIndex = '-1'
  }

  const navigateToLink = () => {
    if (!modalMessage.link) return

    smoothScroll()
    navigate(modalMessage.link)
  }

  return (
    <div
      className={`modal-container ${isModal && 'visible'} ${
        prefs.isDarkMode && 'dark-mode'
      }`}
      //   style={isModal ? { zIndex: '1' } : { zIndex: '-1' }}
      // style={{ zIndex: '1' }}
      onClick={setModalFalse}
      ref={modalRef}
      style={{
        transition: 'opacity 0.3s ease-in-out',
        // visibility: !isModal && 'hidden',
      }}
    >
      <div className='modal-message-container'>
        <IconButton
          aria-label='delete'
          className='exit-button'
          onClick={setModalFalse}
        >
          <CloseIcon sx={{ color: prefs.isDarkMode ? 'white' : '' }} />
        </IconButton>
        <b>{prefs.isEnglish ? 'For your concern' : 'לידיעתכם'}</b>
        <p
          style={prefs.isEnglish ? { direction: 'ltr' } : { direction: 'rtl' }}
        >
          {prefs.isEnglish ? modalMessage.eng : modalMessage.he}
        </p>

        {modalMessage.link && (
          <Button variant='contained' onClick={navigateToLink}>
            {prefs.isEnglish ? 'more details' : 'למידע נוסף'}
          </Button>
        )}
        {modalMessage.func && (
          <Button variant='contained' onClick={modalMessage.func}>
            {prefs.isEnglish ? 'more details' : 'למידע נוסף'}
          </Button>
        )}
      </div>
    </div>
  )
}
