import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { debounce } from '../services/util.service'

import { HeadContainer } from '../cmps/HeadContainer'
import { MessagesFilter } from '../cmps/MessagesFilter.jsx'
import { MessagesList } from '../cmps/MessagesList.jsx'

import { Button } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { loadMessages } from '../store/actions/message.actions'
import { messageService } from '../services/message/message.service'
import { showErrorMsg } from '../services/event-bus.service'
import { setIsLoading } from '../store/actions/system.actions'

export function MessageIndex() {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)

  const messages = useSelector(
    (stateSelector) => stateSelector.messageModule.messages
  )

  const [filter, setFilter] = useState(messageService.getDefaultFilter())
  const [maxPage, setMaxPage] = useState()

  const [idsToRemove, setIdsToRemove] = useState([])

  const text = {
    eng: 'Messages',
    he: 'הודעות',
  }

  useEffect(() => {
    setMessages()
  }, [filter])
  async function setMessages() {
    try {
      setIsLoading(true)
      await loadMessages(filter)
      const max = await messageService.getMaxPage(filter)

      setMaxPage(max)
    } catch (err) {
      showErrorMsg(
        prefs.isEnglish ? `Couldn't load messages` : 'טעינת הודעות נכשלה'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='page-container message-index'>
      <HeadContainer text={text} />
      <MessagesFilter filter={filter} setFilter={setFilter} maxPage={maxPage} />
      <MessagesList
        messages={messages}
        setMessages={setMessages}
        idsToRemove={idsToRemove}
        setIdsToRemove={setIdsToRemove}
      />
    </div>
  )
}
