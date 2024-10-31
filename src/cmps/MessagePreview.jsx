import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { updateService } from '../services/update/update.service'
import { loadUpdates } from '../store/actions/update.actions'

import { loadMessages } from '../store/actions/message.actions'
import { messageService } from '../services/message/message.service'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { updateMessage } from '../store/actions/message.actions'

import { HeadContainer } from '../cmps/HeadContainer'
import { MessagesFilter } from '../cmps/MessagesFilter.jsx'
import { MessagesList } from '../cmps/MessagesList.jsx'
import { DoneMessageButton } from '../cmps/DoneMessageButton.jsx'

import { Button } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import DeleteIcon from '@mui/icons-material/Delete'

export function MessagePreview({ message, setMessages }) {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const navigate = useNavigate()

  const [isHover, setIsHover] = useState(false)

  async function handleDoneChange(messageId) {
    console.log(messageId)
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
      console.log(err)
      showErrorMsg(
        prefs.isEnglish ? `Couldn't mark message` : 'פעולה לא הצליחה'
      )
    }
  }

  return (
    <div
      className={
        message.isDone
          ? prefs.isDarkMode
            ? 'message-container done dark-mode'
            : 'message-container done'
          : prefs.isDarkMode
          ? 'message-container dark-mode'
          : 'message-container'
      }
      onClick={() => {
        if (isHover) return
        window.scrollTo({ top: 0, behavior: 'smooth' })
        navigate(`/admin/message/${message._id}`)
      }}
    >
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
