import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { HeadContainer } from '../cmps/HeadContainer'
import { MessagesFilter } from '../cmps/MessagesFilter.jsx'
import { MessagesList } from '../cmps/MessagesList.jsx'

import {
  loadMessages,
  loadOpenMessages,
} from '../store/actions/message.actions'
import { messageService } from '../services/message/message.service'
import { showErrorMsg } from '../services/event-bus.service'
import { setIsLoading } from '../store/actions/system.actions'
import { socketService, SOCKET_EVENT_ADD_MSG } from '../services/socket.service'

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

  useEffect(() => {
    const handleNewMsg = async () => {
      try {
        setMessages(messageService.getDefaultFilter())
      } catch (err) {
        // console.log(`Couldn't load socket event`)
      }
    }
    socketService.on(SOCKET_EVENT_ADD_MSG, handleNewMsg)
    return () => {
      socketService.off(SOCKET_EVENT_ADD_MSG, handleNewMsg)
    }
  }, [])

  async function setMessages() {
    try {
      setIsLoading(true)

      await loadMessages(filter)
      const max = await messageService.getMaxPage(filter)
      await loadOpenMessages()

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
    <div className='message-index'>
      <HeadContainer text={text} />
      <MessagesFilter
        filter={filter}
        setFilter={setFilter}
        maxPage={maxPage}
        idsToRemove={idsToRemove}
        setIdsToRemove={setIdsToRemove}
      />
      <MessagesList
        messages={messages}
        setMessages={setMessages}
        idsToRemove={idsToRemove}
        setIdsToRemove={setIdsToRemove}
      />
    </div>
  )
}
