import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { smoothScroll } from '../services/util.service'

import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { updateMessage } from '../store/actions/message.actions'

import { DoneMessageButton } from '../cmps/DoneMessageButton.jsx'

import Checkbox from '@mui/material/Checkbox'

export function MessagePreview({
  message,
  setMessages,
  idsToRemove,
  setIdsToRemove,
}) {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const navigate = useNavigate()

  const [isHover, setIsHover] = useState(false)

  const label = { inputProps: { 'aria-label': 'Checkbox demo' } }

  async function handleDoneChange(messageId) {
    try {
      const messageToUpdate = { ...message, isDone: !message.isDone }

      await updateMessage(messageToUpdate)
      await setMessages()

      showSuccessMsg(
        prefs.isEnglish
          ? 'Message marked successfully'
          : 'סימון הודעה בוצע בהצלחה'
      )
    } catch (err) {
      // // console.log(err)
      showErrorMsg(
        prefs.isEnglish ? `Couldn't mark message` : 'פעולה לא הצליחה'
      )
    }
  }

  function toggleCheckBox() {
    if (idsToRemove.includes(message._id)) {
      const idx = idsToRemove.findIndex(
        (idToRemove) => idToRemove === message._id
      )
      idsToRemove.splice(idx, 1)
    } else {
      idsToRemove.push(message._id)
    }
    const newIds = [...idsToRemove]

    setIdsToRemove(newIds)
  }

  return (
    <div
      className={
        message.isDone
          ? prefs.isDarkMode
            ? 'list-item-container message done dark-mode'
            : 'list-item-container message done'
          : prefs.isDarkMode
          ? 'list-item-container message dark-mode'
          : 'list-item-container message'
      }
      onClick={(e) => {
        if (
          isHover ||
          e.target.closest('.checkbox-container') ||
          e.target.closest('.checkbox-container-check')
        )
          return

        smoothScroll()
        navigate(`/admin/message/${message._id}`)
      }}
    >
      <div
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        className='checkbox-container-check'
      >
        {/* <input type='checkbox' name='' id='' /> */}
        <Checkbox
          {...label}
          sx={{
            color: prefs.isDarkMode ? 'white' : 'inherit', // Color for the checkbox itself
            '&.Mui-checked': {
              color: prefs.isDarkMode ? '#6EC1E4' : '', // Color for the checkmark (v) when checked
            },
          }}
          checked={idsToRemove.includes(message._id)}
          onChange={toggleCheckBox}
        />

        {/* <label htmlFor=''>{prefs.isEnglish ? 'Remove' : 'הסר'}</label> */}
      </div>
      <span>{message.title}</span>
      <p>{message.content}</p>
      {/* <Button variant='contained'>
        <DeleteIcon />
      </Button> */}

      <DoneMessageButton
        message={message}
        setIsHover={setIsHover}
        setChange={setMessages}
      />
    </div>
  )
}
