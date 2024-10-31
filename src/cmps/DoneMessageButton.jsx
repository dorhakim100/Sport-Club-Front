import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { updateMessage } from '../store/actions/message.actions'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'

export function DoneMessageButton({ message, setIsHover, setChange }) {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)

  async function handleDoneChange(messageId) {
    console.log(messageId)
    try {
      const messageToUpdate = { ...message, isDone: !message.isDone }

      await updateMessage(messageToUpdate)
      if (setChange) await setChange()

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
        prefs.isDarkMode ? 'checkbox-container dark-mode' : 'checkbox-container'
      }
      onMouseEnter={() => {
        if (setIsHover) setIsHover(true)
      }}
      onMouseLeave={() => {
        if (setIsHover) setIsHover(false)
      }}
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
  )
}
