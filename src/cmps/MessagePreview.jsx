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

import { Button } from '@mui/material'
import { LoadingButton } from '@mui/lab'

export function MessagePreview({ message, setMessages }) {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)

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
    >
      <span>{message.title}</span>
      <p>{message.content}</p>
      <div
        className={
          prefs.isDarkMode
            ? 'checkbox-container dark-mode'
            : 'checkbox-container'
        }
      >
        <label htmlFor={`${message._id}Done`}>
          {prefs.isEnglish ? 'Done' : 'בוצע'}
        </label>
        <input
          type='checkbox'
          name=''
          id={`${message._id}Done`}
          onChange={() => handleDoneChange(message._id)}
          checked={message.isDone}
        />
      </div>
    </div>
  )
}
