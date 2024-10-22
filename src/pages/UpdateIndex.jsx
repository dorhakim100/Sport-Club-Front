import { useSelector } from 'react-redux'

import { HeadContainer } from '../cmps/HeadContainer'
import { AddUpdate } from '../cmps/AddUpdate.jsx'

import { Button } from '@mui/material'
import { LoadingButton } from '@mui/lab'

export function UpdateIndex() {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  return (
    <div className='update-index-container'>
      <HeadContainer
        text={{
          eng: 'Updates',
          he: 'עדכונים',
        }}
      />
      <div className='add-update-container'>
        <AddUpdate />
      </div>
    </div>
  )
}
