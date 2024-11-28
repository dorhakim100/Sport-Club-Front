import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { updateService } from '../services/update/update.service'
import { loadUpdates } from '../store/actions/update.actions'

import { HeadContainer } from '../cmps/HeadContainer'
import { AddUpdate } from '../cmps/AddUpdate.jsx'
import { UpdatesList } from '../cmps/UpdatesList.jsx'
import { UpdateControl } from '../cmps/UpdateControl.jsx'
import { ContactUs } from '../cmps/ContactUs'

import { Button } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { setIsLoading } from '../store/actions/system.actions'
import { showErrorMsg } from '../services/event-bus.service'

export function UpdateIndex() {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const updates = useSelector(
    (stateSelector) => stateSelector.updateModule.updates
  )

  const user = useSelector((stateSelector) => stateSelector.userModule.user)

  const [filter, setFilter] = useState(updateService.getDefaultFilter())
  const [maxPage, setMaxPage] = useState(0)

  const [isDragEdit, setDragEdit] = useState(false)

  useEffect(() => {
    setUpdates()
  }, [filter])

  async function setUpdates() {
    try {
      setIsLoading(true)
      await loadUpdates(filter)
      const max = await updateService.getMaxPage()
      setMaxPage(max)
    } catch (err) {
      console.log(err)
      showErrorMsg(
        prefs.isEnglish ? `Couldn't load updates` : 'טעינת עדכונים נכשלה'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='update-index-container'>
      <HeadContainer
        text={{
          eng: 'Updates',
          he: 'עדכונים',
        }}
      />
      <div className='update-control-container'>
        {user && user.isAdmin && <AddUpdate setUpdates={setUpdates} />}
        <div
          className='list-control-container'
          style={!user || !user.isAdmin ? { gridColumn: '1/-1' } : {}}
        >
          <UpdateControl
            setDragEdit={setDragEdit}
            isDragEdit={isDragEdit}
            filter={filter}
            setFilter={setFilter}
            maxPage={maxPage}
          />
          <UpdatesList
            updates={updates}
            isDragEdit={isDragEdit}
            loadUpdates={loadUpdates}
          />
        </div>
      </div>
      <ContactUs />
    </div>
  )
}
