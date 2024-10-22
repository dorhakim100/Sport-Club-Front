import { useSelector } from 'react-redux'

import { updateCart } from '../store/actions/user.actions'

import { Button } from '@mui/material'
import { setIsLoading } from '../store/actions/system.actions'

export function RemoveModal({ isModal, setIsModal, item }) {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const user = useSelector((stateSelector) => stateSelector.userModule.user)

  async function onRemoveFromCart() {
    const idx = user.items.findIndex(
      (itemToRemove) => itemToRemove.id === item.id
    )
    user.items.splice(idx, 1)

    try {
      setIsLoading(true)
      const saved = await updateCart({ ...user })
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
      setIsModal(false)
    }
  }

  return (
    <div
      className={
        isModal ? 'remove-modal-container visible' : 'remove-modal-container'
      }
    >
      <div className='control-container'>
        <b>{prefs.isEnglish ? 'Remove item?' : 'להסיר מוצר?'}</b>
        <div className='buttons-container'>
          <Button variant='contained' onClick={() => onRemoveFromCart()}>
            {prefs.isEnglish ? 'Remove' : 'להסיר'}
          </Button>
          <Button
            variant='outlined'
            onClick={() => setIsModal(false)}
            sx={
              prefs.isDarkMode
                ? {
                    color: '#6EC1E4', // Light blue text color
                    borderColor: '#6EC1E4', // Light blue border color
                    transition: '0.3s ease-out',
                    '&:hover': {
                      backgroundColor: 'rgba(110, 193, 228, 0.1)', // Light blue transparent hover background
                      borderColor: '#4A90E2', // Slightly darker border on hover
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
            {prefs.isEnglish ? 'Cancel' : 'ביטול'}
          </Button>
        </div>
      </div>
    </div>
  )
}
