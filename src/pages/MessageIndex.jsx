import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { updateService } from '../services/update/update.service'
import { loadUpdates } from '../store/actions/update.actions'

import { HeadContainer } from '../cmps/HeadContainer'
import { MessagesFilter } from '../cmps/MessagesFilter.jsx'
import { MessagesList } from '../cmps/MessagesList.jsx'

import { Button } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { loadMessages } from '../store/actions/message.actions'
import { messageService } from '../services/message/message.service'
import { showErrorMsg } from '../services/event-bus.service'

export function MessageIndex() {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)

  const messages = useSelector(
    (stateSelector) => stateSelector.messageModule.messages
  )

  const [filter, setFilter] = useState(messageService.getDefaultFilter())

  const text = {
    eng: 'Messages',
    he: 'הודעות',
  }

  useEffect(() => {
    setMessages()
  }, [])
  async function setMessages() {
    try {
      await loadMessages()
    } catch (err) {
      showErrorMsg(
        prefs.isEnglish ? `Couldn't load messages` : 'טעינת הודעות נכשלה'
      )
    }
  }

  return (
    <div className='page-container message-index'>
      <HeadContainer text={text} />
      <MessagesFilter />
      <MessagesList messages={messages} setMessages={setMessages} />
    </div>
  )
}
