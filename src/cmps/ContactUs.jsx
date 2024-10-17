import { useSelector } from 'react-redux'

import { Button } from '@mui/material'
import { LoadingButton } from '@mui/lab'

export function ContactUs() {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)

  return (
    <div className='contact-us-container'>
      <div className='head-container'>
        <h3>
          <span
            style={
              prefs.isDarkMode
                ? { backgroundColor: '#2C3E50' }
                : { backgroundColor: '#F5F5F5' }
            }
          >
            {prefs.isEnglish ? 'Contact us' : 'צרו קשר'}
          </span>
        </h3>
      </div>
      <div className='input-container'>
        <input
          type='text'
          name=''
          id=''
          placeholder={prefs.isEnglish ? 'Name' : 'שם'}
        />
        <input
          type='text'
          name=''
          id=''
          placeholder={prefs.isEnglish ? 'Phone' : 'טלפון'}
        />
        <textarea name='' id='' />
      </div>{' '}
      <LoadingButton variant='contained'>
        {prefs.isEnglish ? 'Send' : 'שליחה'}
      </LoadingButton>
    </div>
  )
}
