import { useSelector } from 'react-redux'

import { HeadContainer } from './HeadContainer'

import { Button } from '@mui/material'
import { LoadingButton } from '@mui/lab'

export function ContactUs() {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)

  return (
    <div className='contact-us-container'>
      <HeadContainer
        text={{
          eng: 'Contact us',
          he: 'צרו קשר',
        }}
      />
      <div
        className={
          prefs.isDarkMode ? 'input-container dark-mode' : 'input-container'
        }
      >
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
        <textarea name='' id='' style={{ resize: 'none' }} />
      </div>{' '}
      <LoadingButton variant='contained'>
        {prefs.isEnglish ? 'Send' : 'שליחה'}
      </LoadingButton>
    </div>
  )
}
