import { useSelector } from 'react-redux'

import { Button } from '@mui/material'

export function ConfirmModal({
  isModal,
  setIsModal,
  onRemove,
  textObject = {
    title: { he: 'להסיר?', eng: 'Remove?' },
    cancelButton: { he: 'ביטול', eng: 'Cancel' },
    submitButton: { he: 'להסיר', eng: 'Remove' },
  },
  page,
}) {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const user = useSelector((stateSelector) => stateSelector.userModule.user)

  return (
    <div
      className={
        isModal
          ? `modal-container visible ${page ? page : ''}`
          : 'modal-container'
      }
    >
      <div className='control-container'>
        <b>{prefs.isEnglish ? textObject.title.eng : textObject.title.he}</b>
        <div className='buttons-container'>
          <Button variant='contained' onClick={onRemove}>
            {prefs.isEnglish
              ? textObject.submitButton.eng
              : textObject.submitButton.he}
          </Button>
          <Button
            variant='outlined'
            onClick={() => setIsModal(false)}
            sx={
              prefs.isDarkMode
                ? {
                    color: '#4A90E2', // Light blue text color
                    borderColor: '#4A90E2', // Light blue border color
                    transition: '0.3s ease-out',
                    '&:hover': {
                      backgroundColor: 'rgba(110, 193, 228, 0.1)', // Light blue transparent hover background
                      borderColor: '#2C3E50', // Slightly darker border on hover
                      color: '#2C3E50',
                    },
                  }
                : {
                    color: 'inherit', // Default text color
                    borderColor: 'inherit', // Default border color
                    transition: '0.3s ease-out',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)', // Default light transparent background on hover
                      borderColor: 'inherit', // Keep border same as default
                    },
                  }
            }
          >
            {prefs.isEnglish
              ? textObject.cancelButton.eng
              : textObject.cancelButton.he}
          </Button>
        </div>
      </div>
    </div>
  )
}
